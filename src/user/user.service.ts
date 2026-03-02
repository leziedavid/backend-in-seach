import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FunctionService } from '../utils/pagination.service';
import { MyLogger } from '../utils/logger';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private functionService: FunctionService,
    private logger: MyLogger,
  ) { }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      omit: { password: true } as any,
    });
  }

  async updateCredits(userId: string, amount: number) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          increment: amount,
        },
      },
    });
    this.logger.log(`User credits updated: ${userId} by ${amount}. New total: ${user.credits}`, 'UserService');
    return user;
  }

  async update(id: string, dto: any) {
    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
      omit: { password: true } as any,
    });
    this.logger.log(`User profile updated: ${id}`, 'UserService');
    return user;
  }

  async findAll(query: any) {
    return this.functionService.paginate({
      model: 'user',
      page: query.page,
      limit: query.limit,
      conditions: {},
      orderBy: { createdAt: 'desc' },
      selectAndInclude: {
        omit: { password: true } as any,
      },
    });
  }
}
