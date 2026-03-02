import { OnModuleInit } from '@nestjs/common';
import { ServiceService } from '../service/service.service';
export declare class SearchServiceIaService implements OnModuleInit {
    private readonly serviceService;
    private model;
    private readonly CONFIDENCE_THRESHOLD;
    constructor(serviceService: ServiceService);
    onModuleInit(): Promise<void>;
    private readonly SERVICE_MAP;
    private interpretIntention;
    private searchWithFallback;
    searchByImage(file: Express.Multer.File): Promise<{
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
    }>;
}
