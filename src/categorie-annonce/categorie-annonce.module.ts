import { Module } from '@nestjs/common';
import { CategorieAnnonceService } from './categorie-annonce.service';
import { CategorieAnnonceController } from './categorie-annonce.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [PrismaModule, UtilsModule],
  controllers: [CategorieAnnonceController],
  providers: [CategorieAnnonceService],
  exports: [CategorieAnnonceService],
})
export class CategorieAnnonceModule {}
