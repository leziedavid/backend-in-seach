export declare class BaseResponse<T = any> {
    statusCode: number;
    message: string;
    data?: T;
    constructor(statusCode: number, message: string, data?: T);
}
