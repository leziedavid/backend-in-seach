import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { BaseResponse } from '../common/dto/base-response.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    forSelect(): Promise<BaseResponse<{
        id: string;
        label: string;
    }[]>>;
    findAll(query: any): Promise<BaseResponse<{
        status: boolean;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
        data: any;
    }>>;
    findOne(id: string): Promise<BaseResponse<{
        id: string;
        label: string;
        iconName: string;
    } | null>>;
    create(dto: CreateCategoryDto, file: any): Promise<BaseResponse<{
        id: string;
        label: string;
        iconName: string;
    }>>;
    update(id: string, dto: UpdateCategoryDto, file: any): Promise<BaseResponse<{
        id: string;
        label: string;
        iconName: string;
    }>>;
}
