import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/chat.dto';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    private _formatConversation;
    getOrCreateConversation(participant1Id: string, participant2Id: string, bookingId?: string): Promise<{
        id: any;
        bookingId: any;
        otherParticipant: any;
        lastMessage: any;
        unreadCount: any;
        updatedAt: any;
    }>;
    saveMessage(senderId: string, dto: CreateMessageDto): Promise<{
        id: string;
        createdAt: Date;
        conversationId: string;
        senderId: string;
        content: string | null;
        fileUrl: string | null;
        fileType: string | null;
        fileName: string | null;
        status: import(".prisma/client").$Enums.MessageStatus;
    }>;
    getMessages(conversationId: string, page?: number, limit?: number): Promise<{
        id: string;
        createdAt: Date;
        conversationId: string;
        senderId: string;
        content: string | null;
        fileUrl: string | null;
        fileType: string | null;
        fileName: string | null;
        status: import(".prisma/client").$Enums.MessageStatus;
    }[]>;
    verifyBookingCode(code: string): Promise<{
        client: {
            id: string;
            fullName: string | null;
        };
        provider: {
            id: string;
            fullName: string | null;
        };
        service: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ServiceStatus;
            code: string;
            price: number | null;
            description: string;
            title: string;
            type: import(".prisma/client").$Enums.ServiceType;
            frais: number | null;
            reduction: number | null;
            tags: string[];
            location: import("@prisma/client/runtime/library").JsonValue | null;
            latitude: number | null;
            longitude: number | null;
            imageUrls: string[];
            userId: string;
            categoryId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        code: string;
        userQrCode: string | null;
        prestaQrCode: string | null;
        clientId: string;
        providerId: string;
        serviceId: string;
        price: number | null;
        rating: number | null;
        comment: string | null;
        interventionType: import(".prisma/client").$Enums.InterventionType;
        scheduledDate: Date | null;
        scheduledTime: string | null;
        description: string | null;
        userQrScanned: boolean;
        prestaQrScanned: boolean;
    }>;
    findUserByRole(role: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string;
        password: string;
        fullName: string | null;
        companyName: string | null;
        role: import(".prisma/client").$Enums.Role;
        isPremium: boolean;
        credits: number;
    } | null>;
    updateMessage(userId: string, messageId: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        conversationId: string;
        senderId: string;
        content: string | null;
        fileUrl: string | null;
        fileType: string | null;
        fileName: string | null;
        status: import(".prisma/client").$Enums.MessageStatus;
    }>;
    getConversations(userId: string): Promise<{
        id: any;
        bookingId: any;
        otherParticipant: any;
        lastMessage: any;
        unreadCount: any;
        updatedAt: any;
    }[]>;
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(conversationId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteMessage(userId: string, messageId: string): Promise<{
        id: string;
        createdAt: Date;
        conversationId: string;
        senderId: string;
        content: string | null;
        fileUrl: string | null;
        fileType: string | null;
        fileName: string | null;
        status: import(".prisma/client").$Enums.MessageStatus;
    }>;
}
