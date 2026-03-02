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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./dto/auth.dto");
const swagger_1 = require("@nestjs/swagger");
const base_response_dto_1 = require("../common/dto/base-response.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const search_dto_1 = require("./dto/search.dto");
const roles_guard_1 = require("./guards/roles.guard");
const roles_decorator_1 = require("./decorators/roles.decorator");
const client_1 = require("@prisma/client");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(dto) {
        const result = await this.authService.register(dto);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.CREATED, 'Utilisateur créé avec succès', result);
    }
    async login(dto) {
        const result = await this.authService.login(dto);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Connexion réussie', result);
    }
    async reverseGeocode(lat, lng) {
        if (!lat || !lng)
            throw new common_1.BadRequestException('Latitude et longitude requises');
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const result = await this.authService.reverseGeocode(latitude, longitude);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Adresse récupérée avec succès', result);
    }
    async globalSearch(search) {
        const result = await this.authService.getGlobalDataBySearch(search);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Recherche effectuée avec succès', result);
    }
    async getMySpace(req, search) {
        const result = await this.authService.getGlobalDataByUserId(req.user.id, search);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Données de votre espace récupérées avec succès', result);
    }
    async getUserData(userId, search) {
        const result = await this.authService.getGlobalDataByUserId(userId, search);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, `Données de l'utilisateur récupérées avec succès`, result);
    }
    async getMe(req) {
        const result = await this.authService.getMe(req.user.id);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Profil récupéré avec succès', result);
    }
    async reconnect(id) {
        const result = await this.authService.reconnect(id);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Reconnexion réussie', result);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Login with email and password' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('reverse-geocode'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer l’adresse depuis des coordonnées', description: 'Retourne une adresse complète via latitude et longitude.', }),
    (0, swagger_1.ApiQuery)({ name: 'lat', type: 'number', required: true, description: 'Latitude', }),
    (0, swagger_1.ApiQuery)({ name: 'lng', type: 'number', required: true, description: 'Longitude', }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Adresse récupérée avec succès.', schema: { type: 'object' }, }),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "reverseGeocode", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Global search (public)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_dto_1.SearchDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "globalSearch", null);
__decorate([
    (0, common_1.Get)('my-space'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user global data (My Space)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, search_dto_1.SearchDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMySpace", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user global data by ID (Admin only)' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, search_dto_1.SearchDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUserData", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMe", null);
__decorate([
    (0, common_1.Post)('reconnect/:id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Reconnect as another user (Simulation)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "reconnect", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map