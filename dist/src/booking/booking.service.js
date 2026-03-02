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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const socket_gateway_1 = require("../socket/socket.gateway");
const payment_service_1 = require("../payment/payment.service");
const pagination_service_1 = require("../utils/pagination.service");
const LocalStorageService_1 = require("../utils/LocalStorageService");
const logger_1 = require("../utils/logger");
const helper_1 = require("../utils/helper");
const code_generator_util_1 = require("../utils/code-generator.util");
let BookingService = class BookingService {
    prisma;
    socketGateway;
    paymentService;
    functionService;
    localStorageService;
    logger;
    constructor(prisma, socketGateway, paymentService, functionService, localStorageService, logger) {
        this.prisma = prisma;
        this.socketGateway = socketGateway;
        this.paymentService = paymentService;
        this.functionService = functionService;
        this.localStorageService = localStorageService;
        this.logger = logger;
    }
    async create(clientId, dto) {
        const { serviceId, interventionType, scheduledDate, scheduledTime, description, } = dto;
        const service = await this.prisma.service.findUnique({
            where: { id: serviceId },
        });
        if (!service)
            throw new common_1.BadRequestException('Service not found');
        if (service.userId === clientId)
            throw new common_1.BadRequestException('You cannot book your own service');
        const userQrCode = `USER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const prestaQrCode = `PRESTA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const code = (0, code_generator_util_1.generateUniqueCode)('BK');
        const booking = await this.prisma.booking.create({
            data: {
                clientId,
                providerId: service.userId,
                serviceId,
                status: client_1.BookingStatus.PENDING,
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
        this.socketGateway.notifyUser(booking.providerId, 'new_booking', booking);
        this.logger.log(`Booking created: ${booking.id} for service ${serviceId} by client ${clientId}`, 'BookingService');
        return booking;
    }
    async update(clientId, bookingId, dto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { service: true },
        });
        if (!booking)
            throw new common_1.BadRequestException('Booking not found');
        if (booking.clientId !== clientId) {
            throw new common_1.ForbiddenException('You can only update your own bookings');
        }
        const forbiddenStatuses = [
            client_1.BookingStatus.COMPLETED,
            client_1.BookingStatus.PAID,
        ];
        if (forbiddenStatuses.includes(booking.status)) {
            throw new common_1.BadRequestException('Cannot update a completed or paid booking');
        }
        const updatedBooking = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                scheduledDate: dto.scheduledDate ? new Date(dto.scheduledDate) : booking.scheduledDate,
                scheduledTime: dto.scheduledTime ?? booking.scheduledTime,
                interventionType: dto.interventionType ?? booking.interventionType,
                description: dto.description ?? booking.description,
                status: dto.status ?? booking.status,
            },
            include: { client: true, provider: true, service: true },
        });
        if (dto.status && dto.status !== booking.status) {
            this.socketGateway.notifyUser(updatedBooking.providerId, 'booking_status_updated', updatedBooking);
            this.socketGateway.notifyUser(updatedBooking.clientId, 'booking_status_updated', updatedBooking);
        }
        this.logger.log(`Booking updated: ${bookingId} by client ${clientId}`, 'BookingService');
        return updatedBooking;
    }
    async updateStatus(userId, bookingId, status) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking)
            throw new common_1.BadRequestException('Booking not found');
        const isProvider = booking.providerId === userId;
        const isClient = booking.clientId === userId;
        if (status === client_1.BookingStatus.CANCELLED) {
            if (!isClient || booking.status !== client_1.BookingStatus.PENDING) {
                throw new common_1.ForbiddenException('Only client can cancel a PENDING booking');
            }
        }
        if (status === client_1.BookingStatus.ACCEPTED && !isProvider) {
            throw new common_1.ForbiddenException('Only provider can accept a booking');
        }
        if (status === client_1.BookingStatus.PAID) {
            if (!isClient)
                throw new common_1.ForbiddenException('Only client can initiate payment');
            if (!booking.price)
                throw new common_1.BadRequestException('Booking price not set');
            await this.paymentService.deductCredits(userId, booking.price);
        }
        const updatedBooking = await this.prisma.booking.update({
            where: { id: bookingId },
            data: { status },
            include: { client: true, provider: true, service: true },
        });
        this.socketGateway.notifyUser(booking.clientId, 'booking_status_updated', updatedBooking);
        this.socketGateway.notifyUser(booking.providerId, 'booking_status_updated', updatedBooking);
        this.logger.log(`Booking status updated: ${bookingId} to ${status} by user ${userId}`, 'BookingService');
        return updatedBooking;
    }
    async getAllBookings(page = 1, limit = 10) {
        const { skip, take } = (0, helper_1.getPaginationValues)(page, limit);
        const bookings = await this.prisma.booking.findMany({
            include: { client: true, provider: true, service: true },
            orderBy: { createdAt: 'desc' },
            skip,
            take,
        });
        const enrichedBookings = await Promise.all(bookings.map(async (booking) => {
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
        }));
        const total = await this.prisma.booking.count();
        return {
            data: enrichedBookings,
            total,
            totalPages: Math.ceil(total / limit),
            page,
        };
    }
    async getMyBookings(userId, page = 1, limit = 10) {
        const { skip, take } = (0, helper_1.getPaginationValues)(page, limit);
        const bookings = await this.prisma.booking.findMany({
            where: { clientId: userId },
            include: { client: true, provider: true, service: true },
            orderBy: { createdAt: 'desc' },
            skip,
            take,
        });
        const enrichedBookings = await Promise.all(bookings.map(async (booking) => {
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
        }));
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
    async getCalendarData(userId, year, month) {
        try {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (!user)
                throw new common_1.NotFoundException('Utilisateur introuvable');
            const currentDate = new Date();
            const targetYear = year ?? currentDate.getFullYear();
            const targetMonth = month ? month - 1 : currentDate.getMonth();
            const startDate = new Date(Date.UTC(targetYear, targetMonth, 1, 0, 0, 0));
            const endDate = new Date(Date.UTC(targetYear, targetMonth + 1, 0, 23, 59, 59));
            console.log(`[getCalendarData] 📅 Range: ${startDate.toISOString()} -> ${endDate.toISOString()}`);
            console.log(`[getCalendarData] 👤 User: ${userId}, Role: ${user.role}`);
            const roleConditions = {
                OR: [
                    { clientId: userId },
                    { providerId: userId },
                ],
            };
            console.log(`[getCalendarData] 🔍 Query conditions:`, JSON.stringify(roleConditions));
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
            const enrichedBookings = await Promise.all(bookings.map(async (booking) => {
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
            }));
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
        }
        catch (error) {
            console.error('[Booking.getCalendarData] ❌', error);
            throw new common_1.InternalServerErrorException('Erreur récupération données calendrier');
        }
    }
    getMonthName(monthIndex) {
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
    async scanQr(userId, qrCode) {
        const booking = await this.prisma.booking.findFirst({
            where: {
                OR: [{ userQrCode: qrCode }, { prestaQrCode: qrCode }],
            },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found with this QR code');
        if (booking.status === client_1.BookingStatus.COMPLETED ||
            booking.status === client_1.BookingStatus.CANCELLED) {
            throw new common_1.BadRequestException('Booking already completed or cancelled');
        }
        const isProvider = booking.providerId === userId;
        const isClient = booking.clientId === userId;
        if (!isProvider && !isClient) {
            throw new common_1.ForbiddenException('You are not authorized to scan for this booking');
        }
        let updateData = {};
        if (isProvider && booking.userQrCode === qrCode) {
            if (booking.userQrScanned)
                throw new common_1.BadRequestException('User QR already scanned');
            updateData = {
                status: client_1.BookingStatus.IN_PROGRESS,
                userQrScanned: true,
            };
        }
        else if (isClient && booking.prestaQrCode === qrCode) {
            if (!booking.userQrScanned) {
                throw new common_1.BadRequestException('Intervention must be started by provider first (User QR scan missing)');
            }
            if (booking.prestaQrScanned)
                throw new common_1.BadRequestException('Provider QR already scanned');
            updateData = {
                status: client_1.BookingStatus.COMPLETED,
                prestaQrScanned: true,
                userQrScanned: true,
            };
        }
        else {
            throw new common_1.BadRequestException('Invalid QR code for your role');
        }
        const updatedBooking = await this.prisma.booking.update({
            where: { id: booking.id },
            data: updateData,
            include: { client: true, provider: true, service: true },
        });
        this.socketGateway.notifyUser(booking.clientId, 'booking_status_updated', updatedBooking);
        this.socketGateway.notifyUser(booking.providerId, 'booking_status_updated', updatedBooking);
        this.logger.log(`QR Scanned for booking ${booking.id} by user ${userId}. Resulting status: ${updatedBooking.status}`, 'BookingService');
        return updatedBooking;
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        socket_gateway_1.SocketGateway,
        payment_service_1.PaymentService,
        pagination_service_1.FunctionService,
        LocalStorageService_1.LocalStorageService,
        logger_1.MyLogger])
], BookingService);
//# sourceMappingURL=booking.service.js.map