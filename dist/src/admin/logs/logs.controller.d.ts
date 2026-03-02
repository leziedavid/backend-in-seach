import { LogsService } from './logs.service';
import { BaseResponse } from 'src/common/dto/base-response.dto';
export declare class LogsController {
    private readonly logsService;
    constructor(logsService: LogsService);
    getLogs(startDate?: string, endDate?: string, level?: string, page?: string, limit?: string): Promise<BaseResponse<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>>;
    deleteLogs(dates: string | string[]): Promise<BaseResponse<{
        message: string;
    }>>;
    getLogFiles(): Promise<BaseResponse<string[]>>;
}
