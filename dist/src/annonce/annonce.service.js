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
exports.AnnonceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_service_1 = require("../utils/pagination.service");
const LocalStorageService_1 = require("../utils/LocalStorageService");
const logger_1 = require("../utils/logger");
const client_1 = require("@prisma/client");
const code_generator_util_1 = require("../utils/code-generator.util");
let AnnonceService = class AnnonceService {
    prisma;
    functionService;
    localStorageService;
    logger;
    constructor(prisma, functionService, localStorageService, logger) {
        this.prisma = prisma;
        this.functionService = functionService;
        this.localStorageService = localStorageService;
        this.logger = logger;
    }
    async create(userId, dto, files) {
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
                code: (0, code_generator_util_1.generateUniqueCode)('AN'),
                images: [],
                options: dto.options || [],
            },
        });
        if (files && files.length > 0) {
            const urls = [];
            for (const file of files) {
                const upload = await this.localStorageService.saveFile(file.buffer, 'annonces');
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
    async findAll(search) {
        const { lat, lng, radiusKm = 15, query, categorieId, typeId, page = 1, limit = 10, } = search;
        const conditions = {
            status: 'ACTIVE',
        };
        if (query)
            conditions.title = { contains: query, mode: 'insensitive' };
        if (categorieId)
            conditions.categorieId = categorieId;
        if (typeId)
            conditions.typeId = typeId;
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
        const latDelta = radiusKm / 111;
        const lngDelta = radiusKm / (111 * Math.cos(lat * (Math.PI / 180)));
        const queryValue = query ? `%${query}%` : null;
        const offsetValue = (Number(page) - 1) * Number(limit);
        const limitValue = Number(limit);
        let data = await this.prisma.$queryRaw `
            SELECT a.*, c.label as "categoryLabel", t.label as "typeLabel"
            FROM "Annonce" a
            LEFT JOIN "CategorieAnnonce" c ON a."categorieId" = c.id
            LEFT JOIN "TypeAnnonce" t ON a."typeId" = t.id
            WHERE a.status = 'ACTIVE'
              AND a.latitude BETWEEN ${lat - latDelta} AND ${lat + latDelta}
              AND a.longitude BETWEEN ${lng - lngDelta} AND ${lng + lngDelta}
              ${query ? client_1.Prisma.sql `AND a.title ILIKE ${queryValue}` : client_1.Prisma.empty}
              ${categorieId ? client_1.Prisma.sql `AND a."categorieId" = ${categorieId}` : client_1.Prisma.empty}
              ${typeId ? client_1.Prisma.sql `AND a."typeId" = ${typeId}` : client_1.Prisma.empty}
            ORDER BY a."createdAt" DESC
            LIMIT ${limitValue} OFFSET ${offsetValue}
        `;
        let isFallback = false;
        if (data.length === 0) {
            isFallback = true;
            data = await this.prisma.$queryRaw `
                SELECT a.*, c.label as "categoryLabel", t.label as "typeLabel"
                FROM "Annonce" a
                LEFT JOIN "CategorieAnnonce" c ON a."categorieId" = c.id
                LEFT JOIN "TypeAnnonce" t ON a."typeId" = t.id
                WHERE a.status = 'ACTIVE'
                ${query ? client_1.Prisma.sql `AND a.title ILIKE ${queryValue}` : client_1.Prisma.empty}
                ${categorieId ? client_1.Prisma.sql `AND a."categorieId" = ${categorieId}` : client_1.Prisma.empty}
                ${typeId ? client_1.Prisma.sql `AND a."typeId" = ${typeId}` : client_1.Prisma.empty}
                ORDER BY a."createdAt" DESC
                LIMIT ${limitValue} OFFSET ${offsetValue}
            `;
        }
        const enrichedData = await Promise.all(data.map(async (item) => {
            const images = await this.prisma.fileManager.findMany({
                where: { targetId: item.id, fileType: 'annoncesFiles' },
            });
            return { ...item, images };
        }));
        return { data: enrichedData, isFallback };
    }
    async update(id, dto, files) {
        const annonce = await this.prisma.annonce.findUnique({ where: { id } });
        if (!annonce)
            throw new Error('Annonce not found');
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
        if (files && files.length > 0) {
            const urls = [...annonce.images];
            for (const file of files) {
                const upload = await this.localStorageService.saveFile(file.buffer, 'annonces');
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
    async findOne(id) {
        const annonce = await this.prisma.annonce.findUnique({
            where: { id },
            include: {
                categorie: true,
                type: true,
                user: { select: { email: true, fullName: true, phone: true } },
            },
        });
        if (!annonce)
            return null;
        const files = await this.prisma.fileManager.findMany({
            where: { targetId: id, fileType: 'annoncesFiles' },
        });
        return { ...annonce, files };
    }
    async remove(id) {
        const annonce = await this.prisma.annonce.delete({
            where: { id },
        });
        this.logger.log(`Annonce deleted: ${id}`, 'AnnonceService');
        return annonce;
    }
    async handleToggleActive(id, value) {
        const annonce = await this.prisma.annonce.update({
            where: { id },
            data: { status: value ? 'ACTIVE' : 'DRAFT' },
        });
        return annonce;
    }
};
exports.AnnonceService = AnnonceService;
exports.AnnonceService = AnnonceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pagination_service_1.FunctionService,
        LocalStorageService_1.LocalStorageService,
        logger_1.MyLogger])
], AnnonceService);
//# sourceMappingURL=annonce.service.js.map