import { AppService } from './app.service';
import { BaseResponse } from './common/dto/base-response.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): BaseResponse<string>;
}
