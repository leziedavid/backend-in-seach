"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const config_1 = require("@nestjs/config");
const pagination_service_1 = require("../utils/pagination.service");
const LocalStorageService_1 = require("../utils/LocalStorageService");
const mapper_1 = require("../utils/mapper");
const logger_1 = require("../utils/logger");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    prisma;
    jwtService;
    configService;
    functionService;
    localStorageService;
    mapper;
    logger;
    constructor(prisma, jwtService, configService, functionService, localStorageService, mapper, logger) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.functionService = functionService;
        this.localStorageService = localStorageService;
        this.mapper = mapper;
        this.logger = logger;
    }
    async register(dto) {
        const userExists = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: dto.email }, { phone: dto.phone }],
            },
        });
        if (userExists) {
            throw new common_1.BadRequestException('User with this email or phone already exists');
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
    async login(dto) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: dto.identifier }, { phone: dto.identifier }],
            },
        });
        if (!user) {
            this.logger.warn('Tentative de connexion', 'AuthService', {
                metadata: { phone: dto.identifier, status: 'FAILED' }
            });
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const passwordMatches = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatches) {
            this.logger.warn('Tentative de connexion', 'AuthService', {
                metadata: { phone: dto.identifier, status: 'FAILED' }
            });
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        this.logger.log('Tentative de connexion', 'AuthService', {
            metadata: { phone: dto.identifier, status: 'SUCCESS' }
        });
        return this.getTokens(user.id, user.email, user.role, user.fullName, user.phone);
    }
    async getTokens(userId, email, role, fullName, phone) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ sub: userId, email, role, fullName, phone }, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRE'),
            }),
            this.jwtService.signAsync({ sub: userId, email, role }, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRE'),
            }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    async getMe(userId) {
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
            throw new common_1.UnauthorizedException('Utilisateur non trouvé');
        }
        return this.mapper.mapUser(user);
    }
    async reconnect(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Utilisateur non trouvé');
        }
        const tokens = await this.getTokens(user.id, user.email, user.role, user.fullName, user.phone);
        return {
            ...tokens,
            user: this.mapper.mapUser(user),
        };
    }
    async reverseGeocode(lat, lon) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`, { headers: { 'User-Agent': 'inSeach-App' } });
            if (!response.ok)
                throw new common_1.InternalServerErrorException('Erreur lors de la récupération de la localisation');
            const data = await response.json();
            return data;
        }
        catch (err) {
            this.logger.error('Reverse geocoding error', err instanceof Error ? err.stack : String(err), 'AuthService');
            return {
                lat,
                lng: lon,
                error: 'Impossible de récupérer l’adresse via reverse-geocoding',
            };
        }
    }
    async getGlobalDataByUserId(userId, search) {
        const { lat, lng, radiusKm = 15, query, page = 1, limit = 10, activeTab = 'Services', } = search;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { subscription: { include: { plan: true } } },
        });
        if (!user)
            throw new common_1.BadRequestException('Utilisateur non trouvé');
        const isProvider = user.role === client_1.Role.PRESTATAIRE;
        const servicesOptions = {
            model: 'service',
            page: activeTab === 'Services' ? page : 1,
            limit: activeTab === 'Services' ? limit : 20,
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
        const annoncesConditions = { userId };
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
        const annoncesEnriched = await Promise.all(annoncesResult.map(async (annonce) => {
            const files = await this.prisma.fileManager.findMany({
                where: { targetId: annonce.id, fileType: 'annoncesFiles' },
            });
            return { ...annonce, files };
        }));
        const bookingBaseConditions = isProvider
            ? { providerId: userId }
            : { clientId: userId };
        const bookingInclude = {
            service: { include: { category: true } },
            client: { include: { subscription: { include: { plan: true } } } },
            provider: { include: { subscription: { include: { plan: true } } } },
        };
        const activeConditions = {
            ...bookingBaseConditions,
            status: { notIn: [client_1.BookingStatus.COMPLETED, client_1.BookingStatus.CANCELLED] },
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
            status: client_1.BookingStatus.COMPLETED,
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
        const enrichWithFiles = async (list) => {
            return Promise.all(list.map(async (b) => {
                const files = await this.prisma.fileManager.findMany({
                    where: { targetId: b.serviceId, fileType: 'servicesFiles' },
                });
                return { ...b, files };
            }));
        };
        const activeEnriched = await enrichWithFiles(activeBookings);
        const historyEnriched = await enrichWithFiles(historyBookings);
        let totalGain = 0;
        if (isProvider) {
            const aggregated = await this.prisma.booking.aggregate({
                where: { providerId: userId, status: client_1.BookingStatus.COMPLETED },
                _sum: { price: true },
            });
            totalGain = aggregated._sum.price || 0;
        }
        let rootTotal = servicesResult.total;
        let rootTotalPages = servicesResult.totalPages;
        if (activeTab === 'Annonces') {
            rootTotal = annoncesTotal;
            rootTotalPages = Math.ceil(annoncesTotal / limit);
        }
        else if (activeTab === 'Rendez-vous') {
            rootTotal = activeBookingsTotal;
            rootTotalPages = Math.ceil(activeBookingsTotal / limit);
        }
        else if (activeTab === 'Historique') {
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
    async getGlobalDataBySearch(search) {
        const { lat, lng, radiusKm = 15, query, page = 1, limit = 10, activeTab = 'Services', } = search;
        const servicesOptions = {
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
        const annoncesConditions = {};
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
        const annoncesEnriched = await Promise.all(annoncesResult.map(async (annonce) => {
            const files = await this.prisma.fileManager.findMany({
                where: { targetId: annonce.id, fileType: 'annoncesFiles' },
            });
            return { ...annonce, files };
        }));
        const activeBookingsTotal = await this.prisma.booking.count({
            where: {
                status: { notIn: [client_1.BookingStatus.COMPLETED, client_1.BookingStatus.CANCELLED] },
            },
        });
        const activeBookings = await this.prisma.booking.findMany({
            where: {
                status: { notIn: [client_1.BookingStatus.COMPLETED, client_1.BookingStatus.CANCELLED] },
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
        const enrichWithFiles = async (list) => {
            return Promise.all(list.map(async (b) => {
                const files = await this.prisma.fileManager.findMany({
                    where: { targetId: b.serviceId, fileType: 'servicesFiles' },
                });
                return { ...b, files };
            }));
        };
        const activeEnriched = await enrichWithFiles(activeBookings);
        const stats = {
            totalServices: await this.prisma.service.count({
                where: servicesOptions.conditions,
            }),
            totalAnnonces: annoncesTotal,
            totalActiveBookings: activeBookingsTotal,
            totalUsers: await this.prisma.user.count(),
            totalPrestataires: await this.prisma.user.count({
                where: { role: client_1.Role.PRESTATAIRE },
            }),
        };
        let rootTotal = servicesResult.total;
        let rootTotalPages = servicesResult.totalPages;
        if (activeTab === 'Annonces') {
            rootTotal = annoncesTotal;
            rootTotalPages = Math.ceil(annoncesTotal / limit);
        }
        else if (activeTab === 'Rendez-vous') {
            rootTotal = activeBookingsTotal;
            rootTotalPages = Math.ceil(activeBookingsTotal / limit);
        }
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        pagination_service_1.FunctionService,
        LocalStorageService_1.LocalStorageService,
        mapper_1.GlobalDataMapper,
        logger_1.MyLogger])
], AuthService);
//# sourceMappingURL=auth.service.js.map