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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_service_1 = require("../utils/pagination.service");
const LocalStorageService_1 = require("../utils/LocalStorageService");
let CategoryService = class CategoryService {
    prisma;
    functionService;
    localStorageService;
    constructor(prisma, functionService, localStorageService) {
        this.prisma = prisma;
        this.functionService = functionService;
        this.localStorageService = localStorageService;
    }
    async forSelect() {
        return this.prisma.category.findMany({ select: { id: true, label: true } });
    }
    async findAll(query) {
        return this.functionService.paginate({
            model: 'category',
            page: query.page,
            limit: query.limit,
            conditions: {},
            orderBy: { label: 'asc' },
        });
    }
    async findOne(id) {
        return this.prisma.category.findUnique({
            where: { id },
        });
    }
    async create(data) {
        let iconUrl = '';
        let fileCode = '';
        if (data.iconFile) {
            const upload = await this.localStorageService.saveFile(data.iconFile, 'categories');
            iconUrl = upload.fileUrl;
            fileCode = upload.fileCode;
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
    async update(id, data) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category)
            throw new Error('Category not found');
        const updateData = { label: data.label };
        if (data.iconFile) {
            const upload = await this.localStorageService.saveFile(data.iconFile, 'categories');
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
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pagination_service_1.FunctionService,
        LocalStorageService_1.LocalStorageService])
], CategoryService);
//# sourceMappingURL=category.service.js.map