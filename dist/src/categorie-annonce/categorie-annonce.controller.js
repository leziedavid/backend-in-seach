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
exports.CategorieAnnonceController = void 0;
const common_1 = require("@nestjs/common");
const categorie_annonce_service_1 = require("./categorie-annonce.service");
const categorie_annonce_dto_1 = require("./dto/categorie-annonce.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const base_response_dto_1 = require("../common/dto/base-response.dto");
let CategorieAnnonceController = class CategorieAnnonceController {
    categorieAnnonceService;
    constructor(categorieAnnonceService) {
        this.categorieAnnonceService = categorieAnnonceService;
    }
    async create(dto, file) {
        const result = await this.categorieAnnonceService.create(dto, file);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.CREATED, "Catégorie d'annonce créée avec succès", result);
    }
    async findAll(query) {
        const result = await this.categorieAnnonceService.findAll(query);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, "Catégories d'annonces récupérées", result);
    }
    async forSelect() {
        const result = await this.categorieAnnonceService.forSelect();
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Catégories pour sélection récupérées', result);
    }
    async findOne(id) {
        const result = await this.categorieAnnonceService.findOne(id);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, "Détails de la catégorie d'annonce récupérés", result);
    }
    async update(id, dto, file) {
        const result = await this.categorieAnnonceService.update(id, dto, file);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, "Catégorie d'annonce mise à jour", result);
    }
    async remove(id) {
        await this.categorieAnnonceService.remove(id);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, "Catégorie d'annonce supprimée");
    }
};
exports.CategorieAnnonceController = CategorieAnnonceController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new category of annonce (Admin only)' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('icon')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [categorie_annonce_dto_1.CreateCategorieAnnonceDto, Object]),
    __metadata("design:returntype", Promise)
], CategorieAnnonceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all categories of annonces' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [categorie_annonce_dto_1.CategorieAnnonceSearchDto]),
    __metadata("design:returntype", Promise)
], CategorieAnnonceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('select'),
    (0, swagger_1.ApiOperation)({ summary: 'Get categories for select' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategorieAnnonceController.prototype, "forSelect", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get details of a category of annonce' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategorieAnnonceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a category of annonce (Admin only)' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('icon')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, categorie_annonce_dto_1.UpdateCategorieAnnonceDto, Object]),
    __metadata("design:returntype", Promise)
], CategorieAnnonceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a category of annonce (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategorieAnnonceController.prototype, "remove", null);
exports.CategorieAnnonceController = CategorieAnnonceController = __decorate([
    (0, swagger_1.ApiTags)('Categorie Annonce'),
    (0, common_1.Controller)('categorie-annonce'),
    __metadata("design:paramtypes", [categorie_annonce_service_1.CategorieAnnonceService])
], CategorieAnnonceController);
//# sourceMappingURL=categorie-annonce.controller.js.map