import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async analyseImage(imageUrl: string) {
    // Mocked IA Analysis
    // In real scenario, we would use OpenAI Vision or similar

    // Simulate some logic based on image "extension" or just random for demo
    const suggestions = [
      { suggestedCategory: 'Plomberie', estimatedPriceRange: '30€ - 60€' },
      { suggestedCategory: 'Électricité', estimatedPriceRange: '50€ - 120€' },
      { suggestedCategory: 'Serrurerie', estimatedPriceRange: '80€ - 150€' },
    ];

    const result = suggestions[Math.floor(Math.random() * suggestions.length)];

    return {
      ...result,
      imageUrl,
      analyzedAt: new Date(),
    };
  }
}
