import { ServiceType, ServiceStatus } from '@prisma/client';
export declare class CreateServiceDto {
    title: string;
    description: string;
    type: ServiceType;
    status?: ServiceStatus;
    frais?: number;
    price?: number;
    reduction?: number;
    tags?: string[];
    location?: object;
    latitude: number;
    longitude: number;
    images?: Express.Multer.File[];
    existingImageUrls?: string[];
    categoryId: string;
}
declare const UpdateServiceDto_base: import("@nestjs/common").Type<Partial<CreateServiceDto>>;
export declare class UpdateServiceDto extends UpdateServiceDto_base {
}
export declare class ServiceSearchDto {
    lat?: number;
    lng?: number;
    radiusKm?: number;
    query?: string;
    categoryId?: string;
    page?: number;
    limit?: number;
}
export {};
