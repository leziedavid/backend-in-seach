export declare class DbService {
    seed(): Promise<{
        status: boolean;
        message: string;
        output: string;
        error: string;
    } | {
        status: boolean;
        message: string;
        error: any;
        output?: undefined;
    }>;
}
