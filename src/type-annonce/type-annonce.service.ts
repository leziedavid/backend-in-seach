import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTypeAnnonceDto,
  UpdateTypeAnnonceDto,
  TypeAnnonceSearchDto,
} from './dto/type-annonce.dto';
import { FunctionService } from '../utils/pagination.service';

@Injectable()
export class TypeAnnonceService {
  constructor(
    private prisma: PrismaService,
    private functionService: FunctionService,
  ) {}

  async create(dto: CreateTypeAnnonceDto) {
    return this.prisma.typeAnnonce.create({
      data: dto,
    });
  }

  async findAll(
    query: TypeAnnonceSearchDto & { page?: number; limit?: number },
  ) {
    const conditions: any = {};
    if (query.query) {
      conditions.label = { contains: query.query, mode: 'insensitive' };
    }

    return this.functionService.paginate({
      model: 'typeAnnonce',
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      conditions,
      orderBy: { label: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.typeAnnonce.findUnique({
      where: { id },
    });
  }

  async update(id: string, dto: UpdateTypeAnnonceDto) {
    return this.prisma.typeAnnonce.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.typeAnnonce.delete({
      where: { id },
    });
  }

  async forSelect() {
    return this.prisma.typeAnnonce.findMany({
      select: { id: true, label: true },
    });
  }
}
