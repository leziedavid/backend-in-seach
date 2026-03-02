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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlanController = void 0;
const common_1 = require("@nestjs/common");
const subscription_plan_service_1 = require("./subscription-plan.service");
const plan_dto_1 = require("./dto/plan.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
const pagination_dto_1 = require("../utils/dto/pagination.dto");
const base_response_dto_1 = require("../common/dto/base-response.dto");
let SubscriptionPlanController = class SubscriptionPlanController {
    planService;
    constructor(planService) {
        this.planService = planService;
    }
    async create(dto) {
        const result = await this.planService.create(dto);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.CREATED, 'Plan créé', result);
    }
    async findAll(query) {
        const result = await this.planService.findAll(query);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Plans récupérés', result);
    }
    async findOne(id) {
        const result = await this.planService.findOne(id);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Plan récupéré', result);
    }
    async update(id, dto) {
        const result = await this.planService.update(id, dto);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Plan mis à jour', result);
    }
    async remove(id) {
        const result = await this.planService.remove(id);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Plan supprimé', result);
    }
};
exports.SubscriptionPlanController = SubscriptionPlanController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new subscription plan' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [plan_dto_1.CreateSubscriptionPlanDto]),
    __metadata("design:returntype", Promise)
], SubscriptionPlanController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all subscription plans' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], SubscriptionPlanController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get subscription plan by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionPlanController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a subscription plan' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, plan_dto_1.UpdateSubscriptionPlanDto]),
    __metadata("design:returntype", Promise)
], SubscriptionPlanController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a subscription plan' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionPlanController.prototype, "remove", null);
exports.SubscriptionPlanController = SubscriptionPlanController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Subscription Plans'),
    (0, common_1.Controller)('admin/subscription-plans'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __metadata("design:paramtypes", [subscription_plan_service_1.SubscriptionPlanService])
], SubscriptionPlanController);
//# sourceMappingURL=subscription-plan.controller.js.map