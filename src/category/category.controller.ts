import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Patch,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './category.service';
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
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { BaseResponse } from '../common/dto/base-response.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('for-select')
  @ApiOperation({ summary: 'Get categories for select' })
  async forSelect() {
    const result = await this.categoryService.forSelect();
    return new BaseResponse(HttpStatus.OK, 'Catégories récupérées', result);
  }

  @Get()
  @ApiOperation({ summary: 'List all categories' })
  async findAll(@Query() query: any) {
    const result = await this.categoryService.findAll(query);
    return new BaseResponse(HttpStatus.OK, 'Catégories récupérées', result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  async findOne(@Param('id') id: string) {
    const result = await this.categoryService.findOne(id);
    return new BaseResponse(HttpStatus.OK, 'Catégorie récupérée', result);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new category (Admin only)' })
  @UseInterceptors(FileInterceptor('icon'))
  async create(@Body() dto: CreateCategoryDto, @UploadedFile() file: any) {
    const result = await this.categoryService.create({
      label: dto.label,
      iconFile: file?.buffer,
    });
    return new BaseResponse(HttpStatus.CREATED, 'Catégorie créée', result);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update category (Admin only)' })
  @UseInterceptors(FileInterceptor('icon'))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @UploadedFile() file: any,
  ) {
    const result = await this.categoryService.update(id, {
      label: dto.label,
      iconFile: file?.buffer,
    });
    return new BaseResponse(HttpStatus.OK, 'Catégorie mise à jour', result);
  }
}
