import { Role } from '@prisma/client';
export declare class RegisterDto {
    email: string;
    phone: string;
    password: string;
    role?: Role;
}
export declare class LoginDto {
    identifier: string;
    password: string;
}
