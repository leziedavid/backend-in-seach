import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { SearchDto } from './dto/search.dto';
import { ConfigService } from '@nestjs/config';
import { FunctionService } from '../utils/pagination.service';
import { LocalStorageService } from '../utils/LocalStorageService';
import { GlobalDataMapper } from '../utils/mapper';
import { MyLogger } from '../utils/logger';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private functionService;
    private localStorageService;
    private mapper;
    private logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, functionService: FunctionService, localStorageService: LocalStorageService, mapper: GlobalDataMapper, logger: MyLogger);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getTokens(userId: string, email: string, role: string, fullName: string | null, phone: string | null): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getMe(userId: string): Promise<{
        id: any;
        email: any;
        phone: any;
        fullName: any;
        companyName: any;
        role: any;
        isPremium: any;
        credits: any;
        subscription: {
            id: any;
            plan: {
                id: any;
                name: any;
                price: any;
                serviceLimit: any;
                durationDays: any;
                isActive: any;
            } | null;
            startDate: any;
            endDate: any;
            status: any;
        } | null;
        createdAt: any;
        updatedAt: any;
    } | null>;
    reconnect(userId: string): Promise<{
        user: {
            id: any;
            email: any;
            phone: any;
            fullName: any;
            companyName: any;
            role: any;
            isPremium: any;
            credits: any;
            subscription: {
                id: any;
                plan: {
                    id: any;
                    name: any;
                    price: any;
                    serviceLimit: any;
                    durationDays: any;
                    isActive: any;
                } | null;
                startDate: any;
                endDate: any;
                status: any;
            } | null;
            createdAt: any;
            updatedAt: any;
        } | null;
        accessToken: string;
        refreshToken: string;
    }>;
    reverseGeocode(lat: number, lon: number): Promise<any>;
    getGlobalDataByUserId(userId: string, search: SearchDto): Promise<{
        user: {
            id: any;
            email: any;
            phone: any;
            fullName: any;
            companyName: any;
            role: any;
            isPremium: any;
            credits: any;
            subscription: {
                id: any;
                plan: {
                    id: any;
                    name: any;
                    price: any;
                    serviceLimit: any;
                    durationDays: any;
                    isActive: any;
                } | null;
                startDate: any;
                endDate: any;
                status: any;
            } | null;
            createdAt: any;
            updatedAt: any;
        } | null;
        services: any[];
        annonces: any[];
        bookings: any[];
        history: any[];
        totalGain: number;
        page: number;
        limit: number;
        total: any;
        totalPages: number;
    }>;
    getGlobalDataBySearch(search: SearchDto): Promise<{
        services: any[];
        annonces: any[];
        bookings: any[];
        stats: {
            totalServices: number;
            totalAnnonces: number;
            totalActiveBookings: number;
            totalUsers: number;
            totalPrestataires: number;
        };
        searchParams: {
            lat: number | undefined;
            lng: number | undefined;
            radiusKm: number;
            query: string | undefined;
        };
        page: number;
        limit: number;
        total: any;
        totalPages: number;
    }>;
}
