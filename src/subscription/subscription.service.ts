import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';
import { FunctionService } from '../utils/pagination.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private prisma: PrismaService,
    private functionService: FunctionService,
  ) {}

  async checkServiceLimit(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: {
          include: { plan: true },
        },
        _count: {
          select: { services: true },
        },
      },
    });

    if (!user) throw new Error('User not found');

    // If premium is true or has active premium subscription, ignore limits
    if (user.isPremium) return true;

    if (
      user.subscription &&
      user.subscription.status === SubscriptionStatus.ACTIVE
    ) {
      if (new Date() < user.subscription.endDate) {
        // Active subscription logic
        if (user.subscription.plan.serviceLimit === 999999) return true;

        if (user._count.services >= user.subscription.plan.serviceLimit) {
          throw new ForbiddenException(
            'Limite atteinte. Passez au plan Premium.',
          );
        }
        return true;
      }
    }

    // Default FREE limit (5 services) from the requirements
    const freePlanLimit = 5;
    if (user._count.services >= freePlanLimit) {
      throw new ForbiddenException('Limite atteinte. Passez au plan Premium.');
    }

    return true;
  }

  async getAllPlans(query: any) {
    return this.functionService.paginate({
      model: 'subscriptionPlan',
      page: query.page,
      limit: query.limit,
      conditions: { isActive: true },
      orderBy: { price: 'asc' },
    });
  }

  async subscribe(userId: string, planId: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) throw new Error('Plan not found');

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    return this.prisma.subscription.upsert({
      where: { userId },
      update: {
        planId,
        status: SubscriptionStatus.ACTIVE,
        startDate: new Date(),
        endDate,
      },
      create: {
        userId,
        planId,
        status: SubscriptionStatus.ACTIVE,
        startDate: new Date(),
        endDate,
      },
    });
  }

  async updateSubscription(userId: string, dto: any) {
    return this.prisma.subscription.update({
      where: { userId },
      data: dto,
    });
  }
}
