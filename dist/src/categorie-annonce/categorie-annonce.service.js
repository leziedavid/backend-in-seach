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
exports.CategorieAnnonceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_service_1 = require("../utils/pagination.service");
const LocalStorageService_1 = require("../utils/LocalStorageService");
let CategorieAnnonceService = class CategorieAnnonceService {
    prisma;
    functionService;
    localStorageService;
    constructor(prisma, functionService, localStorageService) {
        this.prisma = prisma;
        this.functionService = functionService;
        this.localStorageService = localStorageService;
    }
    async forSelect() {
        return this.prisma.categorieAnnonce.findMany({
            select: { id: true, label: true },
        });
    }
    async findAll(query) {
        const conditions = {};
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
    async findOne(id) {
        return this.prisma.categorieAnnonce.findUnique({
            where: { id },
        });
    }
    async create(dto, file) {
        let iconUrl = '';
        const category = await this.prisma.categorieAnnonce.create({
            data: {
                label: dto.label,
                slug: dto.slug,
                iconName: '',
            },
        });
        if (file) {
            const upload = await this.localStorageService.saveFile(file.buffer, 'categories');
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
    async update(id, dto, file) {
        const category = await this.prisma.categorieAnnonce.findUnique({
            where: { id },
        });
        if (!category)
            throw new Error('Category not found');
        const updateData = {
            label: dto.label ?? undefined,
            slug: dto.slug ?? undefined,
        };
        if (file) {
            const upload = await this.localStorageService.saveFile(file.buffer, 'categories');
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
    async remove(id) {
        return this.prisma.categorieAnnonce.delete({
            where: { id },
        });
    }
};
exports.CategorieAnnonceService = CategorieAnnonceService;
exports.CategorieAnnonceService = CategorieAnnonceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pagination_service_1.FunctionService,
        LocalStorageService_1.LocalStorageService])
], CategorieAnnonceService);
//# sourceMappingURL=categorie-annonce.service.js.map