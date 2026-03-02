import { PrismaService } from '../prisma/prisma.service';
import { FunctionService } from '../utils/pagination.service';
import { LocalStorageService } from '../utils/LocalStorageService';
import { CreateCategorieAnnonceDto, UpdateCategorieAnnonceDto, CategorieAnnonceSearchDto } from './dto/categorie-annonce.dto';
export declare class CategorieAnnonceService {
    private prisma;
    private functionService;
    private localStorageService;
    constructor(prisma: PrismaService, functionService: FunctionService, localStorageService: LocalStorageService);
    forSelect(): Promise<{
        id: string;
        label: string;
    }[]>;
    findAll(query: CategorieAnnonceSearchDto): Promise<{
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
        iconName: string | null;
        slug: string;
    } | null>;
    create(dto: CreateCategorieAnnonceDto, file?: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        iconName: string | null;
        slug: string;
    }>;
    update(id: string, dto: UpdateCategorieAnnonceDto, file?: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        iconName: string | null;
        slug: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        iconName: string | null;
        slug: string;
    }>;
}
