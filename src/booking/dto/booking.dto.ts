import {
  IsUUID,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus, InterventionType } from '@prisma/client';

export class CreateBookingDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty({ enum: InterventionType })
  @IsEnum(InterventionType)
  @IsNotEmpty()
  interventionType: InterventionType;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  scheduledDate: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  scheduledTime: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateBookingStatusDto {
  @ApiProperty({ enum: BookingStatus })
  @IsEnum(BookingStatus)
  @IsNotEmpty()
  status: BookingStatus;
}

export class ScanQrDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  qrCode: string;
}
