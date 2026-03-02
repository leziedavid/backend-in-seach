"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsModule = void 0;
const common_1 = require("@nestjs/common");
const LocalStorageService_1 = require("./LocalStorageService");
const pagination_service_1 = require("./pagination.service");
const mapper_1 = require("./mapper");
const logger_1 = require("./logger");
let UtilsModule = class UtilsModule {
};
exports.UtilsModule = UtilsModule;
exports.UtilsModule = UtilsModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [LocalStorageService_1.LocalStorageService, pagination_service_1.FunctionService, mapper_1.GlobalDataMapper, logger_1.MyLogger],
        exports: [LocalStorageService_1.LocalStorageService, pagination_service_1.FunctionService, mapper_1.GlobalDataMapper, logger_1.MyLogger],
    })
], UtilsModule);
//# sourceMappingURL=utils.module.js.map