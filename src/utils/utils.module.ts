import { Module, Global } from '@nestjs/common';
import { LocalStorageService } from './LocalStorageService';
import { FunctionService } from './pagination.service';
import { GlobalDataMapper } from './mapper';
import { MyLogger } from './logger';

@Global()
@Module({
  providers: [LocalStorageService, FunctionService, GlobalDataMapper, MyLogger],
  exports: [LocalStorageService, FunctionService, GlobalDataMapper, MyLogger],
})
export class UtilsModule { }
