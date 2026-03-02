import { SubscriptionPlanService } from './subscription-plan.service';
import { CreateSubscriptionPlanDto, UpdateSubscriptionPlanDto } from './dto/plan.dto';
import { PaginationDto } from '../utils/dto/pagination.dto';
import { BaseResponse } from '../common/dto/base-response.dto';
export declare class SubscriptionPlanController {
    private readonly planService;
    constructor(planService: SubscriptionPlanService);
    create(dto: CreateSubscriptionPlanDto): Promise<BaseResponse<{
        id: string;
        name: string;
        price: number;
        serviceLimit: number;
        durationDays: number;
        isActive: boolean;
    }>>;
    findAll(query: PaginationDto): Promise<BaseResponse<{
        status: boolean;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
        data: any;
    }>>;
    findOne(id: string): Promise<BaseResponse<{
        id: string;
        name: string;
        price: number;
        serviceLimit: number;
        durationDays: number;
        isActive: boolean;
    }>>;
    update(id: string, dto: UpdateSubscriptionPlanDto): Promise<BaseResponse<{
        id: string;
        name: string;
        price: number;
        serviceLimit: number;
        durationDays: number;
        isActive: boolean;
    }>>;
    remove(id: string): Promise<BaseResponse<{
        id: string;
        name: string;
        price: number;
        serviceLimit: number;
        durationDays: number;
        isActive: boolean;
    }>>;
}
