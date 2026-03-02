export declare class AiService {
    analyseImage(imageUrl: string): Promise<{
        imageUrl: string;
        analyzedAt: Date;
        suggestedCategory: string;
        estimatedPriceRange: string;
    }>;
}
