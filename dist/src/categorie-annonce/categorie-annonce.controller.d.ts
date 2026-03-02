import { CategorieAnnonceService } from './categorie-annonce.service';
import { CreateCategorieAnnonceDto, UpdateCategorieAnnonceDto, CategorieAnnonceSearchDto } from './dto/categorie-annonce.dto';
import { BaseResponse } from '../common/dto/base-response.dto';
export declare class CategorieAnnonceController {
    private readonly categorieAnnonceService;
    constructor(categorieAnnonceService: CategorieAnnonceService);
    create(dto: CreateCategorieAnnonceDto, file: any): Promise<BaseResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        iconName: string | null;
        slug: string;
    }>>;
    findAll(query: CategorieAnnonceSearchDto): Promise<BaseResponse<{
        status: boolean;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
        data: any;
    }>>;
    forSelect(): Promise<BaseResponse<{
        id: string;
        label: string;
    }[]>>;
    findOne(id: string): Promise<BaseResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        iconName: string | null;
        slug: string;
    } | null>>;
    update(id: string, dto: UpdateCategorieAnnonceDto, file: any): Promise<BaseResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        iconName: string | null;
        slug: string;
    }>>;
    remove(id: string): Promise<BaseResponse<any>>;
}
