import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { BaseResponse } from '../common/dto/base-response.dto';
import { SearchDto } from './dto/search.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<BaseResponse<{
        accessToken: string;
        refreshToken: string;
    }>>;
    login(dto: LoginDto): Promise<BaseResponse<{
        accessToken: string;
        refreshToken: string;
    }>>;
    reverseGeocode(lat: string, lng: string): Promise<any>;
    globalSearch(search: SearchDto): Promise<BaseResponse<{
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
    }>>;
    getMySpace(req: any, search: SearchDto): Promise<BaseResponse<{
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
    }>>;
    getUserData(userId: string, search: SearchDto): Promise<BaseResponse<{
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
    }>>;
    getMe(req: any): Promise<BaseResponse<{
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
    } | null>>;
    reconnect(id: string): Promise<BaseResponse<{
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
    }>>;
}
