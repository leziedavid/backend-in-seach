import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, ServiceSearchDto } from './dto/service.dto';
import { SubscriptionService } from '../subscription/subscription.service';
import { FunctionService } from '../utils/pagination.service';
import { LocalStorageService } from '../utils/LocalStorageService';
import { MyLogger } from '../utils/logger';
import { Prisma, ServiceType } from '@prisma/client';
import { expandIntention } from 'src/utils/expand-intention.util';
import { generateUniqueCode } from '../utils/code-generator.util';

@Injectable()
export class ServiceService {
  constructor(
    private prisma: PrismaService,
    private subscriptionService: SubscriptionService,
    private functionService: FunctionService,
    private localStorageService: LocalStorageService,
    private logger: MyLogger,
  ) { }

  async create3(userId: string, dto: CreateServiceDto, files?: any[]) {
    // 1. Check subscription limit
    await this.subscriptionService.checkServiceLimit(userId);

    // 2. Create service
    const service = await this.prisma.service.create({
      data: {
        title: dto.title,
        description: dto.description,
        type: dto.type,
        latitude: dto.latitude,
        longitude: dto.longitude,
        categoryId: dto.categoryId,
        userId,
        frais: dto.frais,
        price: dto.price,
        code: generateUniqueCode('SV'),
        imageUrls: [], // Will be updated if files exist
      },
    });

    // 3. Handle file uploads if any
    if (files && files.length > 0) {
      const urls: string[] = [];
      for (const file of files) {
        const upload = await this.localStorageService.saveFile(
          file.buffer,
          'services',
        );
        urls.push(upload.fileUrl);

        await this.prisma.fileManager.create({
          data: {
            fileCode: upload.fileCode,
            fileName: upload.fileName,
            fileMimeType: upload.fileMimeType,
            fileSize: upload.fileSize,
            fileUrl: upload.fileUrl,
            fileType: 'servicesFiles',
            targetId: service.id,
            filePath: upload.filePath,
          },
        });
      }

      await this.prisma.service.update({
        where: { id: service.id },
        data: { imageUrls: urls },
      });

      return { ...service, imageUrls: urls };
    }

    return service;
  }

  async create(userId: string, dto: any, files?: any[]) {
    // 1. Check subscription limit
    await this.subscriptionService.checkServiceLimit(userId);

    // 2. Convert FormData values
    const title = dto.title;
    const description = dto.description;
    const type = dto.type as ServiceType;
    const latitude = dto.latitude ? parseFloat(dto.latitude) : null;
    const longitude = dto.longitude ? parseFloat(dto.longitude) : null;
    const categoryId = dto.categoryId;
    const frais = dto.frais ? parseFloat(dto.frais) : null;
    const price = dto.price ? parseFloat(dto.price) : null;
    const tags = dto.tags ? Array.isArray(dto.tags) ? dto.tags : dto.tags.split(",").map((t: string) => t.trim()) : [];

    // 3. Create service
    const service = await this.prisma.service.create({
      data: { title, description, type, latitude, longitude, categoryId, userId, frais, price, tags, code: generateUniqueCode('SV'), imageUrls: [], },
    });

    // 4. Handle file uploads if any
    if (files && files.length > 0) {
      const urls: string[] = [];

      for (const file of files) {
        const upload = await this.localStorageService.saveFile(file.buffer, "services");
        urls.push(upload.fileUrl);
        await this.prisma.fileManager.create({
          data: {
            fileCode: upload.fileCode,
            fileName: upload.fileName,
            fileMimeType: upload.fileMimeType,
            fileSize: upload.fileSize,
            fileUrl: upload.fileUrl,
            fileType: "servicesFiles",
            targetId: service.id,
            filePath: upload.filePath,
          },
        });
      }

      // Update service with uploaded images
      await this.prisma.service.update({
        where: { id: service.id },
        data: { imageUrls: urls },
      });

      return { ...service, imageUrls: urls };
    }

    return service;
  }

  async update(id: string, dto: any, files?: any[]) {
    // 1. Récupérer le service existant
    // retire existingImageUrls dans le dto
    delete dto.existingImageUrls;
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new Error("Service not found");

    // 2. Convertir les champs du DTO (FormData compatible)
    const updatedData: any = {
      title: dto.title ?? undefined,
      description: dto.description ?? undefined,
      type: dto.type ?? undefined,
      latitude: dto.latitude ? parseFloat(dto.latitude) : undefined,
      longitude: dto.longitude ? parseFloat(dto.longitude) : undefined,
      categoryId: dto.categoryId ?? undefined,
      status: dto.status ?? undefined,
      frais: dto.frais ? parseFloat(dto.frais) : undefined,
      price: dto.price ? parseFloat(dto.price) : undefined,
      tags: dto.tags ? Array.isArray(dto.tags) ? dto.tags : dto.tags.split(",").map((t: string) => t.trim()) : undefined,
    };

    // 3. Mettre à jour les infos de base
    const updatedService = await this.prisma.service.update({
      where: { id },
      data: updatedData,
    });

    // 4. Gérer les fichiers si présents
    if (files && files.length > 0) {
      const urls: string[] = [...(service.imageUrls || [])];

      for (const file of files) {
        const upload = await this.localStorageService.saveFile(file.buffer, "services");
        urls.push(upload.fileUrl);

        await this.prisma.fileManager.create({
          data: {
            fileCode: upload.fileCode,
            fileName: upload.fileName,
            fileMimeType: upload.fileMimeType,
            fileSize: upload.fileSize,
            fileUrl: upload.fileUrl,
            fileType: "servicesFiles",
            targetId: id,
            filePath: upload.filePath,
          },
        });
      }

      this.logger.log(`Service updated: ${id}`, 'ServiceService');
      // Mettre à jour le service avec toutes les images
      return this.prisma.service.update({
        where: { id },
        data: { imageUrls: urls },
      });
    }

    this.logger.log(`Service updated: ${id}`, 'ServiceService');
    return updatedService;
  }

  // ... reste de tes imports et décorateurs ...

  async findAll(search: ServiceSearchDto) {
    const { lat, lng, radiusKm = 15, query, categoryId, page = 1, limit = 10, } = search;

    // Construction des conditions OR enrichies avec l'intention
    const buildQueryConditions = (q: string) => {
      const terms = expandIntention(q);
      this.logger.log(`🔍 Expanded "${q}" → [${terms.join(', ')}]`, 'ServiceService');

      return terms.flatMap((term) => [
        { title: { contains: term, mode: 'insensitive' as const } },
        { description: { contains: term, mode: 'insensitive' as const } },
        { category: { label: { contains: term, mode: 'insensitive' as const } } },
      ]);
    };

    const conditions: any = { status: 'AVAILABLE' };
    if (query) conditions.OR = buildQueryConditions(query);
    if (categoryId) conditions.categoryId = categoryId;

    // ── Sans coordonnées → pagination classique ──────────────────────────────
    if (!lat || !lng) {
      const result = await this.functionService.paginate({
        model: 'service', page, limit,
        conditions,
        orderBy: { createdAt: 'desc' },
        selectAndInclude: {
          include: { category: true, user: { select: { email: true } } },
        },
        fileTypeListes: ['servicesFiles'],
      });
      return { data: result.data, isFallback: false };
    }

    // ── Avec coordonnées → recherche géographique ────────────────────────────
    const latDelta = radiusKm / 111;
    const lngDelta = radiusKm / (111 * Math.cos(lat * (Math.PI / 180)));
    const offsetValue = (Number(page) - 1) * Number(limit);
    const limitValue = Number(limit);

    // Construction du filtre SQL multi-termes pour l'intention
    const buildSqlTermFilter = (terms: string[]) => {
      const clauses = terms.map(
        (term) =>
          Prisma.sql`(s.title ILIKE ${`%${term}%`} OR s.description ILIKE ${`%${term}%`} OR c.label ILIKE ${`%${term}%`})`,
      );
      return clauses.reduce((acc, clause) => Prisma.sql`${acc} OR ${clause}`);
    };

    const queryTerms = query ? expandIntention(query) : [];
    const sqlQueryFilter = query ? Prisma.sql`AND (${buildSqlTermFilter(queryTerms)})` : Prisma.empty;
    const categoryFilter = categoryId ? Prisma.sql`AND s."categoryId" = ${categoryId}` : Prisma.empty;

    let data: any[] = await this.prisma.$queryRaw`
      SELECT s.*, c.label as "categoryLabel",
        ROUND(
          CAST(
            111.12 * SQRT(
              POW(s.latitude - ${lat}, 2) +
              POW((s.longitude - ${lng}) * COS(${lat} * PI() / 180), 2)
            ) AS numeric
          ), 2
        ) as "distanceKm"
      FROM "Service" s
      LEFT JOIN "Category" c ON s."categoryId" = c.id
      WHERE s.status = 'AVAILABLE'
        AND s.latitude BETWEEN ${lat - latDelta} AND ${lat + latDelta}
        AND s.longitude BETWEEN ${lng - lngDelta} AND ${lng + lngDelta}
        ${sqlQueryFilter}
        ${categoryFilter}
      ORDER BY "distanceKm" ASC, s."createdAt" DESC
      LIMIT ${limitValue} OFFSET ${offsetValue}
    `;

    let isFallback = false;

    // ── Fallback : aucun résultat à proximité → recherche globale ────────────
    if (data.length === 0) {
      isFallback = true;
      this.logger.log(`No results nearby, falling back to global search for: [${queryTerms.join(', ')}]`, 'ServiceService');

      data = await this.prisma.$queryRaw`
      SELECT s.*, c.label as "categoryLabel", NULL as "distanceKm"
      FROM "Service" s
      LEFT JOIN "Category" c ON s."categoryId" = c.id
      WHERE s.status = 'AVAILABLE'
        ${sqlQueryFilter}
        ${categoryFilter}
      ORDER BY s."createdAt" DESC
      LIMIT ${limitValue} OFFSET ${offsetValue}
    `;
    }

    // ── Enrichissement avec les fichiers ─────────────────────────────────────
    const enrichedData = await Promise.all(
      data.map(async (item) => {
        const files = await this.prisma.fileManager.findMany({
          where: { targetId: item.id, fileType: 'servicesFiles' },
        });
        return { ...item, files };
      }),
    );

    return { data: enrichedData, isFallback };
  }


  async findAllByUser(userId: string, search: ServiceSearchDto) {
    const { lat, lng, radiusKm = 15, query, categoryId, page = 1, limit = 10, } = search;
    // Construction des conditions OR enrichies avec l'intention
    const buildQueryConditions = (q: string) => {
      const terms = expandIntention(q);
      console.log(`🔍 Expanded "${q}" → [${terms.join(', ')}]`);
      return terms.flatMap((term) => [
        { title: { contains: term, mode: 'insensitive' as const } },
        { description: { contains: term, mode: 'insensitive' as const } },
        { category: { label: { contains: term, mode: 'insensitive' as const } } },
      ]);
    };

    const conditions: any = {
      status: 'AVAILABLE',
      userId: userId  // ← Filtre par userId directement dans les conditions
    };

    if (query) conditions.OR = buildQueryConditions(query);
    if (categoryId) conditions.categoryId = categoryId;

    // ── Sans coordonnées → pagination classique ──────────────────────────────
    if (!lat || !lng) {
      const result = await this.functionService.paginate({
        model: 'service', page, limit,
        conditions,
        orderBy: { createdAt: 'desc' },
        selectAndInclude: {
          include: { category: true, user: { select: { email: true } } },
        },
        fileTypeListes: ['servicesFiles'],
      });
      return { data: result.data, isFallback: false };
    }

    // ── Avec coordonnées → recherche géographique ────────────────────────────
    const latDelta = radiusKm / 111;
    const lngDelta = radiusKm / (111 * Math.cos(lat * (Math.PI / 180)));
    const offsetValue = (Number(page) - 1) * Number(limit);
    const limitValue = Number(limit);

    // Construction du filtre SQL multi-termes pour l'intention
    const buildSqlTermFilter = (terms: string[]) => {
      const clauses = terms.map(
        (term) =>
          Prisma.sql`(s.title ILIKE ${`%${term}%`} OR s.description ILIKE ${`%${term}%`} OR c.label ILIKE ${`%${term}%`})`,
      );
      return clauses.reduce((acc, clause) => Prisma.sql`${acc} OR ${clause}`);
    };

    const queryTerms = query ? expandIntention(query) : [];
    const sqlQueryFilter = query ? Prisma.sql`AND (${buildSqlTermFilter(queryTerms)})` : Prisma.empty;
    const categoryFilter = categoryId ? Prisma.sql`AND s."categoryId" = ${categoryId}` : Prisma.empty;

    // Filtre par userId (obligatoire dans cette méthode)
    const userFilter = Prisma.sql`AND s."userId" = ${userId}`;

    let data: any[] = await this.prisma.$queryRaw`
    SELECT s.*, c.label as "categoryLabel",
      ROUND(
        CAST(
          111.12 * SQRT(
            POW(s.latitude - ${lat}, 2) +
            POW((s.longitude - ${lng}) * COS(${lat} * PI() / 180), 2)
          ) AS numeric
        ), 2
      ) as "distanceKm"
    FROM "Service" s
    LEFT JOIN "Category" c ON s."categoryId" = c.id
    WHERE s.status = 'AVAILABLE'
      AND s.latitude BETWEEN ${lat - latDelta} AND ${lat + latDelta}
      AND s.longitude BETWEEN ${lng - lngDelta} AND ${lng + lngDelta}
      ${sqlQueryFilter}
      ${categoryFilter}
      ${userFilter}  // ← Filtre utilisateur obligatoire
    ORDER BY "distanceKm" ASC, s."createdAt" DESC
    LIMIT ${limitValue} OFFSET ${offsetValue}
  `;

    let isFallback = false;

    // ── Fallback : aucun résultat à proximité → recherche globale ────────────
    if (data.length === 0) {
      isFallback = true;
      this.logger.log(`No results nearby for user ${userId}, falling back to global search for: [${queryTerms.join(', ')}]`, 'ServiceService');

      data = await this.prisma.$queryRaw`
      SELECT s.*, c.label as "categoryLabel", NULL as "distanceKm"
      FROM "Service" s
      LEFT JOIN "Category" c ON s."categoryId" = c.id
      WHERE s.status = 'AVAILABLE'
        ${sqlQueryFilter}
        ${categoryFilter}
        ${userFilter}  // ← Filtre utilisateur aussi dans le fallback
      ORDER BY s."createdAt" DESC
      LIMIT ${limitValue} OFFSET ${offsetValue}
    `;
    }

    // ── Enrichissement avec les fichiers ─────────────────────────────────────
    const enrichedData = await Promise.all(
      data.map(async (item) => {
        const files = await this.prisma.fileManager.findMany({
          where: { targetId: item.id, fileType: 'servicesFiles' },
        });
        return { ...item, files };
      }),
    );

    return { data: enrichedData, isFallback };
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        user: { select: { email: true } },
        bookings: true,
      },
    });

    if (!service) return null;

    const files = await this.prisma.fileManager.findMany({
      where: { targetId: id, fileType: 'servicesFiles' },
    });

    return { ...service, files };
  }

  // deleteService

  async deleteService(id: string) {
    const service = await this.prisma.service.delete({ where: { id } });
    this.logger.log(`Service deleted: ${id}`, 'ServiceService');
    return service;
  }

  // handleToggleActive

  async handleToggleActive(id: string, value: boolean) {
    const service = await this.prisma.service.update({
      where: { id },
      data: { status: value ? 'AVAILABLE' : 'UNAVAILABLE' },
    });
    return service;
  }


}
