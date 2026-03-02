import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FunctionService } from '../utils/pagination.service';
import { LocalStorageService } from '../utils/LocalStorageService';
import {
  CreateCategorieAnnonceDto,
  UpdateCategorieAnnonceDto,
  CategorieAnnonceSearchDto,
} from './dto/categorie-annonce.dto';

@Injectable()
export class CategorieAnnonceService {
  constructor(
    private prisma: PrismaService,
    private functionService: FunctionService,
    private localStorageService: LocalStorageService,
  ) {}

  async forSelect() {
    return this.prisma.categorieAnnonce.findMany({
      select: { id: true, label: true },
    });
  }

  async findAll(query: CategorieAnnonceSearchDto) {
    const conditions: any = {};
    if (query.query) {
      conditions.label = { contains: query.query, mode: 'insensitive' };
    }

    return this.functionService.paginate({
      model: 'categorieAnnonce',
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 10,
      conditions,
      orderBy: { label: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.categorieAnnonce.findUnique({
      where: { id },
    });
  }

  async create(dto: CreateCategorieAnnonceDto, file?: any) {
    let iconUrl = '';

    const category = await this.prisma.categorieAnnonce.create({
      data: {
        label: dto.label,
        slug: dto.slug,
        iconName: '',
      },
    });

    if (file) {
      const upload = await this.localStorageService.saveFile(
        file.buffer,
        'categories',
      );
      iconUrl = upload.fileUrl;

      await this.prisma.categorieAnnonce.update({
        where: { id: category.id },
        data: { iconName: iconUrl },
      });

      await this.prisma.fileManager.create({
        data: {
          fileCode: upload.fileCode,
          fileName: upload.fileName,
          fileMimeType: upload.fileMimeType,
          fileSize: upload.fileSize,
          fileUrl: upload.fileUrl,
          fileType: 'iconeAnnonceFiles',
          targetId: category.id,
          filePath: upload.filePath,
        },
      });

      return { ...category, iconName: iconUrl };
    }

    return category;
  }

  async update(id: string, dto: UpdateCategorieAnnonceDto, file?: any) {
    const category = await this.prisma.categorieAnnonce.findUnique({
      where: { id },
    });
    if (!category) throw new Error('Category not found');

    const updateData: any = {
      label: dto.label ?? undefined,
      slug: dto.slug ?? undefined,
    };

    if (file) {
      const upload = await this.localStorageService.saveFile(
        file.buffer,
        'categories',
      );
      updateData.iconName = upload.fileUrl;

      await this.prisma.fileManager.create({
        data: {
          fileCode: upload.fileCode,
          fileName: upload.fileName,
          fileMimeType: upload.fileMimeType,
          fileSize: upload.fileSize,
          fileUrl: upload.fileUrl,
          fileType: 'iconeAnnonceFiles',
          targetId: id,
          filePath: upload.filePath,
        },
      });
    }

    return this.prisma.categorieAnnonce.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    return this.prisma.categorieAnnonce.delete({
      where: { id },
    });
  }
}
