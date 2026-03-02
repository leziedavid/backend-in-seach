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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const chat_dto_1 = require("./dto/chat.dto");
const platform_express_1 = require("@nestjs/platform-express");
const LocalStorageService_1 = require("../utils/LocalStorageService");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const base_response_dto_1 = require("../common/dto/base-response.dto");
let ChatController = class ChatController {
    chatService;
    localStorageService;
    constructor(chatService, localStorageService) {
        this.chatService = chatService;
        this.localStorageService = localStorageService;
    }
    async getOrCreate(req, dto) {
        const data = await this.chatService.getOrCreateConversation(req.user.id, dto.participant2Id, dto.bookingId);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Conversation récupérée', data);
    }
    async getMessages(conversationId) {
        const data = await this.chatService.getMessages(conversationId);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Messages récupérés', data);
    }
    async uploadFiles(files) {
        const data = [];
        for (const file of files) {
            const upload = await this.localStorageService.saveChatFile(file.buffer, file.originalname);
            data.push({
                url: upload.fileUrl,
                name: file.originalname,
                type: upload.fileMimeType,
            });
        }
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Fichiers téléchargés', data);
    }
    async verifyCode(code) {
        const data = await this.chatService.verifyBookingCode(code);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Code vérifié', data);
    }
    async updateMessage(req, id, dto) {
        const data = await this.chatService.updateMessage(req.user.id, id, dto.content);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Message mis à jour', data);
    }
    async getConversations(req) {
        const data = await this.chatService.getConversations(req.user.id);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Conversations récupérées', data);
    }
    async getUnreadCount(req) {
        const count = await this.chatService.getUnreadCount(req.user.id);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Nombre de messages non lus récupéré', count);
    }
    async markAsRead(req, conversationId) {
        await this.chatService.markAsRead(conversationId, req.user.id);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Messages marqués comme lus');
    }
    async deleteMessage(req, id) {
        const data = await this.chatService.deleteMessage(req.user.id, id);
        return new base_response_dto_1.BaseResponse(common_1.HttpStatus.OK, 'Message supprimé', data);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('conversation'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, chat_dto_1.StartConversationDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getOrCreate", null);
__decorate([
    (0, common_1.Get)('messages/:conversationId'),
    __param(0, (0, common_1.Param)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "uploadFiles", null);
__decorate([
    (0, common_1.Post)('verify-code'),
    __param(0, (0, common_1.Body)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "verifyCode", null);
__decorate([
    (0, common_1.Patch)('message/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, chat_dto_1.UpdateMessageDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "updateMessage", null);
__decorate([
    (0, common_1.Get)('conversations'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getConversations", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Post)('read/:conversationId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Delete)('message/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "deleteMessage", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        LocalStorageService_1.LocalStorageService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map