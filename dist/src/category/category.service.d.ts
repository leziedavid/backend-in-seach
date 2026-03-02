import { PrismaService } from '../prisma/prisma.service';
import { FunctionService } from '../utils/pagination.service';
import { LocalStorageService } from '../utils/LocalStorageService';
export declare class CategoryService {
    private prisma;
    private functionService;
    private localStorageService;
    constructor(prisma: PrismaService, functionService: FunctionService, localStorageService: LocalStorageService);
    forSelect(): Promise<{
        id: string;
        label: string;
    }[]>;
    findAll(query: any): Promise<{
        status: boolean;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
        data: any;
    }>;
    findOne(id: string): Promise<{
        id: string;
        label: string;
        iconName: string;
    } | null>;
    create(data: {
        label: string;
        iconFile?: Buffer;
    }): Promise<{
        id: string;
        label: string;
        iconName: string;
    }>;
    update(id: string, data: {
        label?: string;
        iconFile?: Buffer;
    }): Promise<{
        id: string;
        label: string;
        iconName: string;
    }>;
}
