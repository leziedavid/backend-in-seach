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
exports.AnnonceController = void 0;
const common_1 = require("@nestjs/common");
const annonce_service_1 = require("./annonce.service");
const annonce_dto_1 = require("./dto/annonce.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const base_response_dto_1 = require("../common/dto/base-response.dto");
let AnnonceController = class AnnonceController {
    annonceService;
    constructor(annonceService) {
        this.annonceService = annonceService;
    }
    async create(req, dto, files) {
        const result = await this.annonceService.create(req.user.id, dto, files);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.CREATED, 'Annonce créée avec succès', result);
    }
    async findAll(search) {
        const result = await this.annonceService.findAll(search);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Annonces récupérées', result);
    }
    async findOne(id) {
        const result = await this.annonceService.findOne(id);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, "Détails de l'annonce récupérés", result);
    }
    async update(id, dto, files) {
        const result = await this.annonceService.update(id, dto, files);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Annonce mise à jour', result);
    }
    async remove(id) {
        await this.annonceService.remove(id);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Annonce supprimée');
    }
    async toggleActive(id, dto) {
        const result = await this.annonceService.handleToggleActive(id, dto.value);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Annonce activée/désactivée', result);
    }
};
exports.AnnonceController = AnnonceController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new annonce' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, annonce_dto_1.CreateAnnonceDto, Array]),
    __metadata("design:returntype", Promise)
], AnnonceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Search annonces with filters and geolocation' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [annonce_dto_1.AnnonceSearchDto]),
    __metadata("design:returntype", Promise)
], AnnonceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get annonce details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnnonceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Update annonce' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, annonce_dto_1.UpdateAnnonceDto, Array]),
    __metadata("design:returntype", Promise)
], AnnonceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete annonce' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnnonceController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-active'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle annonce active/draft' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AnnonceController.prototype, "toggleActive", null);
exports.AnnonceController = AnnonceController = __decorate([
    (0, swagger_1.ApiTags)('Annonces'),
    (0, common_1.Controller)('annonces'),
    __metadata("design:paramtypes", [annonce_service_1.AnnonceService])
], AnnonceController);
//# sourceMappingURL=annonce.controller.js.map