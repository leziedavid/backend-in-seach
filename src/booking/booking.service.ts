import { Injectable, BadRequestException, ForbiddenException, NotFoundException, InternalServerErrorException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus, Prisma } from '@prisma/client';
import { SocketGateway } from '../socket/socket.gateway';
import { PaymentService } from '../payment/payment.service';
import { CreateBookingDto } from './dto/booking.dto';
import { FunctionService } from '../utils/pagination.service';
import { LocalStorageService } from '../utils/LocalStorageService';
import { MyLogger } from '../utils/logger';
import { getPaginationValues } from '../utils/helper';
import { generateUniqueCode } from '../utils/code-generator.util';

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private socketGateway: SocketGateway,
    private paymentService: PaymentService,
    private functionService: FunctionService,
    private localStorageService: LocalStorageService,
    private logger: MyLogger,
  ) { }

  async create(clientId: string, dto: CreateBookingDto) {
    const {
      serviceId,
      interventionType,
      scheduledDate,
      scheduledTime,
      description,
    } = dto;
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) throw new BadRequestException('Service not found');
    if (service.userId === clientId)
      throw new BadRequestException('You cannot book your own service');

    const userQrCode = `USER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const prestaQrCode = `PRESTA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const code = generateUniqueCode('BK');

    const booking = await this.prisma.booking.create({
      data: {
        clientId,
        providerId: service.userId,
        serviceId,
        status: BookingStatus.PENDING,
        interventionType,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
        scheduledTime,
        description,
        userQrCode,
        prestaQrCode,
        code,
      },
      include: { client: true, provider: true, service: true },
    });

    // Notify Provider
    this.socketGateway.notifyUser(booking.providerId, 'new_booking', booking);

    this.logger.log(`Booking created: ${booking.id} for service ${serviceId} by client ${clientId}`, 'BookingService');
    return booking;
  }

  async update(clientId: string, bookingId: string, dto: Partial<CreateBookingDto> & { status?: BookingStatus },) {
    // 1️⃣ Vérifier que le booking existe
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: true },
    });
    if (!booking) throw new BadRequestException('Booking not found');

    // 2️⃣ Vérifier que le client est autorisé
    if (booking.clientId !== clientId) {
      throw new ForbiddenException('You can only update your own bookings');
    }

    // 3️⃣ Vérifier que le client ne change pas un booking déjà payé ou terminé
    const forbiddenStatuses: BookingStatus[] = [
      BookingStatus.COMPLETED,
      BookingStatus.PAID,
    ];
    if (forbiddenStatuses.includes(booking.status)) {
      throw new BadRequestException(
        'Cannot update a completed or paid booking',
      );
    }

    // 4️⃣ Mise à jour des champs
    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        scheduledDate: dto.scheduledDate ? new Date(dto.scheduledDate) : booking.scheduledDate,
        scheduledTime: dto.scheduledTime ?? booking.scheduledTime,
        interventionType: dto.interventionType ?? booking.interventionType,
        description: dto.description ?? booking.description,
        status: dto.status ?? booking.status, // si tu veux permettre au client de changer le statut dans certains cas
      },
      include: { client: true, provider: true, service: true },
    });

    // 5️⃣ Notification (si status change)
    if (dto.status && dto.status !== booking.status) {
      this.socketGateway.notifyUser(
        updatedBooking.providerId,
        'booking_status_updated',
        updatedBooking,
      );
      this.socketGateway.notifyUser(
        updatedBooking.clientId,
        'booking_status_updated',
        updatedBooking,
      );
    }

    this.logger.log(`Booking updated: ${bookingId} by client ${clientId}`, 'BookingService');
    return updatedBooking;
  }

  async updateStatus(userId: string, bookingId: string, status: BookingStatus) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new BadRequestException('Booking not found');

    // Simple workflow rules
    const isProvider = booking.providerId === userId;
    const isClient = booking.clientId === userId;

    if (status === BookingStatus.CANCELLED) {
      if (!isClient || booking.status !== BookingStatus.PENDING) {
        throw new ForbiddenException(
          'Only client can cancel a PENDING booking',
        );
      }
    }

    if (status === BookingStatus.ACCEPTED && !isProvider) {
      throw new ForbiddenException('Only provider can accept a booking');
    }

    if (status === BookingStatus.PAID) {
      if (!isClient)
        throw new ForbiddenException('Only client can initiate payment');
      if (!booking.price)
        throw new BadRequestException('Booking price not set');
      await this.paymentService.deductCredits(userId, booking.price);
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: { client: true, provider: true, service: true },
    });

    // Notify both parties
    this.socketGateway.notifyUser(
      booking.clientId,
      'booking_status_updated',
      updatedBooking,
    );
    this.socketGateway.notifyUser(
      booking.providerId,
      'booking_status_updated',
      updatedBooking,
    );

    this.logger.log(`Booking status updated: ${bookingId} to ${status} by user ${userId}`, 'BookingService');
    return updatedBooking;
  }

  async getAllBookings(page = 1, limit = 10) {
    const { skip, take } = getPaginationValues(page, limit);

    // 1️⃣ Récupère les bookings avec relations
    const bookings = await this.prisma.booking.findMany({
      include: { client: true, provider: true, service: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });

    // 2️⃣ Enrichir chaque service avec ses fichiers
    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const files = await this.prisma.fileManager.findMany({
          where: { targetId: booking.serviceId, fileType: 'servicesFiles' },
        });

        return {
          ...booking,
          service: {
            ...booking.service,
            files,
          },
        };
      }),
    );
    // 3️⃣ Total pour pagination
    const total = await this.prisma.booking.count();
    return {
      data: enrichedBookings,
      total,
      totalPages: Math.ceil(total / limit),
      page,
    };
  }

  async getMyBookings(userId: string, page = 1, limit = 10) {
    const { skip, take } = getPaginationValues(page, limit);
    const bookings = await this.prisma.booking.findMany({
      where: { clientId: userId },
      include: { client: true, provider: true, service: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });

    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const files = await this.prisma.fileManager.findMany({
          where: { targetId: booking.serviceId, fileType: 'servicesFiles' },
        });
        return {
          ...booking,
          service: {
            ...booking.service,
            files,
          },
        };
      }),
    );

    const total = await this.prisma.booking.count({
      where: { clientId: userId },
    });
    return {
      data: enrichedBookings,
      total,
      totalPages: Math.ceil(total / limit),
      page,
    };
  }

  async getCalendarData(userId: string, year?: number, month?: number) {
    try {
      // 1️⃣ Vérifier l'utilisateur
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('Utilisateur introuvable');

      // 2️⃣ Déterminer la période (month est 1-based depuis le frontend)
      const currentDate = new Date();
      const targetYear = year ?? currentDate.getFullYear();
      const targetMonth = month ? month - 1 : currentDate.getMonth(); // On convertit en 0-based pour JS

      // On utilise UTC pour éviter les décalages de fuseau horaire du serveur
      const startDate = new Date(Date.UTC(targetYear, targetMonth, 1, 0, 0, 0));
      const endDate = new Date(Date.UTC(targetYear, targetMonth + 1, 0, 23, 59, 59));

      // console.log("currentDate", currentDate);
      // console.log("startDate", startDate);
      // console.log("endDate", endDate);

      console.log(`[getCalendarData] 📅 Range: ${startDate.toISOString()} -> ${endDate.toISOString()}`);
      console.log(`[getCalendarData] 👤 User: ${userId}, Role: ${user.role}`);

      // 3️⃣ Construire filtre : On veut voir tout ce qui nous concerne (Client ou Prestataire)
      const roleConditions = {
        OR: [
          { clientId: userId },
          { providerId: userId },
        ],
      };

      console.log(`[getCalendarData] 🔍 Query conditions:`, JSON.stringify(roleConditions));

      // 4️⃣ Requête bookings
      const bookings = await this.prisma.booking.findMany({
        where: {
          AND: [
            roleConditions,
            {
              scheduledDate: {
                gte: startDate,
                lte: endDate,
              },
            },
          ],
        },
        include: {
          client: true,
          provider: true,
          service: true,
        },
        orderBy: { scheduledDate: 'asc' },
      });

      console.log(`[getCalendarData] ✅ Found ${bookings.length} bookings`);
      if (bookings.length > 0) {
        console.log(`[getCalendarData] 🗓️ First booking date: ${bookings[0].scheduledDate?.toISOString()}`);
        console.log(`[getCalendarData] 🗓️ Last booking date: ${bookings[bookings.length - 1].scheduledDate?.toISOString()}`);
      }

      // console.log("bookings recuperer", bookings);

      // 5️⃣ Enrichir chaque service avec ses fichiers
      const enrichedBookings = await Promise.all(
        bookings.map(async (booking) => {
          const files = await this.prisma.fileManager.findMany({
            where: { targetId: booking.serviceId, fileType: 'servicesFiles' },
          });

          return {
            ...booking,
            service: {
              ...booking.service,
              files,
            },
          };
        }),
      );

      // 6️⃣ Transformation pour le frontend
      const transformedBookings = enrichedBookings.map((booking) => ({
        id: booking.id,
        clientId: booking.clientId,
        providerId: booking.providerId,
        serviceId: booking.serviceId,

        client: booking.client
          ? {
            id: booking.client.id,
            email: booking.client.email,
            role: booking.client.role,
            fullName: booking.client.fullName,
            phone: booking.client.phone,
          }
          : null,

        provider: booking.provider
          ? {
            id: booking.provider.id,
            email: booking.provider.email,
            role: booking.provider.role,
            fullName: booking.provider.fullName,
            phone: booking.provider.phone,
          }
          : null,

        service: booking.service,
        code: booking.code,
        status: booking.status,
        price: booking.price,
        rating: booking.rating,
        comment: booking.comment,
        interventionType: booking.interventionType,

        scheduledDate: booking.scheduledDate,
        scheduledTime: booking.scheduledTime,
        description: booking.description,

        userQrCode: booking.userQrCode,
        prestaQrCode: booking.prestaQrCode,
        userQrScanned: booking.userQrScanned,
        prestaQrScanned: booking.prestaQrScanned,

        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
      }));

      // 7️⃣ Retour
      return {
        bookings: transformedBookings,
        period: {
          year: targetYear,
          month: targetMonth,
          monthName: this.getMonthName(targetMonth),
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      };
    } catch (error) {
      console.error('[Booking.getCalendarData] ❌', error);
      throw new InternalServerErrorException(
        'Erreur récupération données calendrier',
      );
    }
  }

  /* ----------------------
   * HELPER: GET MONTH NAME
   * ----------------------*/
  private getMonthName(monthIndex: number): string {
    const monthNames = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ];
    return monthNames[monthIndex];
  }

  async scanQr(userId: string, qrCode: string) {
    const booking = await this.prisma.booking.findFirst({
      where: {
        OR: [{ userQrCode: qrCode }, { prestaQrCode: qrCode }],
      },
    });

    if (!booking)
      throw new NotFoundException('Booking not found with this QR code');

    if (
      booking.status === BookingStatus.COMPLETED ||
      booking.status === BookingStatus.CANCELLED
    ) {
      throw new BadRequestException('Booking already completed or cancelled');
    }

    const isProvider = booking.providerId === userId;
    const isClient = booking.clientId === userId;

    if (!isProvider && !isClient) {
      throw new ForbiddenException(
        'You are not authorized to scan for this booking',
      );
    }

    let updateData: any = {};

    // Provider scans Client QR -> IN_PROGRESS
    if (isProvider && booking.userQrCode === qrCode) {
      if (booking.userQrScanned)
        throw new BadRequestException('User QR already scanned');
      updateData = {
        status: BookingStatus.IN_PROGRESS,
        userQrScanned: true,
      };
    }
    // Client scans Provider QR -> COMPLETED
    else if (isClient && booking.prestaQrCode === qrCode) {
      if (!booking.userQrScanned) {
        throw new BadRequestException(
          'Intervention must be started by provider first (User QR scan missing)',
        );
      }
      if (booking.prestaQrScanned)
        throw new BadRequestException('Provider QR already scanned');
      updateData = {
        status: BookingStatus.COMPLETED,
        prestaQrScanned: true,
        userQrScanned: true, // As per prompt
      };
    } else {
      throw new BadRequestException('Invalid QR code for your role');
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: booking.id },
      data: updateData,
      include: { client: true, provider: true, service: true },
    });

    // Notify both parties
    this.socketGateway.notifyUser(
      booking.clientId,
      'booking_status_updated',
      updatedBooking,
    );
    this.socketGateway.notifyUser(
      booking.providerId,
      'booking_status_updated',
      updatedBooking,
    );

    this.logger.log(`QR Scanned for booking ${booking.id} by user ${userId}. Resulting status: ${updatedBooking.status}`, 'BookingService');
    return updatedBooking;
  }

}
