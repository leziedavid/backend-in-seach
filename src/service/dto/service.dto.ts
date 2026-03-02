import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  IsUUID,
  Min,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceType, ServiceStatus } from '@prisma/client';
import { Type, Transform } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'Nettoyage de vitres' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Nettoyage professionnel de vitres pour bureaux et maisons',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: ServiceType, example: ServiceType.DEPANNAGE })
  @IsEnum(ServiceType)
  type: ServiceType;

  @ApiProperty({
    enum: ServiceStatus,
    example: ServiceStatus.AVAILABLE,
    required: false,
  })
  @IsEnum(ServiceStatus)
  @IsOptional()
  status?: ServiceStatus;

  @ApiProperty({ example: 45.0, required: false, description: 'Tarif estimatif' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  frais?: number;

  @ApiProperty({ example: 50.5, required: false, description: 'Montant final' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @ApiProperty({
    example: 10,
    required: false,
    description: 'Réduction en pourcentage ou montant',
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  reduction?: number;

  @ApiProperty({
    type: [String],
    example: ['nettoyage', 'vitres'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value.split(',').map(v => v.trim());
      }
    }
    return value;
  })
  tags?: string[];

  @ApiProperty({
    example: { type: 'Point', coordinates: [2.3522, 48.8566] },
    required: false,
    description: 'GeoJSON point',
  })
  @IsOptional()
  location?: object;

  @ApiProperty({ example: 48.8566 })
  @IsNumber()
  @Type(() => Number)
  latitude: number;

  @ApiProperty({ example: 2.3522 })
  @IsNumber()
  @Type(() => Number)
  longitude: number;

  /* -------- IMAGES -------- */
  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Images uploadées du service',
  })
  @IsOptional()
  images?: Express.Multer.File[];

  @ApiPropertyOptional({
    type: [String],
    description: 'Existing image URLs to keep',
  })
  @IsOptional()
  @IsArray()
  existingImageUrls?: string[];

  @ApiProperty({ example: 'uuid-of-category' })
  @IsUUID()
  categoryId: string;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) { }

export class ServiceSearchDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'null' || value === '' ? undefined : Number(value),
  )
  @IsNumber()
  lat?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'null' || value === '' ? undefined : Number(value),
  )
  @IsNumber()
  lng?: number;

  @ApiProperty({ required: false, default: 15 })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'null' || value === '' ? undefined : Number(value),
  )
  @IsNumber()
  radiusKm?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'null' || value === '' ? undefined : value,
  )
  @IsString()
  query?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'null' || value === '' ? undefined : value,
  )
  @IsUUID()
  categoryId?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'null' || value === '' ? undefined : Number(value),
  )
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'null' || value === '' ? undefined : Number(value),
  )
  @IsNumber()
  @Min(1)
  limit?: number;
}
