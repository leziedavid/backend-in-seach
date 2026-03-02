export declare class CreateSubscriptionPlanDto {
    name: string;
    price: number;
    serviceLimit: number;
    durationDays: number;
    isActive?: boolean;
}
export declare class UpdateSubscriptionPlanDto {
    name?: string;
    price?: number;
    serviceLimit?: number;
    durationDays?: number;
    isActive?: boolean;
}
