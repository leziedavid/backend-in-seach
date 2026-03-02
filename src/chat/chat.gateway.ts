import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/chat.dto';
import { UseGuards } from '@nestjs/common';
// import { WsJwtAuthGuard } from '../auth/guards/ws-jwt.guard'; // Assuming this exists or I'll create it
import { MyLogger } from '../utils/logger';

@WebSocketGateway({
    cors: { origin: '*' },
    namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private chatService: ChatService,
        private logger: MyLogger,
    ) { }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`, 'ChatGateway');
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`, 'ChatGateway');
    }

    @SubscribeMessage('join_conversation')
    handleJoinConversation(
        @MessageBody() data: { conversationId: string },
        @ConnectedSocket() client: Socket,
    ) {
        client.join(data.conversationId);
        this.logger.log(`Client ${client.id} joined conversation ${data.conversationId}`, 'ChatGateway');
        return { event: 'joined', conversationId: data.conversationId };
    }

    @SubscribeMessage('send_message')
    async handleMessage(
        @MessageBody() data: CreateMessageDto & { senderId: string },
        @ConnectedSocket() client: Socket,
    ) {
        const message = await this.chatService.saveMessage(data.senderId, data);

        // Broadcast to the conversation room
        this.server.to(data.conversationId).emit('new_message', message);

        return message;
    }

    @SubscribeMessage('edit_message')
    async handleEditMessage(
        @MessageBody() data: { conversationId: string, messageId: string, content: string, userId: string },
    ) {
        const message = await this.chatService.updateMessage(data.userId, data.messageId, data.content);
        this.server.to(data.conversationId).emit('message_edited', message);
        return message;
    }

    @SubscribeMessage('delete_message')
    async handleDeleteMessage(
        @MessageBody() data: { conversationId: string, messageId: string, userId: string },
    ) {
        await this.chatService.deleteMessage(data.userId, data.messageId);
        this.server.to(data.conversationId).emit('message_deleted', { messageId: data.messageId });
        return { messageId: data.messageId };
    }

    @SubscribeMessage('mark_as_read')
    async handleMarkAsRead(
        @MessageBody() data: { conversationId: string, userId: string },
    ) {
        await this.chatService.markAsRead(data.conversationId, data.userId);
        this.server.to(data.conversationId).emit('messages_read', { conversationId: data.conversationId });
        // Also notify generally to update badges
        this.server.emit('messages_read', { userId: data.userId });
        return { success: true };
    }

    @SubscribeMessage('typing')
    handleTyping(
        @MessageBody() data: { conversationId: string, userId: string, isTyping: boolean },
    ) {
        this.server.to(data.conversationId).emit('user_typing', data);
    }
}
