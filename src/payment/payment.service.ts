import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async addCredits(userId: string, amount: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          increment: amount,
        },
      },
    });
  }

  async deductCredits(userId: string, amount: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.credits < amount) {
      throw new BadRequestException('Insufficient credits');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          decrement: amount,
        },
      },
    });
  }

  // Mock payment intent
  async createPaymentIntent(amount: number) {
    return {
      id: `pi_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      status: 'succeeded',
    };
  }
}
