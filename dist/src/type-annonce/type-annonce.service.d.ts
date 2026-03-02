import { PrismaService } from '../prisma/prisma.service';
import { CreateTypeAnnonceDto, UpdateTypeAnnonceDto, TypeAnnonceSearchDto } from './dto/type-annonce.dto';
import { FunctionService } from '../utils/pagination.service';
export declare class TypeAnnonceService {
    private prisma;
    private functionService;
    constructor(prisma: PrismaService, functionService: FunctionService);
    create(dto: CreateTypeAnnonceDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        slug: string;
    }>;
    findAll(query: TypeAnnonceSearchDto & {
        page?: number;
        limit?: number;
    }): Promise<{
        status: boolean;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
        data: any;
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        slug: string;
    } | null>;
    update(id: string, dto: UpdateTypeAnnonceDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        slug: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        slug: string;
    }>;
    forSelect(): Promise<{
        id: string;
        label: string;
    }[]>;
}
