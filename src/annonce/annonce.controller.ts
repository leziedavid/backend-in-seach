import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFiles,
  Patch,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { AnnonceService } from './annonce.service';
import {
  CreateAnnonceDto,
  AnnonceSearchDto,
  UpdateAnnonceDto,
} from './dto/annonce.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BaseResponse } from '../common/dto/base-response.dto';

@ApiTags('Annonces')
@Controller('annonces')
export class AnnonceController {
  constructor(private readonly annonceService: AnnonceService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new annonce' })
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Req() req: any,
    @Body() dto: CreateAnnonceDto,
    @UploadedFiles() files: any[],
  ) {
    const result = await this.annonceService.create(req.user.id, dto, files);
    return new BaseResponse(
      HttpStatus.CREATED,
      'Annonce créée avec succès',
      result,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Search annonces with filters and geolocation' })
  async findAll(@Query() search: AnnonceSearchDto) {
    const result = await this.annonceService.findAll(search);
    return new BaseResponse(HttpStatus.OK, 'Annonces récupérées', result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get annonce details' })
  async findOne(@Param('id') id: string) {
    const result = await this.annonceService.findOne(id);
    return new BaseResponse(
      HttpStatus.OK,
      "Détails de l'annonce récupérés",
      result,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update annonce' })
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAnnonceDto,
    @UploadedFiles() files: any[],
  ) {
    const result = await this.annonceService.update(id, dto, files);
    return new BaseResponse(HttpStatus.OK, 'Annonce mise à jour', result);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete annonce' })
  async remove(@Param('id') id: string) {
    await this.annonceService.remove(id);
    return new BaseResponse(HttpStatus.OK, 'Annonce supprimée');
  }

  // handleToggleActive
  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Toggle annonce active/draft' })
  async toggleActive(
    @Param('id') id: string,
    @Body() dto: { value: boolean },
  ) {
    const result = await this.annonceService.handleToggleActive(id, dto.value);
    return new BaseResponse(HttpStatus.OK, 'Annonce activée/désactivée', result);
  }
}
