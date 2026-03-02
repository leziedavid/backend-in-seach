import { DbService } from './db.service';
import { BaseResponse } from '../common/dto/base-response.dto';
export declare class DbController {
    private readonly dbService;
    constructor(dbService: DbService);
    seed(): Promise<BaseResponse<{
        status: boolean;
        message: string;
        output: string;
        error: string;
    } | {
        status: boolean;
        message: string;
        error: any;
        output?: undefined;
    }>>;
}
