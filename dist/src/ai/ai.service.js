"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
let AiService = class AiService {
    async analyseImage(imageUrl) {
        const suggestions = [
            { suggestedCategory: 'Plomberie', estimatedPriceRange: '30€ - 60€' },
            { suggestedCategory: 'Électricité', estimatedPriceRange: '50€ - 120€' },
            { suggestedCategory: 'Serrurerie', estimatedPriceRange: '80€ - 150€' },
        ];
        const result = suggestions[Math.floor(Math.random() * suggestions.length)];
        return {
            ...result,
            imageUrl,
            analyzedAt: new Date(),
        };
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)()
], AiService);
//# sourceMappingURL=ai.service.js.map