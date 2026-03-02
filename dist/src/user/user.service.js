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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_service_1 = require("../utils/pagination.service");
const logger_1 = require("../utils/logger");
let UserService = class UserService {
    prisma;
    functionService;
    logger;
    constructor(prisma, functionService, logger) {
        this.prisma = prisma;
        this.functionService = functionService;
        this.logger = logger;
    }
    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            omit: { password: true },
        });
    }
    async updateCredits(userId, amount) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                credits: {
                    increment: amount,
                },
            },
        });
        this.logger.log(`User credits updated: ${userId} by ${amount}. New total: ${user.credits}`, 'UserService');
        return user;
    }
    async update(id, dto) {
        const user = await this.prisma.user.update({
            where: { id },
            data: dto,
            omit: { password: true },
        });
        this.logger.log(`User profile updated: ${id}`, 'UserService');
        return user;
    }
    async findAll(query) {
        return this.functionService.paginate({
            model: 'user',
            page: query.page,
            limit: query.limit,
            conditions: {},
            orderBy: { createdAt: 'desc' },
            selectAndInclude: {
                omit: { password: true },
            },
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pagination_service_1.FunctionService,
        logger_1.MyLogger])
], UserService);
//# sourceMappingURL=user.service.js.map