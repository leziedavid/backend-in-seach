import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/chat.dto';
import { MyLogger } from '../utils/logger';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private chatService;
    private logger;
    server: Server;
    constructor(chatService: ChatService, logger: MyLogger);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinConversation(data: {
        conversationId: string;
    }, client: Socket): {
        event: string;
        conversationId: string;
    };
    handleMessage(data: CreateMessageDto & {
        senderId: string;
    }, client: Socket): Promise<{
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
    handleEditMessage(data: {
        conversationId: string;
        messageId: string;
        content: string;
        userId: string;
    }): Promise<{
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
    handleDeleteMessage(data: {
        conversationId: string;
        messageId: string;
        userId: string;
    }): Promise<{
        messageId: string;
    }>;
    handleMarkAsRead(data: {
        conversationId: string;
        userId: string;
    }): Promise<{
        success: boolean;
    }>;
    handleTyping(data: {
        conversationId: string;
        userId: string;
        isTyping: boolean;
    }): void;
}
