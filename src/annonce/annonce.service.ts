import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAnnonceDto,
  AnnonceSearchDto,
  UpdateAnnonceDto,
} from './dto/annonce.dto';
import { FunctionService } from '../utils/pagination.service';
import { LocalStorageService } from '../utils/LocalStorageService';
import { MyLogger } from '../utils/logger';
import { Prisma } from '@prisma/client';
import { generateUniqueCode } from '../utils/code-generator.util';

@Injectable()
export class AnnonceService {
  constructor(
    private prisma: PrismaService,
    private functionService: FunctionService,
    private localStorageService: LocalStorageService,
    private logger: MyLogger,
  ) { }

  async create(userId: string, dto: CreateAnnonceDto, files?: any[]) {
    // Create annonce
    const annonce = await this.prisma.annonce.create({
      data: {
        title: dto.title,
        description: dto.description,
        companyName: dto.companyName,
        price: dto.price,
        latitude: dto.latitude,
        longitude: dto.longitude,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        typeId: dto.typeId,
        categorieId: dto.categorieId,
        userId,
        code: generateUniqueCode('AN'),
        images: [],
        options: dto.options || [],
      },
    });

    // Handle file uploads if any
    if (files && files.length > 0) {
      const urls: string[] = [];
      for (const file of files) {
        const upload = await this.localStorageService.saveFile(
          file.buffer,
          'annonces',
        );
        urls.push(upload.fileUrl);

        await this.prisma.fileManager.create({
          data: {
            fileCode: upload.fileCode,
            fileName: upload.fileName,
            fileMimeType: upload.fileMimeType,
            fileSize: upload.fileSize,
            fileUrl: upload.fileUrl,
            fileType: 'annoncesFiles',
            targetId: annonce.id,
            filePath: upload.filePath,
          },
        });
      }

      await this.prisma.annonce.update({
        where: { id: annonce.id },
        data: { images: urls },
      });

      this.logger.log(`Annonce created: ${annonce.id} by user ${userId}`, 'AnnonceService');
      return { ...annonce, images: urls };
    }

    this.logger.log(`Annonce created: ${annonce.id} by user ${userId}`, 'AnnonceService');
    return annonce;
  }

  async findAll(search: AnnonceSearchDto) {
    const {
      lat,
      lng,
      radiusKm = 15,
      query,
      categorieId,
      typeId,
      page = 1,
      limit = 10,
    } = search;

    // Base conditions for Prisma
    const conditions: any = {
      status: 'ACTIVE',
    };
    if (query) conditions.title = { contains: query, mode: 'insensitive' };
    if (categorieId) conditions.categorieId = categorieId;
    if (typeId) conditions.typeId = typeId;

    // If no coordinates, use FunctionService.paginate
    if (!lat || !lng) {
      const result = await this.functionService.paginate({
        model: 'annonce',
        page,
        limit,
        conditions,
        orderBy: { createdAt: 'desc' },
        selectAndInclude: {
          include: {
            categorie: true,
            type: true,
            user: { select: { email: true, fullName: true } },
          },
        },
        fileTypeListes: ['annoncesFiles'],
      });
      return { data: result.data, isFallback: false };
    }

    // Standard SQL search using Bounding Box logic (approximate)
    const latDelta = radiusKm / 111;
    const lngDelta = radiusKm / (111 * Math.cos(lat * (Math.PI / 180)));

    const queryValue = query ? `%${query}%` : null;
    const offsetValue = (Number(page) - 1) * Number(limit);
    const limitValue = Number(limit);

    let data: any[] = await this.prisma.$queryRaw`
            SELECT a.*, c.label as "categoryLabel", t.label as "typeLabel"
            FROM "Annonce" a
            LEFT JOIN "CategorieAnnonce" c ON a."categorieId" = c.id
            LEFT JOIN "TypeAnnonce" t ON a."typeId" = t.id
            WHERE a.status = 'ACTIVE'
              AND a.latitude BETWEEN ${lat - latDelta} AND ${lat + latDelta}
              AND a.longitude BETWEEN ${lng - lngDelta} AND ${lng + lngDelta}
              ${query ? Prisma.sql`AND a.title ILIKE ${queryValue}` : Prisma.empty}
              ${categorieId ? Prisma.sql`AND a."categorieId" = ${categorieId}` : Prisma.empty}
              ${typeId ? Prisma.sql`AND a."typeId" = ${typeId}` : Prisma.empty}
            ORDER BY a."createdAt" DESC
            LIMIT ${limitValue} OFFSET ${offsetValue}
        `;

    let isFallback = false;

    // Fallback logic
    if (data.length === 0) {
      isFallback = true;
      data = await this.prisma.$queryRaw`
                SELECT a.*, c.label as "categoryLabel", t.label as "typeLabel"
                FROM "Annonce" a
                LEFT JOIN "CategorieAnnonce" c ON a."categorieId" = c.id
                LEFT JOIN "TypeAnnonce" t ON a."typeId" = t.id
                WHERE a.status = 'ACTIVE'
                ${query ? Prisma.sql`AND a.title ILIKE ${queryValue}` : Prisma.empty}
                ${categorieId ? Prisma.sql`AND a."categorieId" = ${categorieId}` : Prisma.empty}
                ${typeId ? Prisma.sql`AND a."typeId" = ${typeId}` : Prisma.empty}
                ORDER BY a."createdAt" DESC
                LIMIT ${limitValue} OFFSET ${offsetValue}
            `;
    }

    // Manually enrich with files
    const enrichedData = await Promise.all(
      data.map(async (item) => {
        const images = await this.prisma.fileManager.findMany({
          where: { targetId: item.id, fileType: 'annoncesFiles' },
        });
        return { ...item, images };
      }),
    );

    return { data: enrichedData, isFallback };
  }

  async update(id: string, dto: UpdateAnnonceDto, files?: any[]) {
    const annonce = await this.prisma.annonce.findUnique({ where: { id } });
    if (!annonce) throw new Error('Annonce not found');

    // Update basic info
    const updatedAnnonce = await this.prisma.annonce.update({
      where: { id },
      data: {
        title: dto.title ?? undefined,
        description: dto.description ?? undefined,
        companyName: dto.companyName ?? undefined,
        price: dto.price ?? undefined,
        status: dto.status ?? undefined,
        latitude: dto.latitude ?? undefined,
        longitude: dto.longitude ?? undefined,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        typeId: dto.typeId ?? undefined,
        categorieId: dto.categorieId ?? undefined,
        options: dto.options ?? undefined,
      },
    });

    // Handle new file uploads if any
    if (files && files.length > 0) {
      const urls: string[] = [...annonce.images];
      for (const file of files) {
        const upload = await this.localStorageService.saveFile(
          file.buffer,
          'annonces',
        );
        urls.push(upload.fileUrl);

        await this.prisma.fileManager.create({
          data: {
            fileCode: upload.fileCode,
            fileName: upload.fileName,
            fileMimeType: upload.fileMimeType,
            fileSize: upload.fileSize,
            fileUrl: upload.fileUrl,
            fileType: 'annoncesFiles',
            targetId: id,
            filePath: upload.filePath,
          },
        });
      }

      this.logger.log(`Annonce updated: ${id}`, 'AnnonceService');
      return this.prisma.annonce.update({
        where: { id },
        data: { images: urls },
      });
    }

    this.logger.log(`Annonce updated: ${id}`, 'AnnonceService');
    return updatedAnnonce;
  }

  async findOne(id: string) {
    const annonce = await this.prisma.annonce.findUnique({
      where: { id },
      include: {
        categorie: true,
        type: true,
        user: { select: { email: true, fullName: true, phone: true } },
      },
    });

    if (!annonce) return null;

    const files = await this.prisma.fileManager.findMany({
      where: { targetId: id, fileType: 'annoncesFiles' },
    });

    return { ...annonce, files };
  }

  async remove(id: string) {
    const annonce = await this.prisma.annonce.delete({
      where: { id },
    });
    this.logger.log(`Annonce deleted: ${id}`, 'AnnonceService');
    return annonce;
  }

  async handleToggleActive(id: string, value: boolean) {
    const annonce = await this.prisma.annonce.update({
      where: { id },
      data: { status: value ? 'ACTIVE' : 'DRAFT' },
    });
    return annonce;
  }
}
