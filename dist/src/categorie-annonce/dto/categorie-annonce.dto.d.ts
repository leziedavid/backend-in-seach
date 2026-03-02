export declare class CreateCategorieAnnonceDto {
    label: string;
    slug: string;
    icon?: any;
}
declare const UpdateCategorieAnnonceDto_base: import("@nestjs/common").Type<Partial<CreateCategorieAnnonceDto>>;
export declare class UpdateCategorieAnnonceDto extends UpdateCategorieAnnonceDto_base {
}
export declare class CategorieAnnonceSearchDto {
    query?: string;
    page?: string;
    limit?: string;
}
export {};
