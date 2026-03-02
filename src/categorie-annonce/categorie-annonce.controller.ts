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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CategorieAnnonceService } from './categorie-annonce.service';
import {
  CreateCategorieAnnonceDto,
  UpdateCategorieAnnonceDto,
  CategorieAnnonceSearchDto,
} from './dto/categorie-annonce.dto';
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
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseResponse } from '../common/dto/base-response.dto';

@ApiTags('Categorie Annonce')
@Controller('categorie-annonce')
export class CategorieAnnonceController {
  constructor(
    private readonly categorieAnnonceService: CategorieAnnonceService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new category of annonce (Admin only)' })
  @UseInterceptors(FileInterceptor('icon'))
  async create(
    @Body() dto: CreateCategorieAnnonceDto,
    @UploadedFile() file: any,
  ) {
    const result = await this.categorieAnnonceService.create(dto, file);
    return new BaseResponse(
      HttpStatus.CREATED,
      "Catégorie d'annonce créée avec succès",
      result,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List all categories of annonces' })
  async findAll(@Query() query: CategorieAnnonceSearchDto) {
    const result = await this.categorieAnnonceService.findAll(query);
    return new BaseResponse(
      HttpStatus.OK,
      "Catégories d'annonces récupérées",
      result,
    );
  }

  @Get('select')
  @ApiOperation({ summary: 'Get categories for select' })
  async forSelect() {
    const result = await this.categorieAnnonceService.forSelect();
    return new BaseResponse(
      HttpStatus.OK,
      'Catégories pour sélection récupérées',
      result,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a category of annonce' })
  async findOne(@Param('id') id: string) {
    const result = await this.categorieAnnonceService.findOne(id);
    return new BaseResponse(
      HttpStatus.OK,
      "Détails de la catégorie d'annonce récupérés",
      result,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update a category of annonce (Admin only)' })
  @UseInterceptors(FileInterceptor('icon'))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategorieAnnonceDto,
    @UploadedFile() file: any,
  ) {
    const result = await this.categorieAnnonceService.update(id, dto, file);
    return new BaseResponse(
      HttpStatus.OK,
      "Catégorie d'annonce mise à jour",
      result,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a category of annonce (Admin only)' })
  async remove(@Param('id') id: string) {
    await this.categorieAnnonceService.remove(id);
    return new BaseResponse(HttpStatus.OK, "Catégorie d'annonce supprimée");
  }
}
