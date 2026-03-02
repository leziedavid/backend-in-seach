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
exports.DbController = void 0;
const common_1 = require("@nestjs/common");
const db_service_1 = require("./db.service");
const swagger_1 = require("@nestjs/swagger");
const base_response_dto_1 = require("../common/dto/base-response.dto");
let DbController = class DbController {
    dbService;
    constructor(dbService) {
        this.dbService = dbService;
    }
    async seed() {
        const result = await this.dbService.seed();
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Base de données seedée avec succès', result);
    }
};
exports.DbController = DbController;
__decorate([
    (0, common_1.Post)('seed'),
    (0, swagger_1.ApiOperation)({ summary: 'Run database seed script (Admin only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DbController.prototype, "seed", null);
exports.DbController = DbController = __decorate([
    (0, swagger_1.ApiTags)('Database'),
    (0, common_1.Controller)('db'),
    __metadata("design:paramtypes", [db_service_1.DbService])
], DbController);
//# sourceMappingURL=db.controller.js.map