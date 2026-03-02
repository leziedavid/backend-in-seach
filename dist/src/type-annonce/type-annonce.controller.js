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
exports.TypeAnnonceController = void 0;
const common_1 = require("@nestjs/common");
const type_annonce_service_1 = require("./type-annonce.service");
const type_annonce_dto_1 = require("./dto/type-annonce.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
const base_response_dto_1 = require("../common/dto/base-response.dto");
let TypeAnnonceController = class TypeAnnonceController {
    typeAnnonceService;
    constructor(typeAnnonceService) {
        this.typeAnnonceService = typeAnnonceService;
    }
    async create(dto) {
        const result = await this.typeAnnonceService.create(dto);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.CREATED, "Type d'annonce créé avec succès", result);
    }
    async findAll(query) {
        const result = await this.typeAnnonceService.findAll(query);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, "Types d'annonces récupérés", result);
    }
    async forSelect() {
        const result = await this.typeAnnonceService.forSelect();
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Types pour sélection récupérés', result);
    }
    async findOne(id) {
        const result = await this.typeAnnonceService.findOne(id);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, "Détails du type d'annonce récupérés", result);
    }
    async update(id, dto) {
        const result = await this.typeAnnonceService.update(id, dto);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, "Type d'annonce mis à jour", result);
    }
    async remove(id) {
        await this.typeAnnonceService.remove(id);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, "Type d'annonce supprimé");
    }
};
exports.TypeAnnonceController = TypeAnnonceController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new type of annonce (Admin only)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [type_annonce_dto_1.CreateTypeAnnonceDto]),
    __metadata("design:returntype", Promise)
], TypeAnnonceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all types of annonces' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [type_annonce_dto_1.TypeAnnonceSearchDto]),
    __metadata("design:returntype", Promise)
], TypeAnnonceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('select'),
    (0, swagger_1.ApiOperation)({ summary: 'Get types for select' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TypeAnnonceController.prototype, "forSelect", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get details of a type of annonce' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TypeAnnonceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a type of annonce (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, type_annonce_dto_1.UpdateTypeAnnonceDto]),
    __metadata("design:returntype", Promise)
], TypeAnnonceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a type of annonce (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TypeAnnonceController.prototype, "remove", null);
exports.TypeAnnonceController = TypeAnnonceController = __decorate([
    (0, swagger_1.ApiTags)('Type Annonce'),
    (0, common_1.Controller)('type-annonce'),
    __metadata("design:paramtypes", [type_annonce_service_1.TypeAnnonceService])
], TypeAnnonceController);
//# sourceMappingURL=type-annonce.controller.js.map