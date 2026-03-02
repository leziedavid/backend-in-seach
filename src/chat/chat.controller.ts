import { Controller, Post, Get, Body, Param, UseInterceptors, UploadedFiles, UseGuards, Request, Patch, Delete, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';
import { StartConversationDto, UpdateMessageDto } from './dto/chat.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { LocalStorageService } from '../utils/LocalStorageService';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BaseResponse } from '../common/dto/base-response.dto';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(
        private chatService: ChatService,
        private localStorageService: LocalStorageService,
    ) { }

    @Post('conversation')
    async getOrCreate(@Request() req: any, @Body() dto: StartConversationDto) {
        const data = await this.chatService.getOrCreateConversation(req.user.id, dto.participant2Id, dto.bookingId);
        return new BaseResponse(HttpStatus.OK, 'Conversation récupérée', data);
    }

    @Get('messages/:conversationId')
    async getMessages(@Param('conversationId') conversationId: string) {
        const data = await this.chatService.getMessages(conversationId);
        return new BaseResponse(HttpStatus.OK, 'Messages récupérés', data);
    }

    @Post('upload')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFiles(@UploadedFiles() files: any[]) {
        const data = [];
        for (const file of files) {
            const upload = await this.localStorageService.saveChatFile(file.buffer, file.originalname);
            data.push({
                url: upload.fileUrl,
                name: file.originalname,
                type: upload.fileMimeType,
            });
        }
        return new BaseResponse(HttpStatus.OK, 'Fichiers téléchargés', data);
    }

    @Post('verify-code')
    async verifyCode(@Body('code') code: string) {
        const data = await this.chatService.verifyBookingCode(code);
        return new BaseResponse(HttpStatus.OK, 'Code vérifié', data);
    }

    @Patch('message/:id')
    async updateMessage(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateMessageDto) {
        const data = await this.chatService.updateMessage(req.user.id, id, dto.content);
        return new BaseResponse(HttpStatus.OK, 'Message mis à jour', data);
    }

    @Get('conversations')
    async getConversations(@Request() req: any) {
        const data = await this.chatService.getConversations(req.user.id);
        return new BaseResponse(HttpStatus.OK, 'Conversations récupérées', data);
    }

    @Get('unread-count')
    async getUnreadCount(@Request() req: any) {
        const count = await this.chatService.getUnreadCount(req.user.id);
        return new BaseResponse(HttpStatus.OK, 'Nombre de messages non lus récupéré', count);
    }

    @Post('read/:conversationId')
    async markAsRead(@Request() req: any, @Param('conversationId') conversationId: string) {
        await this.chatService.markAsRead(conversationId, req.user.id);
        return new BaseResponse(HttpStatus.OK, 'Messages marqués comme lus');
    }

    @Delete('message/:id')
    async deleteMessage(@Request() req: any, @Param('id') id: string) {
        const data = await this.chatService.deleteMessage(req.user.id, id);
        return new BaseResponse(HttpStatus.OK, 'Message supprimé', data);
    }
}
