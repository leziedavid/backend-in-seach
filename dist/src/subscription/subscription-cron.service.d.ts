import { PrismaService } from '../prisma/prisma.service';
export declare class SubscriptionCronService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleSubscriptionExpiration(): Promise<void>;
}
