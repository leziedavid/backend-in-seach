import { PrismaService } from '../prisma/prisma.service';
export declare class PaymentService {
    private prisma;
    constructor(prisma: PrismaService);
    addCredits(userId: string, amount: number): Promise<{
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
    }>;
    deductCredits(userId: string, amount: number): Promise<{
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
    }>;
    createPaymentIntent(amount: number): Promise<{
        id: string;
        amount: number;
        status: string;
    }>;
}
