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
var LogsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const schedule_1 = require("@nestjs/schedule");
let LogsService = LogsService_1 = class LogsService {
    logsDir;
    logger = new common_1.Logger(LogsService_1.name);
    constructor() {
        const uploadDir = process.env.FILE_STORAGE_PATH
            ? path.resolve(process.env.FILE_STORAGE_PATH)
            : path.resolve(process.cwd(), 'uploads');
        this.logsDir = path.resolve(uploadDir, 'logs');
    }
    async getLogs(startDate, endDate, level, page = 1, limit = 10) {
        let allLogs = [];
        const files = fs.readdirSync(this.logsDir).filter(f => f.endsWith('.json'));
        for (const file of files) {
            const fileDate = file.replace('.json', '');
            if (startDate && fileDate < startDate)
                continue;
            if (endDate && fileDate > endDate)
                continue;
            const filePath = path.join(this.logsDir, file);
            const fileStream = fs.createReadStream(filePath);
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity,
            });
            for await (const line of rl) {
                try {
                    const log = JSON.parse(line);
                    if (level && log.level.toLowerCase() !== level.toLowerCase()) {
                        continue;
                    }
                    allLogs.push(log);
                }
                catch (e) {
                }
            }
        }
        allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        const total = allLogs.length;
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedLogs = allLogs.slice(start, end);
        return {
            data: paginatedLogs,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async deleteLogs(dates) {
        for (const date of dates) {
            const filePath = path.join(this.logsDir, `${date}.json`);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        return { message: `${dates.length} log files deleted` };
    }
    handleCron() {
        this.logger.log('Running automatic log cleanup...');
        const files = fs.readdirSync(this.logsDir).filter(f => f.endsWith('.json'));
        const now = new Date();
        const twoDaysAgo = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000));
        const limitDate = twoDaysAgo.toISOString().split('T')[0];
        let deletedCount = 0;
        files.forEach(file => {
            const fileDate = file.replace('.json', '');
            if (fileDate < limitDate) {
                fs.unlinkSync(path.join(this.logsDir, file));
                deletedCount++;
            }
        });
        if (deletedCount > 0) {
            this.logger.log(`Deleted ${deletedCount} log files older than 2 days.`);
        }
    }
    async getLogFiles() {
        if (!fs.existsSync(this.logsDir))
            return [];
        return fs.readdirSync(this.logsDir)
            .filter(f => f.endsWith('.json'))
            .map(f => f.replace('.json', ''))
            .sort((a, b) => b.localeCompare(a));
    }
};
exports.LogsService = LogsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LogsService.prototype, "handleCron", null);
exports.LogsService = LogsService = LogsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LogsService);
//# sourceMappingURL=logs.service.js.map