import {
  Controller,
  Get,
  UseGuards,
  Req,
  Query,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaginationDto } from '../utils/dto/pagination.dto';
import { SubscribeDto, UpdateSubscriptionDto } from './dto/subscription.dto';
import { BaseResponse } from '../common/dto/base-response.dto';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get all active subscription plans' })
  async getPlans(@Query() query: PaginationDto) {
    const result = await this.subscriptionService.getAllPlans(query);
    return new BaseResponse(HttpStatus.OK, 'Plans récupérés', result);
  }

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Subscribe to a plan' })
  async subscribe(@Req() req: any, @Body() dto: SubscribeDto) {
    const result = await this.subscriptionService.subscribe(
      req.user.id,
      dto.planId,
    );
    return new BaseResponse(HttpStatus.CREATED, 'Abonnement réussi', result);
  }

  @Patch(':userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update user subscription (Admin only)' })
  async updateSubscription(
    @Param('userId') userId: string,
    @Body() dto: UpdateSubscriptionDto,
  ) {
    const result = await this.subscriptionService.updateSubscription(
      userId,
      dto,
    );
    return new BaseResponse(HttpStatus.OK, 'Abonnement mis à jour', result);
  }

  @Get('my-subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current user subscription' })
  async getMySubscription(@Req() req: any) {
    const result = await this.subscriptionService.checkServiceLimit(
      req.user.id,
    );
    return new BaseResponse(
      HttpStatus.OK,
      "Status de l'abonnement récupéré",
      result,
    );
  }
}
