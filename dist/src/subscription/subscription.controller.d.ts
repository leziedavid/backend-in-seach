import { SubscriptionService } from './subscription.service';
import { PaginationDto } from '../utils/dto/pagination.dto';
import { SubscribeDto, UpdateSubscriptionDto } from './dto/subscription.dto';
import { BaseResponse } from '../common/dto/base-response.dto';
export declare class SubscriptionController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    getPlans(query: PaginationDto): Promise<BaseResponse<{
        status: boolean;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
        data: any;
    }>>;
    subscribe(req: any, dto: SubscribeDto): Promise<BaseResponse<{
        id: string;
        startDate: Date;
        endDate: Date;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        planId: string;
        userId: string;
    }>>;
    updateSubscription(userId: string, dto: UpdateSubscriptionDto): Promise<BaseResponse<{
        id: string;
        startDate: Date;
        endDate: Date;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        planId: string;
        userId: string;
    }>>;
    getMySubscription(req: any): Promise<BaseResponse<boolean>>;
}
