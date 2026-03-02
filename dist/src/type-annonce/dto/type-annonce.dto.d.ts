export declare class CreateTypeAnnonceDto {
    label: string;
    slug: string;
}
declare const UpdateTypeAnnonceDto_base: import("@nestjs/common").Type<Partial<CreateTypeAnnonceDto>>;
export declare class UpdateTypeAnnonceDto extends UpdateTypeAnnonceDto_base {
}
export declare class TypeAnnonceSearchDto {
    query?: string;
}
export {};
