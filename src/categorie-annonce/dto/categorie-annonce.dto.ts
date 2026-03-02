import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, PartialType, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategorieAnnonceDto {
  @ApiProperty({ example: 'Concert' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ example: 'concert' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Icon file for the category',
  })
  @IsOptional()
  icon?: any;
}

export class UpdateCategorieAnnonceDto extends PartialType(
  CreateCategorieAnnonceDto,
) {}

export class CategorieAnnonceSearchDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsString() // Pagination service often takes strings from query
  page?: string;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsString()
  limit?: string;
}
