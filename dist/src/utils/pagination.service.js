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
exports.FunctionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FunctionService = class FunctionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async enrichWithFiles(entity, fileTypeListes) {
        if (!fileTypeListes?.length)
            return { ...entity, files: [] };
        const files = await this.prisma.fileManager.findMany({
            where: {
                targetId: entity.id,
                fileType: { in: fileTypeListes },
            },
            orderBy: { createdAt: 'desc' },
        });
        return { ...entity, files };
    }
    async paginate(options) {
        const validPage = Math.max(1, Number(options.page) || 1);
        const validLimit = Math.min(Math.max(1, Number(options.limit) || 10), 100);
        const skip = (validPage - 1) * validLimit;
        const total = await this.prisma[options.model].count({
            where: options.conditions,
        });
        let data = await this.prisma[options.model].findMany({
            skip,
            take: validLimit,
            where: options.conditions,
            orderBy: options.orderBy,
            ...(options.selectAndInclude || {}),
        });
        if (options.fileTypeListes?.length) {
            data = await Promise.all(data.map((d) => this.enrichWithFiles(d, options.fileTypeListes)));
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
};
exports.FunctionService = FunctionService;
exports.FunctionService = FunctionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FunctionService);
//# sourceMappingURL=pagination.service.js.map