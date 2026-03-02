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
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AnnonceStatus } from '@prisma/client';
import { Type, Transform } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

export class CreateAnnonceDto {
  @ApiProperty({ example: 'Vente de Piano' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Piano droit en excellent état' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Mon Entreprise', required: false })
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiProperty({
    enum: AnnonceStatus,
    example: AnnonceStatus.ACTIVE,
    required: false,
  })
  @IsEnum(AnnonceStatus)
  @IsOptional()
  status?: AnnonceStatus;

  @ApiProperty({ example: 500, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @ApiProperty({ example: 48.8566 })
  @IsNumber()
  @Type(() => Number)
  latitude: number;

  @ApiProperty({ example: 2.3522 })
  @IsNumber()
  @Type(() => Number)
  longitude: number;

  @ApiProperty({ example: '2024-02-14T00:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ example: '2024-02-28T00:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ example: 'uuid-of-type' })
  @IsUUID()
  typeId: string;

  @ApiProperty({ example: 'uuid-of-category' })
  @IsUUID()
  categorieId: string;

  @ApiProperty({ example: ['Parking', 'Wifi'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  options?: string[];

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: "Images de l'annonce",
  })
  @IsOptional()
  files?: any[];
}

export class UpdateAnnonceDto extends PartialType(CreateAnnonceDto) { }

export class AnnonceSearchDto {
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
  typeId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'null' || value === '' ? undefined : value,
  )
  @IsUUID()
  categorieId?: string;

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
