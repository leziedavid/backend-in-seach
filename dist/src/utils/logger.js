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
exports.logger = exports.MyLogger = void 0;
const winston = require("winston");
require("winston-daily-rotate-file");
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
let MyLogger = class MyLogger {
    logger;
    logsDir;
    constructor() {
        try {
            const uploadDir = process.env.FILE_STORAGE_PATH
                ? path.resolve(process.env.FILE_STORAGE_PATH)
                : path.resolve(process.cwd(), 'uploads');
            this.logsDir = path.resolve(uploadDir, 'logs');
            if (!fs.existsSync(this.logsDir)) {
                fs.mkdirSync(this.logsDir, { recursive: true });
            }
            const testFile = path.join(this.logsDir, '.write-test');
            fs.writeFileSync(testFile, 'test');
            fs.unlinkSync(testFile);
        }
        catch (error) {
            console.error('CRITICAL: Failed to initialize logger directory:', error);
            this.logsDir = path.join(process.cwd(), 'logs-fallback');
            if (!fs.existsSync(this.logsDir))
                fs.mkdirSync(this.logsDir, { recursive: true });
        }
        const logFormat = winston.format.combine(winston.format.timestamp(), winston.format.json());
        this.logger = winston.createLogger({
            level: 'info',
            format: logFormat,
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
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
    log(message, context, metadata) {
        this.logger.info(message, { context, ...metadata });
    }
    error(message, stack, context, metadata) {
        this.logger.error(message, { stack, context, ...metadata });
    }
    warn(message, context, metadata) {
        this.logger.warn(message, { context, ...metadata });
    }
    debug(message, context, metadata) {
        this.logger.debug(message, { context, ...metadata });
    }
    verbose(message, context, metadata) {
        this.logger.verbose(message, { context, ...metadata });
    }
};
exports.MyLogger = MyLogger;
exports.MyLogger = MyLogger = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MyLogger);
exports.logger = new MyLogger();
//# sourceMappingURL=logger.js.map