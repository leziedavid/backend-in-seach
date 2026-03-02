import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { SearchDto } from './dto/search.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { FunctionService } from '../utils/pagination.service';
import { LocalStorageService } from '../utils/LocalStorageService';
import { GlobalDataMapper } from '../utils/mapper';
import { MyLogger } from '../utils/logger';
import { Prisma, Role, BookingStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private functionService: FunctionService,
    private localStorageService: LocalStorageService,
    private mapper: GlobalDataMapper,
    private logger: MyLogger,
  ) { }

  async register(dto: RegisterDto) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone: dto.phone }],
      },
    });

    if (userExists) {
      throw new BadRequestException(
        'User with this email or phone already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        role: dto.role || 'CLIENT',
      },
    });

    this.logger.log(`User registered: ${user.email} with role ${user.role}`, 'AuthService');
    return this.getTokens(user.id, user.email, user.role, user.fullName, user.phone);
  }

  async login(dto: LoginDto) {

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.identifier }, { phone: dto.identifier }],
      },
    });

    if (!user) {
      this.logger.warn('Tentative de connexion', 'AuthService', {
        metadata: { phone: dto.identifier, status: 'FAILED' }
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      this.logger.warn('Tentative de connexion', 'AuthService', {
        metadata: { phone: dto.identifier, status: 'FAILED' }
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log('Tentative de connexion', 'AuthService', {
      metadata: { phone: dto.identifier, status: 'SUCCESS' }
    });
    return this.getTokens(user.id, user.email, user.role, user.fullName, user.phone);
  }

  async getTokens(userId: string, email: string, role: string, fullName: string | null, phone: string | null) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role, fullName, phone },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: this.configService.get('JWT_ACCESS_EXPIRE'),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRE'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    return this.mapper.mapUser(user);
  }

  async reconnect(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    const tokens = await this.getTokens(user.id, user.email, user.role, user.fullName, user.phone);
    return {
      ...tokens,
      user: this.mapper.mapUser(user),
    };
  }

  async reverseGeocode(lat: number, lon: number): Promise<any> {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`, { headers: { 'User-Agent': 'inSeach-App' } },);
      if (!response.ok)
        throw new InternalServerErrorException(
          'Erreur lors de la récupération de la localisation',
        );
      const data = await response.json();
      return data;
    } catch (err) {
      this.logger.error('Reverse geocoding error', err instanceof Error ? err.stack : String(err), 'AuthService');
      return {
        lat,
        lng: lon,
        error: 'Impossible de récupérer l’adresse via reverse-geocoding',
      };
    }
  }

  /**
   * Récupère les données globales d'un utilisateur (Mon Espace)
   */
  async getGlobalDataByUserId(userId: string, search: SearchDto) {
    const { lat, lng, radiusKm = 15, query, page = 1, limit = 10, activeTab = 'Services', } = search;

    // 1. Informations Profil
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: { include: { plan: true } } },
    });

    if (!user) throw new BadRequestException('Utilisateur non trouvé');

    const isProvider = user.role === Role.PRESTATAIRE;

    // 2. Services
    const servicesOptions: any = {
      model: 'service',
      page: activeTab === 'Services' ? page : 1,
      limit: activeTab === 'Services' ? limit : 20, // Plus de preview si pas l'onglet actif
      conditions: { userId },
      orderBy: { createdAt: 'desc' },
      selectAndInclude: { include: { category: true } },
      fileTypeListes: ['servicesFiles'],
    };

    if (query) {
      servicesOptions.conditions.title = {
        contains: query,
        mode: 'insensitive',
      };
    }

    const servicesResult = await this.functionService.paginate(servicesOptions);

    // 3. Annonces liée à l'user
    const annoncesConditions: any = { userId };
    if (query) {
      annoncesConditions.title = { contains: query, mode: 'insensitive' };
    }

    const annoncesTotal = await this.prisma.annonce.count({
      where: annoncesConditions,
    });
    const annoncesResult = await this.prisma.annonce.findMany({
      where: annoncesConditions,
      include: { type: true, categorie: true },
      orderBy: { createdAt: 'desc' },
      skip: activeTab === 'Annonces' ? (page - 1) * limit : 0,
      take: activeTab === 'Annonces' ? limit : 20,
    });

    // Enrichir annonces avec images
    const annoncesEnriched = await Promise.all(
      annoncesResult.map(async (annonce) => {
        const files = await this.prisma.fileManager.findMany({
          where: { targetId: annonce.id, fileType: 'annoncesFiles' },
        });
        return { ...annonce, files };
      }),
    );

    // 4. Bookings & Historique
    const bookingBaseConditions: any = isProvider
      ? { providerId: userId }
      : { clientId: userId };

    // Communs pour enrichment
    const bookingInclude = {
      service: { include: { category: true } },
      client: { include: { subscription: { include: { plan: true } } } },
      provider: { include: { subscription: { include: { plan: true } } } },
    };

    const activeConditions = {
      ...bookingBaseConditions,
      status: { notIn: [BookingStatus.COMPLETED, BookingStatus.CANCELLED] },
    };

    const activeBookingsTotal = await this.prisma.booking.count({
      where: activeConditions,
    });
    const activeBookings = await this.prisma.booking.findMany({
      where: activeConditions,
      include: bookingInclude,
      orderBy: { createdAt: 'desc' },
      skip: activeTab === 'Rendez-vous' ? (page - 1) * limit : 0,
      take: activeTab === 'Rendez-vous' ? limit : 20,
    });

    const historyConditions = {
      ...bookingBaseConditions,
      status: BookingStatus.COMPLETED,
    };

    const historyBookingsTotal = await this.prisma.booking.count({
      where: historyConditions,
    });
    const historyBookings = await this.prisma.booking.findMany({
      where: historyConditions,
      include: bookingInclude,
      orderBy: { createdAt: 'desc' },
      skip: activeTab === 'Historique' ? (page - 1) * limit : 0,
      take: activeTab === 'Historique' ? limit : 20,
    });

    const enrichWithFiles = async (list: any[]) => {
      return Promise.all(
        list.map(async (b) => {
          const files = await this.prisma.fileManager.findMany({
            where: { targetId: b.serviceId, fileType: 'servicesFiles' },
          });
          return { ...b, files };
        }),
      );
    };

    const activeEnriched = await enrichWithFiles(activeBookings);
    const historyEnriched = await enrichWithFiles(historyBookings);

    // 5. Calcul des Gains
    let totalGain = 0;
    if (isProvider) {
      const aggregated = await this.prisma.booking.aggregate({
        where: { providerId: userId, status: BookingStatus.COMPLETED },
        _sum: { price: true },
      });
      totalGain = aggregated._sum.price || 0;
    }

    // 6. Pagination root selon l'onglet
    let rootTotal = servicesResult.total;
    let rootTotalPages = servicesResult.totalPages;

    if (activeTab === 'Annonces') {
      rootTotal = annoncesTotal;
      rootTotalPages = Math.ceil(annoncesTotal / limit);
    } else if (activeTab === 'Rendez-vous') {
      rootTotal = activeBookingsTotal;
      rootTotalPages = Math.ceil(activeBookingsTotal / limit);
    } else if (activeTab === 'Historique') {
      rootTotal = historyBookingsTotal;
      rootTotalPages = Math.ceil(historyBookingsTotal / limit);
    }

    return {
      user: this.mapper.mapUser(user),
      services: this.mapper.mapCollection(servicesResult.data, 'service'),
      annonces: this.mapper.mapCollection(annoncesEnriched, 'annonce'),
      bookings: this.mapper.mapCollection(activeEnriched, 'booking'),
      history: this.mapper.mapCollection(historyEnriched, 'booking'),
      totalGain: isProvider ? totalGain : 0,
      page,
      limit,
      total: rootTotal,
      totalPages: rootTotalPages,
    };
  }

  /**
   * Récupère les données globales basées uniquement sur les critères de recherche
   */
  async getGlobalDataBySearch(search: SearchDto) {
    const { lat, lng, radiusKm = 15, query, page = 1, limit = 10, activeTab = 'Services', } = search;

    // 1. Services
    const servicesOptions: any = {
      model: 'service',
      page: activeTab === 'Services' ? page : 1,
      limit: activeTab === 'Services' ? limit : 20,
      conditions: {},
      orderBy: { createdAt: 'desc' },
      selectAndInclude: { include: { category: true } },
      fileTypeListes: ['servicesFiles'],
    };

    if (query) {
      servicesOptions.conditions.title = {
        contains: query,
        mode: 'insensitive',
      };
    }

    if (lat && lng) {
      const latDelta = radiusKm / 111;
      const lngDelta = radiusKm / (111 * Math.cos(lat * (Math.PI / 180)));
      servicesOptions.conditions.latitude = {
        gte: lat - latDelta,
        lte: lat + latDelta,
      };
      servicesOptions.conditions.longitude = {
        gte: lng - lngDelta,
        lte: lng + lngDelta,
      };
    }

    const servicesResult = await this.functionService.paginate(servicesOptions);

    // 2. Annonces
    const annoncesConditions: any = {};

    if (query) {
      annoncesConditions.title = { contains: query, mode: 'insensitive' };
    }

    if (lat && lng) {
      const latDelta = radiusKm / 111;
      const lngDelta = radiusKm / (111 * Math.cos(lat * (Math.PI / 180)));
      annoncesConditions.latitude = {
        gte: lat - latDelta,
        lte: lat + latDelta,
      };
      annoncesConditions.longitude = {
        gte: lng - lngDelta,
        lte: lng + lngDelta,
      };
    }

    const annoncesTotal = await this.prisma.annonce.count({
      where: annoncesConditions,
    });
    const annoncesResult = await this.prisma.annonce.findMany({
      where: annoncesConditions,
      include: { type: true, categorie: true },
      orderBy: { createdAt: 'desc' },
      skip: activeTab === 'Annonces' ? (page - 1) * limit : 0,
      take: activeTab === 'Annonces' ? limit : 20,
    });

    // Enrichir annonces avec images
    const annoncesEnriched = await Promise.all(
      annoncesResult.map(async (annonce) => {
        const files = await this.prisma.fileManager.findMany({
          where: { targetId: annonce.id, fileType: 'annoncesFiles' },
        });
        return { ...annonce, files };
      }),
    );

    // 3. Bookings publics (réservations actives)
    const activeBookingsTotal = await this.prisma.booking.count({
      where: {
        status: { notIn: [BookingStatus.COMPLETED, BookingStatus.CANCELLED] },
      },
    });

    const activeBookings = await this.prisma.booking.findMany({
      where: {
        status: { notIn: [BookingStatus.COMPLETED, BookingStatus.CANCELLED] },
      },
      include: {
        service: { include: { category: true } },
        client: { select: { id: true, fullName: true } },
        provider: { select: { id: true, fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: activeTab === 'Rendez-vous' ? (page - 1) * limit : 0,
      take: activeTab === 'Rendez-vous' ? limit : 20,
    });

    // Enrichir bookings avec fichiers
    const enrichWithFiles = async (list: any[]) => {
      return Promise.all(
        list.map(async (b) => {
          const files = await this.prisma.fileManager.findMany({
            where: { targetId: b.serviceId, fileType: 'servicesFiles' },
          });
          return { ...b, files };
        }),
      );
    };

    const activeEnriched = await enrichWithFiles(activeBookings);

    // 4. Statistiques globales
    const stats = {
      totalServices: await this.prisma.service.count({
        where: servicesOptions.conditions,
      }),
      totalAnnonces: annoncesTotal,
      totalActiveBookings: activeBookingsTotal,
      totalUsers: await this.prisma.user.count(),
      totalPrestataires: await this.prisma.user.count({
        where: { role: Role.PRESTATAIRE },
      }),
    };

    // 5. Pagination root selon l'onglet
    let rootTotal = servicesResult.total;
    let rootTotalPages = servicesResult.totalPages;

    if (activeTab === 'Annonces') {
      rootTotal = annoncesTotal;
      rootTotalPages = Math.ceil(annoncesTotal / limit);
    } else if (activeTab === 'Rendez-vous') {
      rootTotal = activeBookingsTotal;
      rootTotalPages = Math.ceil(activeBookingsTotal / limit);
    }

    // 6. Mapping & Retour
    return {
      services: this.mapper.mapCollection(servicesResult.data, 'service'),
      annonces: this.mapper.mapCollection(annoncesEnriched, 'annonce'),
      bookings: this.mapper.mapCollection(activeEnriched, 'booking'),
      stats,
      searchParams: { lat, lng, radiusKm, query },
      page,
      limit,
      total: rootTotal,
      totalPages: rootTotalPages,
    };
  }
}
