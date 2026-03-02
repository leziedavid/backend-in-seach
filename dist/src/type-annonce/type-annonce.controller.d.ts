import { TypeAnnonceService } from './type-annonce.service';
import { CreateTypeAnnonceDto, UpdateTypeAnnonceDto, TypeAnnonceSearchDto } from './dto/type-annonce.dto';
import { BaseResponse } from '../common/dto/base-response.dto';
export declare class TypeAnnonceController {
    private readonly typeAnnonceService;
    constructor(typeAnnonceService: TypeAnnonceService);
    create(dto: CreateTypeAnnonceDto): Promise<BaseResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        slug: string;
    }>>;
    findAll(query: TypeAnnonceSearchDto): Promise<BaseResponse<{
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
        slug: string;
    } | null>>;
    update(id: string, dto: UpdateTypeAnnonceDto): Promise<BaseResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        slug: string;
    }>>;
    remove(id: string): Promise<BaseResponse<any>>;
}
