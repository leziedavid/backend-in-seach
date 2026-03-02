import { ChatService } from './chat.service';
import { StartConversationDto, UpdateMessageDto } from './dto/chat.dto';
import { LocalStorageService } from '../utils/LocalStorageService';
import { BaseResponse } from '../common/dto/base-response.dto';
export declare class ChatController {
    private chatService;
    private localStorageService;
    constructor(chatService: ChatService, localStorageService: LocalStorageService);
    getOrCreate(req: any, dto: StartConversationDto): Promise<BaseResponse<{
        id: any;
        bookingId: any;
        otherParticipant: any;
        lastMessage: any;
        unreadCount: any;
        updatedAt: any;
    }>>;
    getMessages(conversationId: string): Promise<BaseResponse<{
        id: string;
        createdAt: Date;
        conversationId: string;
        senderId: string;
        content: string | null;
        fileUrl: string | null;
        fileType: string | null;
        fileName: string | null;
        status: import(".prisma/client").$Enums.MessageStatus;
    }[]>>;
    uploadFiles(files: any[]): Promise<BaseResponse<{
        url: string;
        name: any;
        type: string;
    }[]>>;
    verifyCode(code: string): Promise<BaseResponse<{
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
    }>>;
    updateMessage(req: any, id: string, dto: UpdateMessageDto): Promise<BaseResponse<{
        id: string;
        createdAt: Date;
        conversationId: string;
        senderId: string;
        content: string | null;
        fileUrl: string | null;
        fileType: string | null;
        fileName: string | null;
        status: import(".prisma/client").$Enums.MessageStatus;
    }>>;
    getConversations(req: any): Promise<BaseResponse<{
        id: any;
        bookingId: any;
        otherParticipant: any;
        lastMessage: any;
        unreadCount: any;
        updatedAt: any;
    }[]>>;
    getUnreadCount(req: any): Promise<BaseResponse<number>>;
    markAsRead(req: any, conversationId: string): Promise<BaseResponse<any>>;
    deleteMessage(req: any, id: string): Promise<BaseResponse<{
        id: string;
        createdAt: Date;
        conversationId: string;
        senderId: string;
        content: string | null;
        fileUrl: string | null;
        fileType: string | null;
        fileName: string | null;
        status: import(".prisma/client").$Enums.MessageStatus;
    }>>;
}
