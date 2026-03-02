import { SearchServiceIaService } from './search-service-ia.service';
import { BaseResponse } from '../common/dto/base-response.dto';
export declare class SearchServiceIaController {
    private readonly searchServiceIaService;
    constructor(searchServiceIaService: SearchServiceIaService);
    searchByImage(file: Express.Multer.File): Promise<BaseResponse<{
        data: never[];
        isFallback: boolean;
        message: string;
        predictions: {
            className: string;
            probability: number;
        }[];
    } | {
        predictions: {
            className: string;
            probability: number;
        }[];
        intention: string;
        message: string;
        data: any;
        isFallback: boolean;
    } | {
        predictions: {
            className: string;
            probability: number;
        }[];
        intention: string;
        message: string;
        data: never[];
        isFallback?: undefined;
    }>>;
}
