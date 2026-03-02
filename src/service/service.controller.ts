import { Controller, Get, Post, Body, Delete, Param, Query, UseGuards, Req, UseInterceptors, UploadedFiles, Patch, HttpStatus, } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto, ServiceSearchDto, UpdateServiceDto, } from './dto/service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BaseResponse } from '../common/dto/base-response.dto';

@ApiTags('Services')
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PRESTATAIRE, Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new service (Provider only)' })
  @UseInterceptors(FilesInterceptor('files'))
  async create(@Req() req: any, @Body() dto: CreateServiceDto, @UploadedFiles() files: any[],) {
    const result = await this.serviceService.create(req.user.id, dto, files);
    return new BaseResponse(HttpStatus.CREATED, 'Service créé avec succès', result,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Search services with filters and geolocation' })
  async findAll(@Query() search: ServiceSearchDto) {
    const result = await this.serviceService.findAll(search);
    return new BaseResponse(HttpStatus.OK, 'Services récupérés', result);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PRESTATAIRE, Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update service (Provider or Admin only)' })
  @UseInterceptors(FilesInterceptor('files'))
  async update(@Param('id') id: string, @Body() dto: UpdateServiceDto, @UploadedFiles() files: any[],) {
    const result = await this.serviceService.update(id, dto, files);
    return new BaseResponse(HttpStatus.OK, 'Service mis à jour', result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service details' })
  async findOne(@Param('id') id: string) {
    const result = await this.serviceService.findOne(id);
    return new BaseResponse(HttpStatus.OK, 'Détails du service récupérés', result,
    );
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PRESTATAIRE, Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete service (Provider or Admin only)' })
  async delete(@Param('id') id: string) {
    const result = await this.serviceService.deleteService(id);
    return new BaseResponse(HttpStatus.OK, 'Service supprimé', result);
  }

  // handleToggleActive
  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PRESTATAIRE, Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Toggle service active/inactive (Provider or Admin only)' })
  async toggleActive(
    @Param('id') id: string,
    @Body() dto: { value: boolean },
  ) {
    const result = await this.serviceService.handleToggleActive(id, dto.value);
    return new BaseResponse(HttpStatus.OK, 'Service activé/désactivé', result);
  }


}
