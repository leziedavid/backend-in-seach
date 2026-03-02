import { Module } from '@nestjs/common';
import { AnnonceService } from './annonce.service';
import { AnnonceController } from './annonce.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [PrismaModule, UtilsModule],
  controllers: [AnnonceController],
  providers: [AnnonceService],
  exports: [AnnonceService],
})
export class AnnonceModule {}
