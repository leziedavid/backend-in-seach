import { Controller, Post, Body, Param, UseGuards, Req, Patch, Get, HttpStatus, Query, Put, } from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
import { BaseResponse } from '../common/dto/base-response.dto';
import { BookingStatus } from '@prisma/client';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Book a service' })
  async create(@Req() req: any, @Body() dto: CreateBookingDto) {
    const result = await this.bookingService.create(req.user.id, dto);
    return new BaseResponse(
      HttpStatus.CREATED,
      'Réservation effectuée',
      result,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update booking' })
  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: Partial<CreateBookingDto> & { status?: BookingStatus },
  ) {
    const result = await this.bookingService.update(req.user.id, id, dto);
    return new BaseResponse(HttpStatus.OK, 'Réservation mise à jour', result);
  }

  // GET /bookings?page=1&limit=10
  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  async getAllBookings(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const result = await this.bookingService.getAllBookings(
      Number(page),
      Number(limit),
    );
    return new BaseResponse(HttpStatus.OK, 'Réservations récupérées', result);
  }

  // GET /bookings/my?page=1&limit=10
  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get my bookings' })
  async getMyBookings(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const result = await this.bookingService.getMyBookings(
      req.user.id,
      Number(page),
      Number(limit),
    );
    return new BaseResponse(HttpStatus.OK, 'Réservations récupérées', result);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update booking status' })
  async updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    const result = await this.bookingService.updateStatus(
      req.user.id,
      id,
      dto.status,
    );
    return new BaseResponse(
      HttpStatus.OK,
      'Statut de réservation mis à jour',
      result,
    );
  }

  // ----------------------
  // CALENDAR
  // GET /bookings/calendar?year=2026&month=2
  // ----------------------
  @Get('calendar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get bookings calendar for a user' })
  async getCalendar(
    @Req() req: any,
    @Query('year') year?: number,
    @Query('month') month?: number,
  ) {
    const result = await this.bookingService.getCalendarData(
      req.user.id,
      year ? Number(year) : undefined,
      month ? Number(month) : undefined,
    );
    return new BaseResponse(
      HttpStatus.OK,
      'Données calendrier récupérées',
      result,
    );
  }

  @Post('scan-qr')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Scan a QR code to update booking status' })
  async scanQr(@Req() req: any, @Body() dto: { qrCode: string }) {
    const result = await this.bookingService.scanQr(req.user.id, dto.qrCode);
    return new BaseResponse(
      HttpStatus.OK,
      'QR Code scanné avec succès',
      result,
    );
  }
}
