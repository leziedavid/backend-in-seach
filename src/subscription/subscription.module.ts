import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionCronService } from './subscription-cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { SubscriptionPlanService } from './subscription-plan.service';
import { SubscriptionPlanController } from './subscription-plan.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [SubscriptionController, SubscriptionPlanController],
  providers: [
    SubscriptionService,
    SubscriptionCronService,
    SubscriptionPlanService,
  ],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
