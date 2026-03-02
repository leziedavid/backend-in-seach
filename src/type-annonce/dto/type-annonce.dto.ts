import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateTypeAnnonceDto {
  @ApiProperty({ example: 'Vente' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ example: 'vente' })
  @IsString()
  @IsNotEmpty()
  slug: string;
}

export class UpdateTypeAnnonceDto extends PartialType(CreateTypeAnnonceDto) {}

export class TypeAnnonceSearchDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  query?: string;
}
