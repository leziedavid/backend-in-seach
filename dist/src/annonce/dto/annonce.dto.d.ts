import { AnnonceStatus } from '@prisma/client';
export declare class CreateAnnonceDto {
    title: string;
    description: string;
    companyName?: string;
    status?: AnnonceStatus;
    price?: number;
    latitude: number;
    longitude: number;
    startDate?: string;
    endDate?: string;
    typeId: string;
    categorieId: string;
    options?: string[];
    files?: any[];
}
declare const UpdateAnnonceDto_base: import("@nestjs/common").Type<Partial<CreateAnnonceDto>>;
export declare class UpdateAnnonceDto extends UpdateAnnonceDto_base {
}
export declare class AnnonceSearchDto {
    lat?: number;
    lng?: number;
    radiusKm?: number;
    query?: string;
    typeId?: string;
    categorieId?: string;
    page?: number;
    limit?: number;
}
export {};
