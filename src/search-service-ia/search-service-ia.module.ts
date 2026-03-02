import { Module } from '@nestjs/common';
import { SearchServiceIaController } from './search-service-ia.controller';
import { SearchServiceIaService } from './search-service-ia.service';
import { ServiceModule } from '../service/service.module';

@Module({
  imports: [ServiceModule],
  controllers: [SearchServiceIaController],
  providers: [SearchServiceIaService],
})
export class SearchServiceIaModule {}
