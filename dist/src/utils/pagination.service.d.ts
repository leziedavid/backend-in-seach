import { PrismaService } from '../prisma/prisma.service';
export interface PaginateOptions {
    model: string;
    page?: number;
    limit?: number;
    conditions?: any;
    orderBy?: any;
    selectAndInclude?: any;
    fileTypeListes?: string[];
}
export declare class FunctionService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private enrichWithFiles;
    paginate(options: PaginateOptions): Promise<{
        status: boolean;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
        data: any;
    }>;
}
