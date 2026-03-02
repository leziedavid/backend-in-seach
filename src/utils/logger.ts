import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { LoggerService, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MyLogger implements LoggerService {
    private logger: winston.Logger;
    private readonly logsDir: string;

    constructor() {
        try {
            const uploadDir = process.env.FILE_STORAGE_PATH
                ? path.resolve(process.env.FILE_STORAGE_PATH)
                : path.resolve(process.cwd(), 'uploads');

            this.logsDir = path.resolve(uploadDir, 'logs');

            if (!fs.existsSync(this.logsDir)) {
                fs.mkdirSync(this.logsDir, { recursive: true });
            }

            // Test de permission d'écriture
            const testFile = path.join(this.logsDir, '.write-test');
            fs.writeFileSync(testFile, 'test');
            fs.unlinkSync(testFile);

        } catch (error) {
            console.error('CRITICAL: Failed to initialize logger directory:', error);
            // Fallback to a temp directory if possible, or just log to console
            this.logsDir = path.join(process.cwd(), 'logs-fallback');
            if (!fs.existsSync(this.logsDir)) fs.mkdirSync(this.logsDir, { recursive: true });
        }

        const logFormat = winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
        );

        this.logger = winston.createLogger({
            level: 'info',
            format: logFormat,
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple(),
                    ),
                }),
                new winston.transports.DailyRotateFile({
                    dirname: this.logsDir,
                    filename: '%DATE%.json',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format: logFormat,
                }),
            ],
        });
        this.logger.info(`Logger initialized at: ${this.logsDir}`);
    }

    log(message: any, context?: string, metadata?: any) {
        this.logger.info(message, { context, ...metadata });
    }

    error(message: any, stack?: string, context?: string, metadata?: any) {
        this.logger.error(message, { stack, context, ...metadata });
    }

    warn(message: any, context?: string, metadata?: any) {
        this.logger.warn(message, { context, ...metadata });
    }

    debug(message: any, context?: string, metadata?: any) {
        this.logger.debug(message, { context, ...metadata });
    }

    verbose(message: any, context?: string, metadata?: any) {
        this.logger.verbose(message, { context, ...metadata });
    }
}

export const logger = new MyLogger();
