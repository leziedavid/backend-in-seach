import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SearchServiceIaService } from './search-service-ia.service';
import { BaseResponse } from '../common/dto/base-response.dto';

@Controller('search-service-ia')
export class SearchServiceIaController {
  constructor(
    private readonly searchServiceIaService: SearchServiceIaService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async searchByImage(@UploadedFile() file: Express.Multer.File) {
    const result = await this.searchServiceIaService.searchByImage(file);
    const status =
      result.data && result.data.length > 0 ? HttpStatus.OK : HttpStatus.OK; // Non 404 car l'analyse a réussi
    return new BaseResponse(
      status,
      result.message || 'Recherche IA effectuée',
      result,
    );
  }
}
