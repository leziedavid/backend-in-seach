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
exports.SearchServiceIaController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const search_service_ia_service_1 = require("./search-service-ia.service");
const base_response_dto_1 = require("../common/dto/base-response.dto");
let SearchServiceIaController = class SearchServiceIaController {
    searchServiceIaService;
    constructor(searchServiceIaService) {
        this.searchServiceIaService = searchServiceIaService;
    }
    async searchByImage(file) {
        const result = await this.searchServiceIaService.searchByImage(file);
        const status = result.data && result.data.length > 0 ? common_1.HttpStatus.OK : common_1.HttpStatus.OK;
        return new base_response_dto_1.BaseResponse(status, result.message || 'Recherche IA effectuée', result);
    }
};
exports.SearchServiceIaController = SearchServiceIaController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SearchServiceIaController.prototype, "searchByImage", null);
exports.SearchServiceIaController = SearchServiceIaController = __decorate([
    (0, common_1.Controller)('search-service-ia'),
    __metadata("design:paramtypes", [search_service_ia_service_1.SearchServiceIaService])
], SearchServiceIaController);
//# sourceMappingURL=search-service-ia.controller.js.map