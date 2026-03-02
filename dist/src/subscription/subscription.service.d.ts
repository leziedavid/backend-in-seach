import { PrismaService } from '../prisma/prisma.service';
import { FunctionService } from '../utils/pagination.service';
export declare class SubscriptionService {
    private prisma;
    private functionService;
    constructor(prisma: PrismaService, functionService: FunctionService);
    checkServiceLimit(userId: string): Promise<boolean>;
    getAllPlans(query: any): Promise<{
        status: boolean;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
        data: any;
    }>;
    subscribe(userId: string, planId: string): Promise<{
        id: string;
        startDate: Date;
        endDate: Date;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        planId: string;
        userId: string;
    }>;
    updateSubscription(userId: string, dto: any): Promise<{
        id: string;
        startDate: Date;
        endDate: Date;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        planId: string;
        userId: string;
    }>;
}
