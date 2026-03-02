import { SubscriptionStatus } from '@prisma/client';
export declare class SubscribeDto {
    planId: string;
}
export declare class UpdateSubscriptionDto {
    status?: SubscriptionStatus;
    endDate?: string;
}
