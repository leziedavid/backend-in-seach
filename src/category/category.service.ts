import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FunctionService } from '../utils/pagination.service';
import { LocalStorageService } from '../utils/LocalStorageService';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private functionService: FunctionService,
    private localStorageService: LocalStorageService,
  ) {}

  async forSelect() {
    return this.prisma.category.findMany({ select: { id: true, label: true } });
  }

  async findAll(query: any) {
    return this.functionService.paginate({
      model: 'category',
      page: query.page,
      limit: query.limit,
      conditions: {},
      orderBy: { label: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async create(data: { label: string; iconFile?: Buffer }) {
    let iconUrl = '';
    let fileCode = '';

    if (data.iconFile) {
      const upload = await this.localStorageService.saveFile(
        data.iconFile,
        'categories',
      );
      iconUrl = upload.fileUrl;
      fileCode = upload.fileCode;

      // Create record in FileManager
      const category = await this.prisma.category.create({
        data: {
          label: data.label,
          iconName: iconUrl,
        },
      });

      await this.prisma.fileManager.create({
        data: {
          fileCode: upload.fileCode,
          fileName: upload.fileName,
          fileMimeType: upload.fileMimeType,
          fileSize: upload.fileSize,
          fileUrl: upload.fileUrl,
          fileType: 'iconeServiceFiles',
          targetId: category.id,
          filePath: upload.filePath,
        },
      });

      return category;
    }

    return this.prisma.category.create({
      data: {
        label: data.label,
        iconName: '',
      },
    });
  }

  async update(id: string, data: { label?: string; iconFile?: Buffer }) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new Error('Category not found');

    const updateData: any = { label: data.label };

    if (data.iconFile) {
      const upload = await this.localStorageService.saveFile(
        data.iconFile,
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
          fileType: 'iconeServiceFiles',
          targetId: id,
          filePath: upload.filePath,
        },
      });
    }

    return this.prisma.category.update({
      where: { id },
      data: updateData,
    });
  }
}
