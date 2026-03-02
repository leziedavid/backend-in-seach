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
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const pagination_service_1 = require("../utils/pagination.service");
let SubscriptionService = class SubscriptionService {
    prisma;
    functionService;
    constructor(prisma, functionService) {
        this.prisma = prisma;
        this.functionService = functionService;
    }
    async checkServiceLimit(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                subscription: {
                    include: { plan: true },
                },
                _count: {
                    select: { services: true },
                },
            },
        });
        if (!user)
            throw new Error('User not found');
        if (user.isPremium)
            return true;
        if (user.subscription &&
            user.subscription.status === client_1.SubscriptionStatus.ACTIVE) {
            if (new Date() < user.subscription.endDate) {
                if (user.subscription.plan.serviceLimit === 999999)
                    return true;
                if (user._count.services >= user.subscription.plan.serviceLimit) {
                    throw new common_1.ForbiddenException('Limite atteinte. Passez au plan Premium.');
                }
                return true;
            }
        }
        const freePlanLimit = 5;
        if (user._count.services >= freePlanLimit) {
            throw new common_1.ForbiddenException('Limite atteinte. Passez au plan Premium.');
        }
        return true;
    }
    async getAllPlans(query) {
        return this.functionService.paginate({
            model: 'subscriptionPlan',
            page: query.page,
            limit: query.limit,
            conditions: { isActive: true },
            orderBy: { price: 'asc' },
        });
    }
    async subscribe(userId, planId) {
        const plan = await this.prisma.subscriptionPlan.findUnique({
            where: { id: planId },
        });
        if (!plan)
            throw new Error('Plan not found');
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.durationDays);
        return this.prisma.subscription.upsert({
            where: { userId },
            update: {
                planId,
                status: client_1.SubscriptionStatus.ACTIVE,
                startDate: new Date(),
                endDate,
            },
            create: {
                userId,
                planId,
                status: client_1.SubscriptionStatus.ACTIVE,
                startDate: new Date(),
                endDate,
            },
        });
    }
    async updateSubscription(userId, dto) {
        return this.prisma.subscription.update({
            where: { userId },
            data: dto,
        });
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pagination_service_1.FunctionService])
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map