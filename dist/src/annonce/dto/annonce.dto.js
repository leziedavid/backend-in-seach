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
exports.AnnonceSearchDto = exports.UpdateAnnonceDto = exports.CreateAnnonceDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const swagger_2 = require("@nestjs/swagger");
class CreateAnnonceDto {
    title;
    description;
    companyName;
    status;
    price;
    latitude;
    longitude;
    startDate;
    endDate;
    typeId;
    categorieId;
    options;
    files;
}
exports.CreateAnnonceDto = CreateAnnonceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Vente de Piano' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAnnonceDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Piano droit en excellent état' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAnnonceDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mon Entreprise', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnnonceDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.AnnonceStatus,
        example: client_1.AnnonceStatus.ACTIVE,
        required: false,
    }),
    (0, class_validator_1.IsEnum)(client_1.AnnonceStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnnonceDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateAnnonceDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 48.8566 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateAnnonceDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2.3522 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateAnnonceDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-02-14T00:00:00Z', required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnnonceDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-02-28T00:00:00Z', required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnnonceDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-of-type' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAnnonceDto.prototype, "typeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-of-category' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAnnonceDto.prototype, "categorieId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Parking', 'Wifi'], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateAnnonceDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: 'array',
        items: { type: 'string', format: 'binary' },
        description: "Images de l'annonce",
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateAnnonceDto.prototype, "files", void 0);
class UpdateAnnonceDto extends (0, swagger_2.PartialType)(CreateAnnonceDto) {
}
exports.UpdateAnnonceDto = UpdateAnnonceDto;
class AnnonceSearchDto {
    lat;
    lng;
    radiusKm;
    query;
    typeId;
    categorieId;
    page;
    limit;
}
exports.AnnonceSearchDto = AnnonceSearchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'null' || value === '' ? undefined : Number(value)),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AnnonceSearchDto.prototype, "lat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'null' || value === '' ? undefined : Number(value)),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AnnonceSearchDto.prototype, "lng", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 15 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'null' || value === '' ? undefined : Number(value)),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AnnonceSearchDto.prototype, "radiusKm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'null' || value === '' ? undefined : value),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnnonceSearchDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'null' || value === '' ? undefined : value),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AnnonceSearchDto.prototype, "typeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'null' || value === '' ? undefined : value),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AnnonceSearchDto.prototype, "categorieId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'null' || value === '' ? undefined : Number(value)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AnnonceSearchDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'null' || value === '' ? undefined : Number(value)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AnnonceSearchDto.prototype, "limit", void 0);
//# sourceMappingURL=annonce.dto.js.map