import { Module, Global } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ServiceModule } from './service/service.module';
import { BookingModule } from './booking/booking.module';
import { AiModule } from './ai/ai.module';
import { CategoryModule } from './category/category.module';
import { PaymentModule } from './payment/payment.module';
import { UtilsModule } from './utils/utils.module';
import { DbModule } from './db/db.module';
import { TypeAnnonceModule } from './type-annonce/type-annonce.module';
import { CategorieAnnonceModule } from './categorie-annonce/categorie-annonce.module';
import { AnnonceModule } from './annonce/annonce.module';
import { SearchServiceIaModule } from './search-service-ia/search-service-ia.module';
import { AdminModule } from './admin/admin.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    SubscriptionModule,
    ServiceModule,
    BookingModule,
    AiModule,
    CategoryModule,
    PaymentModule,
    UtilsModule,
    DbModule,
    TypeAnnonceModule,
    CategorieAnnonceModule,
    AnnonceModule,
    SearchServiceIaModule,
    AdminModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 1000,
    }]),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
