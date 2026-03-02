import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BaseResponse } from '../common/dto/base-response.dto';

@ApiTags('Payment')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('buy-credits')
  @ApiOperation({ summary: 'Purchase credits (Mock)' })
  async buyCredits(@Request() req: any, @Body() data: { amount: number }) {
    // Here you would integrate Stripe/Paystack
    // For now, we just add the credits
    const result = await this.paymentService.addCredits(
      req.user.id,
      data.amount,
    );
    return new BaseResponse(HttpStatus.OK, 'Crédits ajoutés', result);
  }
}
