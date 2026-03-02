import { AiService } from './ai.service';
import { BaseResponse } from '../common/dto/base-response.dto';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    analyseImage(imageUrl: string): Promise<BaseResponse<{
        imageUrl: string;
        analyzedAt: Date;
        suggestedCategory: string;
        estimatedPriceRange: string;
    }>>;
}
