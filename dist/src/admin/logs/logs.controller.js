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
exports.LogsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const logs_service_1 = require("./logs.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const base_response_dto_1 = require("../../common/dto/base-response.dto");
const common_2 = require("@nestjs/common");
let LogsController = class LogsController {
    logsService;
    constructor(logsService) {
        this.logsService = logsService;
    }
    async getLogs(startDate, endDate, level, page = '1', limit = '10') {
        const result = await this.logsService.getLogs(startDate, endDate, level, parseInt(page), parseInt(limit));
        return new base_response_dto_1.BaseResponse(common_2.HttpStatus.OK, 'Logs récupérés', result);
    }
    async deleteLogs(dates) {
        const datesArray = Array.isArray(dates) ? dates : [dates];
        const result = await this.logsService.deleteLogs(datesArray);
        return new base_response_dto_1.BaseResponse(common_2.HttpStatus.OK, 'Logs supprimés', result);
    }
    async getLogFiles() {
        const result = await this.logsService.getLogFiles();
        return new base_response_dto_1.BaseResponse(common_2.HttpStatus.OK, 'Dates des logs récupérées', result);
    }
};
exports.LogsController = LogsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get logs with filtering and pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Format: YYYY-MM-DD' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'Format: YYYY-MM-DD' }),
    (0, swagger_1.ApiQuery)({ name: 'level', required: false, enum: ['info', 'warn', 'error'] }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('level')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], LogsController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete multiple log files by date' }),
    (0, swagger_1.ApiQuery)({ name: 'dates', required: true, type: [String], description: 'Array of dates (YYYY-MM-DD) to delete' }),
    __param(0, (0, common_1.Query)('dates')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LogsController.prototype, "deleteLogs", null);
__decorate([
    (0, common_1.Get)('files'),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of available log file dates' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LogsController.prototype, "getLogFiles", null);
exports.LogsController = LogsController = __decorate([
    (0, swagger_1.ApiTags)('Admin Logs'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('admin/logs'),
    __metadata("design:paramtypes", [logs_service_1.LogsService])
], LogsController);
//# sourceMappingURL=logs.controller.js.map