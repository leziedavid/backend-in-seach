"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const util_1 = require("util");
const path = require("path");
const execPromise = (0, util_1.promisify)(child_process_1.exec);
let DbService = class DbService {
    async seed() {
        try {
            const seedPath = path.join(process.cwd(), 'prisma', 'seed.ts');
            const { stdout, stderr } = await execPromise(`npx ts-node ${seedPath}`);
            return {
                status: true,
                message: 'Seeding completed successfully',
                output: stdout,
                error: stderr,
            };
        }
        catch (error) {
            return {
                status: false,
                message: 'Seeding failed',
                error: error.message,
            };
        }
    }
};
exports.DbService = DbService;
exports.DbService = DbService = __decorate([
    (0, common_1.Injectable)()
], DbService);
//# sourceMappingURL=db.service.js.map