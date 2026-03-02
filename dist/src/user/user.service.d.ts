import { PrismaService } from '../prisma/prisma.service';
import { FunctionService } from '../utils/pagination.service';
import { MyLogger } from '../utils/logger';
export declare class UserService {
    private prisma;
    private functionService;
    private logger;
    constructor(prisma: PrismaService, functionService: FunctionService, logger: MyLogger);
    findById(id: string): Promise<{
        id: string;
        email: string;
        phone: string;
        password: string;
        fullName: string | null;
        companyName: string | null;
        role: import(".prisma/client").$Enums.Role;
        isPremium: boolean;
        credits: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    updateCredits(userId: string, amount: number): Promise<{
        id: string;
        email: string;
        phone: string;
        password: string;
        fullName: string | null;
        companyName: string | null;
        role: import(".prisma/client").$Enums.Role;
        isPremium: boolean;
        credits: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: any): Promise<{
        id: string;
        email: string;
        phone: string;
        password: string;
        fullName: string | null;
        companyName: string | null;
        role: import(".prisma/client").$Enums.Role;
        isPremium: boolean;
        credits: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(query: any): Promise<{
        status: boolean;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
        data: any;
    }>;
}
