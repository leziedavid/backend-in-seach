"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const subscription_service_1 = require("../subscription/subscription.service");
const pagination_service_1 = require("../utils/pagination.service");
const LocalStorageService_1 = require("../utils/LocalStorageService");
const logger_1 = require("../utils/logger");
const client_1 = require("@prisma/client");
const expand_intention_util_1 = require("../utils/expand-intention.util");
const code_generator_util_1 = require("../utils/code-generator.util");
let ServiceService = class ServiceService {
    prisma;
    subscriptionService;
    functionService;
    localStorageService;
    logger;
    constructor(prisma, subscriptionService, functionService, localStorageService, logger) {
        this.prisma = prisma;
        this.subscriptionService = subscriptionService;
        this.functionService = functionService;
        this.localStorageService = localStorageService;
        this.logger = logger;
    }
    async create3(userId, dto, files) {
        await this.subscriptionService.checkServiceLimit(userId);
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
                code: (0, code_generator_util_1.generateUniqueCode)('SV'),
                imageUrls: [],
            },
        });
        if (files && files.length > 0) {
            const urls = [];
            for (const file of files) {
                const upload = await this.localStorageService.saveFile(file.buffer, 'services');
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
    async create(userId, dto, files) {
        await this.subscriptionService.checkServiceLimit(userId);
        const title = dto.title;
        const description = dto.description;
        const type = dto.type;
        const latitude = dto.latitude ? parseFloat(dto.latitude) : null;
        const longitude = dto.longitude ? parseFloat(dto.longitude) : null;
        const categoryId = dto.categoryId;
        const frais = dto.frais ? parseFloat(dto.frais) : null;
        const price = dto.price ? parseFloat(dto.price) : null;
        const tags = dto.tags ? Array.isArray(dto.tags) ? dto.tags : dto.tags.split(",").map((t) => t.trim()) : [];
        const service = await this.prisma.service.create({
            data: { title, description, type, latitude, longitude, categoryId, userId, frais, price, tags, code: (0, code_generator_util_1.generateUniqueCode)('SV'), imageUrls: [], },
        });
        if (files && files.length > 0) {
            const urls = [];
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
            await this.prisma.service.update({
                where: { id: service.id },
                data: { imageUrls: urls },
            });
            return { ...service, imageUrls: urls };
        }
        return service;
    }
    async update(id, dto, files) {
        delete dto.existingImageUrls;
        const service = await this.prisma.service.findUnique({ where: { id } });
        if (!service)
            throw new Error("Service not found");
        const updatedData = {
            title: dto.title ?? undefined,
            description: dto.description ?? undefined,
            type: dto.type ?? undefined,
            latitude: dto.latitude ? parseFloat(dto.latitude) : undefined,
            longitude: dto.longitude ? parseFloat(dto.longitude) : undefined,
            categoryId: dto.categoryId ?? undefined,
            status: dto.status ?? undefined,
            frais: dto.frais ? parseFloat(dto.frais) : undefined,
            price: dto.price ? parseFloat(dto.price) : undefined,
            tags: dto.tags ? Array.isArray(dto.tags) ? dto.tags : dto.tags.split(",").map((t) => t.trim()) : undefined,
        };
        const updatedService = await this.prisma.service.update({
            where: { id },
            data: updatedData,
        });
        if (files && files.length > 0) {
            const urls = [...(service.imageUrls || [])];
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
            return this.prisma.service.update({
                where: { id },
                data: { imageUrls: urls },
            });
        }
        this.logger.log(`Service updated: ${id}`, 'ServiceService');
        return updatedService;
    }
    async findAll(search) {
        const { lat, lng, radiusKm = 15, query, categoryId, page = 1, limit = 10, } = search;
        const buildQueryConditions = (q) => {
            const terms = (0, expand_intention_util_1.expandIntention)(q);
            this.logger.log(`🔍 Expanded "${q}" → [${terms.join(', ')}]`, 'ServiceService');
            return terms.flatMap((term) => [
                { title: { contains: term, mode: 'insensitive' } },
                { description: { contains: term, mode: 'insensitive' } },
                { category: { label: { contains: term, mode: 'insensitive' } } },
            ]);
        };
        const conditions = { status: 'AVAILABLE' };
        if (query)
            conditions.OR = buildQueryConditions(query);
        if (categoryId)
            conditions.categoryId = categoryId;
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
        const latDelta = radiusKm / 111;
        const lngDelta = radiusKm / (111 * Math.cos(lat * (Math.PI / 180)));
        const offsetValue = (Number(page) - 1) * Number(limit);
        const limitValue = Number(limit);
        const buildSqlTermFilter = (terms) => {
            const clauses = terms.map((term) => client_1.Prisma.sql `(s.title ILIKE ${`%${term}%`} OR s.description ILIKE ${`%${term}%`} OR c.label ILIKE ${`%${term}%`})`);
            return clauses.reduce((acc, clause) => client_1.Prisma.sql `${acc} OR ${clause}`);
        };
        const queryTerms = query ? (0, expand_intention_util_1.expandIntention)(query) : [];
        const sqlQueryFilter = query ? client_1.Prisma.sql `AND (${buildSqlTermFilter(queryTerms)})` : client_1.Prisma.empty;
        const categoryFilter = categoryId ? client_1.Prisma.sql `AND s."categoryId" = ${categoryId}` : client_1.Prisma.empty;
        let data = await this.prisma.$queryRaw `
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
        if (data.length === 0) {
            isFallback = true;
            this.logger.log(`No results nearby, falling back to global search for: [${queryTerms.join(', ')}]`, 'ServiceService');
            data = await this.prisma.$queryRaw `
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
        const enrichedData = await Promise.all(data.map(async (item) => {
            const files = await this.prisma.fileManager.findMany({
                where: { targetId: item.id, fileType: 'servicesFiles' },
            });
            return { ...item, files };
        }));
        return { data: enrichedData, isFallback };
    }
    async findAllByUser(userId, search) {
        const { lat, lng, radiusKm = 15, query, categoryId, page = 1, limit = 10, } = search;
        const buildQueryConditions = (q) => {
            const terms = (0, expand_intention_util_1.expandIntention)(q);
            console.log(`🔍 Expanded "${q}" → [${terms.join(', ')}]`);
            return terms.flatMap((term) => [
                { title: { contains: term, mode: 'insensitive' } },
                { description: { contains: term, mode: 'insensitive' } },
                { category: { label: { contains: term, mode: 'insensitive' } } },
            ]);
        };
        const conditions = {
            status: 'AVAILABLE',
            userId: userId
        };
        if (query)
            conditions.OR = buildQueryConditions(query);
        if (categoryId)
            conditions.categoryId = categoryId;
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
        const latDelta = radiusKm / 111;
        const lngDelta = radiusKm / (111 * Math.cos(lat * (Math.PI / 180)));
        const offsetValue = (Number(page) - 1) * Number(limit);
        const limitValue = Number(limit);
        const buildSqlTermFilter = (terms) => {
            const clauses = terms.map((term) => client_1.Prisma.sql `(s.title ILIKE ${`%${term}%`} OR s.description ILIKE ${`%${term}%`} OR c.label ILIKE ${`%${term}%`})`);
            return clauses.reduce((acc, clause) => client_1.Prisma.sql `${acc} OR ${clause}`);
        };
        const queryTerms = query ? (0, expand_intention_util_1.expandIntention)(query) : [];
        const sqlQueryFilter = query ? client_1.Prisma.sql `AND (${buildSqlTermFilter(queryTerms)})` : client_1.Prisma.empty;
        const categoryFilter = categoryId ? client_1.Prisma.sql `AND s."categoryId" = ${categoryId}` : client_1.Prisma.empty;
        const userFilter = client_1.Prisma.sql `AND s."userId" = ${userId}`;
        let data = await this.prisma.$queryRaw `
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
        if (data.length === 0) {
            isFallback = true;
            this.logger.log(`No results nearby for user ${userId}, falling back to global search for: [${queryTerms.join(', ')}]`, 'ServiceService');
            data = await this.prisma.$queryRaw `
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
        const enrichedData = await Promise.all(data.map(async (item) => {
            const files = await this.prisma.fileManager.findMany({
                where: { targetId: item.id, fileType: 'servicesFiles' },
            });
            return { ...item, files };
        }));
        return { data: enrichedData, isFallback };
    }
    async findOne(id) {
        const service = await this.prisma.service.findUnique({
            where: { id },
            include: {
                category: true,
                user: { select: { email: true } },
                bookings: true,
            },
        });
        if (!service)
            return null;
        const files = await this.prisma.fileManager.findMany({
            where: { targetId: id, fileType: 'servicesFiles' },
        });
        return { ...service, files };
    }
    async deleteService(id) {
        const service = await this.prisma.service.delete({ where: { id } });
        this.logger.log(`Service deleted: ${id}`, 'ServiceService');
        return service;
    }
    async handleToggleActive(id, value) {
        const service = await this.prisma.service.update({
            where: { id },
            data: { status: value ? 'AVAILABLE' : 'UNAVAILABLE' },
        });
        return service;
    }
};
exports.ServiceService = ServiceService;
exports.ServiceService = ServiceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        subscription_service_1.SubscriptionService,
        pagination_service_1.FunctionService,
        LocalStorageService_1.LocalStorageService,
        logger_1.MyLogger])
], ServiceService);
//# sourceMappingURL=service.service.js.map