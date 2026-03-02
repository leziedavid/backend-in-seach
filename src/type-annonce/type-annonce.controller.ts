import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { TypeAnnonceService } from './type-annonce.service';
import {
  CreateTypeAnnonceDto,
  UpdateTypeAnnonceDto,
  TypeAnnonceSearchDto,
} from './dto/type-annonce.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BaseResponse } from '../common/dto/base-response.dto';

@ApiTags('Type Annonce')
@Controller('type-annonce')
export class TypeAnnonceController {
  constructor(private readonly typeAnnonceService: TypeAnnonceService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new type of annonce (Admin only)' })
  async create(@Body() dto: CreateTypeAnnonceDto) {
    const result = await this.typeAnnonceService.create(dto);
    return new BaseResponse(
      HttpStatus.CREATED,
      "Type d'annonce créé avec succès",
      result,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List all types of annonces' })
  async findAll(@Query() query: TypeAnnonceSearchDto) {
    const result = await this.typeAnnonceService.findAll(query);
    return new BaseResponse(
      HttpStatus.OK,
      "Types d'annonces récupérés",
      result,
    );
  }

  @Get('select')
  @ApiOperation({ summary: 'Get types for select' })
  async forSelect() {
    const result = await this.typeAnnonceService.forSelect();
    return new BaseResponse(
      HttpStatus.OK,
      'Types pour sélection récupérés',
      result,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a type of annonce' })
  async findOne(@Param('id') id: string) {
    const result = await this.typeAnnonceService.findOne(id);
    return new BaseResponse(
      HttpStatus.OK,
      "Détails du type d'annonce récupérés",
      result,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a type of annonce (Admin only)' })
  async update(@Param('id') id: string, @Body() dto: UpdateTypeAnnonceDto) {
    const result = await this.typeAnnonceService.update(id, dto);
    return new BaseResponse(HttpStatus.OK, "Type d'annonce mis à jour", result);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a type of annonce (Admin only)' })
  async remove(@Param('id') id: string) {
    await this.typeAnnonceService.remove(id);
    return new BaseResponse(HttpStatus.OK, "Type d'annonce supprimé");
  }
}
