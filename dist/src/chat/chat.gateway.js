"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./chat.service");
const logger_1 = require("../utils/logger");
let ChatGateway = class ChatGateway {
    chatService;
    logger;
    server;
    constructor(chatService, logger) {
        this.chatService = chatService;
        this.logger = logger;
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`, 'ChatGateway');
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`, 'ChatGateway');
    }
    handleJoinConversation(data, client) {
        client.join(data.conversationId);
        this.logger.log(`Client ${client.id} joined conversation ${data.conversationId}`, 'ChatGateway');
        return { event: 'joined', conversationId: data.conversationId };
    }
    async handleMessage(data, client) {
        const message = await this.chatService.saveMessage(data.senderId, data);
        this.server.to(data.conversationId).emit('new_message', message);
        return message;
    }
    async handleEditMessage(data) {
        const message = await this.chatService.updateMessage(data.userId, data.messageId, data.content);
        this.server.to(data.conversationId).emit('message_edited', message);
        return message;
    }
    async handleDeleteMessage(data) {
        await this.chatService.deleteMessage(data.userId, data.messageId);
        this.server.to(data.conversationId).emit('message_deleted', { messageId: data.messageId });
        return { messageId: data.messageId };
    }
    async handleMarkAsRead(data) {
        await this.chatService.markAsRead(data.conversationId, data.userId);
        this.server.to(data.conversationId).emit('messages_read', { conversationId: data.conversationId });
        this.server.emit('messages_read', { userId: data.userId });
        return { success: true };
    }
    handleTyping(data) {
        this.server.to(data.conversationId).emit('user_typing', data);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_conversation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleJoinConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('edit_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleEditMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('delete_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleDeleteMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('mark_as_read'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMarkAsRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTyping", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        namespace: 'chat',
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        logger_1.MyLogger])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map