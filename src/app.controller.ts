import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { BaseResponse } from './common/dto/base-response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): BaseResponse<string> {
    const result = this.appService.getHello();
    return new BaseResponse(HttpStatus.OK, 'API Root', result);
  }
}
