import { Controller, Post, Body, UseGuards, HttpStatus } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BaseResponse } from '../common/dto/base-response.dto';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('analyse-image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Analyze an image to suggest category and price' })
  async analyseImage(@Body('imageUrl') imageUrl: string) {
    const result = await this.aiService.analyseImage(imageUrl);
    return new BaseResponse(HttpStatus.OK, 'Analyse effectuée', result);
  }
}
