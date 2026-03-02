import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class LogsService {
    private readonly logsDir: string;
    private readonly logger = new Logger(LogsService.name);

    constructor() {
        const uploadDir = process.env.FILE_STORAGE_PATH
            ? path.resolve(process.env.FILE_STORAGE_PATH)
            : path.resolve(process.cwd(), 'uploads');
        this.logsDir = path.resolve(uploadDir, 'logs');
    }

    async getLogs(startDate?: string, endDate?: string, level?: string, page: number = 1, limit: number = 10) {
        let allLogs: any[] = [];
        const files = fs.readdirSync(this.logsDir).filter(f => f.endsWith('.json'));

        for (const file of files) {
            const fileDate = file.replace('.json', '');

            // Apply date range filter on filename first for performance
            if (startDate && fileDate < startDate) continue;
            if (endDate && fileDate > endDate) continue;

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
                } catch (e) {
                    // Skip invalid JSON lines
                }
            }
        }

        // Sort by timestamp descending
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

    async deleteLogs(dates: string[]) {
        for (const date of dates) {
            const filePath = path.join(this.logsDir, `${date}.json`);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        return { message: `${dates.length} log files deleted` };
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
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
        if (!fs.existsSync(this.logsDir)) return [];
        return fs.readdirSync(this.logsDir)
            .filter(f => f.endsWith('.json'))
            .map(f => f.replace('.json', ''))
            .sort((a, b) => b.localeCompare(a));
    }
}
