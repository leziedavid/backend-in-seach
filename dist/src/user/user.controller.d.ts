import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
import { BaseResponse } from '../common/dto/base-response.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(req: any): Promise<BaseResponse<{
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
    } | null>>;
    updateProfile(req: any, dto: UpdateUserDto): Promise<BaseResponse<{
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
    findAll(query: any): Promise<BaseResponse<{
        status: boolean;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
        data: any;
    }>>;
    update(id: string, dto: UpdateUserDto): Promise<BaseResponse<{
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
