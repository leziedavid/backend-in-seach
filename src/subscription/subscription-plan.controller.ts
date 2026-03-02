import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { SubscriptionPlanService } from './subscription-plan.service';
import {
  CreateSubscriptionPlanDto,
  UpdateSubscriptionPlanDto,
} from './dto/plan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaginationDto } from '../utils/dto/pagination.dto';
import { BaseResponse } from '../common/dto/base-response.dto';

@ApiTags('Admin - Subscription Plans')
@Controller('admin/subscription-plans')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth('access-token')
export class SubscriptionPlanController {
  constructor(private readonly planService: SubscriptionPlanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new subscription plan' })
  async create(@Body() dto: CreateSubscriptionPlanDto) {
    const result = await this.planService.create(dto);
    return new BaseResponse(HttpStatus.CREATED, 'Plan créé', result);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subscription plans' })
  async findAll(@Query() query: PaginationDto) {
    const result = await this.planService.findAll(query);
    return new BaseResponse(HttpStatus.OK, 'Plans récupérés', result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subscription plan by ID' })
  async findOne(@Param('id') id: string) {
    const result = await this.planService.findOne(id);
    return new BaseResponse(HttpStatus.OK, 'Plan récupéré', result);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subscription plan' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionPlanDto,
  ) {
    const result = await this.planService.update(id, dto);
    return new BaseResponse(HttpStatus.OK, 'Plan mis à jour', result);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subscription plan' })
  async remove(@Param('id') id: string) {
    const result = await this.planService.remove(id);
    return new BaseResponse(HttpStatus.OK, 'Plan supprimé', result);
  }
}
