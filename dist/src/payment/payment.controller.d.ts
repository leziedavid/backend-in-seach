import { PaymentService } from './payment.service';
import { BaseResponse } from '../common/dto/base-response.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    buyCredits(req: any, data: {
        amount: number;
    }): Promise<BaseResponse<{
        id: string;
        email: string;
        phone: string;
        password: string;
        fullName: string | null;
        companyName: string | null;
        role: import(".prisma/client").$Enums.Role;
        isPremium: boolean;
        credits: number;
        createdAt: Date;
        updatedAt: Date;
    }>>;
}
