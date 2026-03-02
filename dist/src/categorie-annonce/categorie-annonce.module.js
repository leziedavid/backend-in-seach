"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategorieAnnonceModule = void 0;
const common_1 = require("@nestjs/common");
const categorie_annonce_service_1 = require("./categorie-annonce.service");
const categorie_annonce_controller_1 = require("./categorie-annonce.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const utils_module_1 = require("../utils/utils.module");
let CategorieAnnonceModule = class CategorieAnnonceModule {
};
exports.CategorieAnnonceModule = CategorieAnnonceModule;
exports.CategorieAnnonceModule = CategorieAnnonceModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, utils_module_1.UtilsModule],
        controllers: [categorie_annonce_controller_1.CategorieAnnonceController],
        providers: [categorie_annonce_service_1.CategorieAnnonceService],
        exports: [categorie_annonce_service_1.CategorieAnnonceService],
    })
], CategorieAnnonceModule);
//# sourceMappingURL=categorie-annonce.module.js.map