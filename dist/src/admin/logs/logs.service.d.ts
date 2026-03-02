export declare class LogsService {
    private readonly logsDir;
    private readonly logger;
    constructor();
    getLogs(startDate?: string, endDate?: string, level?: string, page?: number, limit?: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    deleteLogs(dates: string[]): Promise<{
        message: string;
    }>;
    handleCron(): void;
    getLogFiles(): Promise<string[]>;
}
