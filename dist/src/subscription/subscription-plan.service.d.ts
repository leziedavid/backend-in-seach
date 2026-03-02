import { PrismaService } from '../prisma/prisma.service';
import { FunctionService } from '../utils/pagination.service';
import { CreateSubscriptionPlanDto, UpdateSubscriptionPlanDto } from './dto/plan.dto';
export declare class SubscriptionPlanService {
    private prisma;
    private functionService;
    constructor(prisma: PrismaService, functionService: FunctionService);
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
        name: string;
        price: number;
        serviceLimit: number;
        durationDays: number;
        isActive: boolean;
    }>;
    create(dto: CreateSubscriptionPlanDto): Promise<{
        id: string;
        name: string;
        price: number;
        serviceLimit: number;
        durationDays: number;
        isActive: boolean;
    }>;
    update(id: string, dto: UpdateSubscriptionPlanDto): Promise<{
        id: string;
        name: string;
        price: number;
        serviceLimit: number;
        durationDays: number;
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        price: number;
        serviceLimit: number;
        durationDays: number;
        isActive: boolean;
    }>;
}
