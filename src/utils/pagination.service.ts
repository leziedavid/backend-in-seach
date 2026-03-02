// src/utils/pagination.service.ts
// ⚠️ Service global de pagination — NE PAS DUPLIQUER

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface PaginateOptions {
  model: string;
  page?: number;
  limit?: number;
  conditions?: any;
  orderBy?: any;
  selectAndInclude?: any;
  fileTypeListes?: string[];
}

@Injectable()
export class FunctionService {
  constructor(private readonly prisma: PrismaService) {}

  private async enrichWithFiles(entity: any, fileTypeListes: string[]) {
    if (!fileTypeListes?.length) return { ...entity, files: [] };

    const files = await this.prisma.fileManager.findMany({
      where: {
        targetId: entity.id,
        fileType: { in: fileTypeListes },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { ...entity, files };
  }

  async paginate(options: PaginateOptions) {
    const validPage = Math.max(1, Number(options.page) || 1);
    const validLimit = Math.min(Math.max(1, Number(options.limit) || 10), 100);

    const skip = (validPage - 1) * validLimit;

    // @ts-ignore
    const total = await this.prisma[options.model].count({
      where: options.conditions,
    });

    // @ts-ignore
    let data = await this.prisma[options.model].findMany({
      skip,
      take: validLimit,
      where: options.conditions,
      orderBy: options.orderBy,
      ...(options.selectAndInclude || {}),
    });

    if (options.fileTypeListes?.length) {
      data = await Promise.all(
        data.map((d: any) => this.enrichWithFiles(d, options.fileTypeListes!)),
      );
    }

    return {
      status: true,
      total,
      page: validPage,
      limit: validLimit,
      totalPages: Math.ceil(total / validLimit),
      data,
    };
  }
}
