import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { PrismaService } from '../prisma/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';
import { PaymentService } from '../payment/payment.service';
import { FunctionService } from '../utils/pagination.service';
import { LocalStorageService } from '../utils/LocalStorageService';
import { BookingStatus, InterventionType } from '@prisma/client';
import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';

describe('BookingService', () => {
  let service: BookingService;
  let prisma: PrismaService;
  let socket: SocketGateway;

  const mockPrisma = {
    booking: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    service: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    }
  };

  const mockSocket = {
    notifyUser: jest.fn(),
  };

  const mockPayment = {
    deductCredits: jest.fn(),
  };

  const mockFunction = {};
  const mockLocalStorage = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: SocketGateway, useValue: mockSocket },
        { provide: PaymentService, useValue: mockPayment },
        { provide: FunctionService, useValue: mockFunction },
        { provide: LocalStorageService, useValue: mockLocalStorage },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    prisma = module.get<PrismaService>(PrismaService);
    socket = module.get<SocketGateway>(SocketGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('scanQr', () => {
    const mockUserBooking = {
      id: 'b1',
      clientId: 'c1',
      providerId: 'p1',
      status: BookingStatus.PENDING,
      userQrCode: 'QR-USER',
      prestaQrCode: 'QR-PRESTA',
      userQrScanned: false,
      prestaQrScanned: false,
    };

    it('should throw NotFoundException if QR code is not found', async () => {
      mockPrisma.booking.findFirst.mockResolvedValue(null);
      await expect(service.scanQr('u1', 'INVALID')).rejects.toThrow(NotFoundException);
    });

    it('should allow provider to scan user QR to start intervention', async () => {
      mockPrisma.booking.findFirst.mockResolvedValue(mockUserBooking);
      mockPrisma.booking.update.mockResolvedValue({ ...mockUserBooking, status: BookingStatus.IN_PROGRESS, userQrScanned: true });

      const result = await service.scanQr('p1', 'QR-USER');

      expect(result.status).toBe(BookingStatus.IN_PROGRESS);
      expect(result.userQrScanned).toBe(true);
      expect(mockPrisma.booking.update).toHaveBeenCalledWith({
        where: { id: 'b1' },
        data: { status: BookingStatus.IN_PROGRESS, userQrScanned: true },
        include: expect.anything(),
      });
    });

    it('should allow client to scan provider QR to complete intervention', async () => {
      const inProgressBooking = { ...mockUserBooking, status: BookingStatus.IN_PROGRESS, userQrScanned: true };
      mockPrisma.booking.findFirst.mockResolvedValue(inProgressBooking);
      mockPrisma.booking.update.mockResolvedValue({ ...inProgressBooking, status: BookingStatus.COMPLETED, prestaQrScanned: true });

      const result = await service.scanQr('c1', 'QR-PRESTA');

      expect(result.status).toBe(BookingStatus.COMPLETED);
      expect(result.prestaQrScanned).toBe(true);
    });

    it('should throw BadRequestException if client scans provider QR before provider scans user QR', async () => {
      mockPrisma.booking.findFirst.mockResolvedValue(mockUserBooking);
      await expect(service.scanQr('c1', 'QR-PRESTA')).rejects.toThrow(BadRequestException);
    });

    it('should throw ForbiddenException if unauthorized user scans', async () => {
      mockPrisma.booking.findFirst.mockResolvedValue(mockUserBooking);
      await expect(service.scanQr('u3', 'QR-USER')).rejects.toThrow(ForbiddenException);
    });
  });
});
