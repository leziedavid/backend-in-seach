"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchServiceIaModule = void 0;
const common_1 = require("@nestjs/common");
const search_service_ia_controller_1 = require("./search-service-ia.controller");
const search_service_ia_service_1 = require("./search-service-ia.service");
const service_module_1 = require("../service/service.module");
let SearchServiceIaModule = class SearchServiceIaModule {
};
exports.SearchServiceIaModule = SearchServiceIaModule;
exports.SearchServiceIaModule = SearchServiceIaModule = __decorate([
    (0, common_1.Module)({
        imports: [service_module_1.ServiceModule],
        controllers: [search_service_ia_controller_1.SearchServiceIaController],
        providers: [search_service_ia_service_1.SearchServiceIaService],
    })
], SearchServiceIaModule);
//# sourceMappingURL=search-service-ia.module.js.map