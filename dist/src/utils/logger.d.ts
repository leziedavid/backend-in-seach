import 'winston-daily-rotate-file';
import { LoggerService } from '@nestjs/common';
export declare class MyLogger implements LoggerService {
    private logger;
    private readonly logsDir;
    constructor();
    log(message: any, context?: string, metadata?: any): void;
    error(message: any, stack?: string, context?: string, metadata?: any): void;
    warn(message: any, context?: string, metadata?: any): void;
    debug(message: any, context?: string, metadata?: any): void;
    verbose(message: any, context?: string, metadata?: any): void;
}
export declare const logger: MyLogger;
