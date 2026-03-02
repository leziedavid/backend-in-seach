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
exports.ServiceSearchDto = exports.UpdateServiceDto = exports.CreateServiceDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const swagger_2 = require("@nestjs/swagger");
class CreateServiceDto {
    title;
    description;
    type;
    status;
    frais;
    price;
    reduction;
    tags;
    location;
    latitude;
    longitude;
    images;
    existingImageUrls;
    categoryId;
}
exports.CreateServiceDto = CreateServiceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nettoyage de vitres' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Nettoyage professionnel de vitres pour bureaux et maisons',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ServiceType, example: client_1.ServiceType.DEPANNAGE }),
    (0, class_validator_1.IsEnum)(client_1.ServiceType),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.ServiceStatus,
        example: client_1.ServiceStatus.AVAILABLE,
        required: false,
    }),
    (0, class_validator_1.IsEnum)(client_1.ServiceStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 45.0, required: false, description: 'Tarif estimatif' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "frais", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50.5, required: false, description: 'Montant final' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        required: false,
        description: 'Réduction en pourcentage ou montant',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "reduction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        example: ['nettoyage', 'vitres'],
        required: false,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            }
            catch (e) {
                return value.split(',').map(v => v.trim());
            }
        }
        return value;
    }),
    __metadata("design:type", Array)
], CreateServiceDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { type: 'Point', coordinates: [2.3522, 48.8566] },
        required: false,
        description: 'GeoJSON point',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateServiceDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 48.8566 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2.3522 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: 'array',
        items: { type: 'string', format: 'binary' },
        description: 'Images uploadées du service',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateServiceDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Existing image URLs to keep',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateServiceDto.prototype, "existingImageUrls", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-of-category' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "categoryId", void 0);
class UpdateServiceDto extends (0, swagger_2.PartialType)(CreateServiceDto) {
}
exports.UpdateServiceDto = UpdateServiceDto;
class ServiceSearchDto {
    lat;
    lng;
    radiusKm;
    query;
    categoryId;
    page;
    limit;
}
exports.ServiceSearchDto = ServiceSearchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'null' || value === '' ? undefined : Number(value)),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ServiceSearchDto.prototype, "lat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'null' || value === '' ? undefined : Number(value)),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ServiceSearchDto.prototype, "lng", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 15 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'null' || value === '' ? undefined : Number(value)),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ServiceSearchDto.prototype, "radiusKm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'null' || value === '' ? undefined : value),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ServiceSearchDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'null' || value === '' ? undefined : value),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ServiceSearchDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'null' || value === '' ? undefined : Number(value)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ServiceSearchDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'null' || value === '' ? undefined : Number(value)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ServiceSearchDto.prototype, "limit", void 0);
//# sourceMappingURL=service.dto.js.map