import { Module } from '@nestjs/common';
import { TypeAnnonceService } from './type-annonce.service';
import { TypeAnnonceController } from './type-annonce.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [PrismaModule, UtilsModule],
  controllers: [TypeAnnonceController],
  providers: [TypeAnnonceService],
  exports: [TypeAnnonceService],
})
export class TypeAnnonceModule {}
