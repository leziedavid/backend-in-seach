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
exports.BaseResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
class BaseResponse {
    statusCode;
    message;
    data;
    constructor(statusCode, message, data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}
exports.BaseResponse = BaseResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Code de statut HTTP', example: 200 }),
    __metadata("design:type", Number)
], BaseResponse.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Message du statut', example: 'Succès' }),
    __metadata("design:type", String)
], BaseResponse.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Données retournées',
        required: false,
        nullable: true,
    }),
    __metadata("design:type", Object)
], BaseResponse.prototype, "data", void 0);
//# sourceMappingURL=base-response.dto.js.map