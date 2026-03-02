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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const fs = require("fs");
const path = require("path");
let ChatService = class ChatService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    _formatConversation(conv, userId) {
        const otherParticipant = conv.participant1Id === userId ? conv.participant2 : conv.participant1;
        const lastMessage = conv.messages?.[0] || null;
        const unreadCount = conv._count?.messages || 0;
        return {
            id: conv.id,
            bookingId: conv.bookingId,
            otherParticipant,
            lastMessage,
            unreadCount,
            updatedAt: conv.updatedAt,
        };
    }
    async getOrCreateConversation(participant1Id, participant2Id, bookingId) {
        const [p1, p2] = [participant1Id, participant2Id].sort();
        let conversation = await this.prisma.conversation.findUnique({
            where: {
                participant1Id_participant2Id_bookingId: {
                    participant1Id: p1,
                    participant2Id: p2,
                    bookingId: bookingId ?? null,
                },
            },
            include: {
                participant1: { select: { id: true, fullName: true, role: true } },
                participant2: { select: { id: true, fullName: true, role: true } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
                _count: {
                    select: {
                        messages: {
                            where: {
                                senderId: { not: participant1Id },
                                status: { not: client_1.MessageStatus.READ },
                            },
                        },
                    },
                },
            },
        });
        if (!conversation) {
            conversation = await this.prisma.conversation.create({
                data: {
                    participant1Id: p1,
                    participant2Id: p2,
                    bookingId: bookingId || null,
                },
                include: {
                    participant1: { select: { id: true, fullName: true, role: true } },
                    participant2: { select: { id: true, fullName: true, role: true } },
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                    },
                    _count: {
                        select: {
                            messages: {
                                where: {
                                    senderId: { not: participant1Id },
                                    status: { not: client_1.MessageStatus.READ },
                                },
                            },
                        },
                    },
                },
            });
        }
        return this._formatConversation(conversation, participant1Id);
    }
    async saveMessage(senderId, dto) {
        const message = await this.prisma.message.create({
            data: {
                conversationId: dto.conversationId,
                senderId,
                content: dto.content,
                fileUrl: dto.fileUrl,
                fileType: dto.fileType,
                fileName: dto.fileName,
                status: client_1.MessageStatus.SENT,
            },
        });
        await this.prisma.conversation.update({
            where: { id: dto.conversationId },
            data: {
                updatedAt: new Date(),
                lastMessageId: message.id
            },
        });
        return message;
    }
    async getMessages(conversationId, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        return this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
            skip,
            take: limit,
        });
    }
    async verifyBookingCode(code) {
        const booking = await this.prisma.booking.findUnique({
            where: { code },
            include: {
                client: { select: { id: true, fullName: true } },
                provider: { select: { id: true, fullName: true } },
                service: true,
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Code de réservation invalide');
        }
        return booking;
    }
    async findUserByRole(role) {
        return this.prisma.user.findFirst({
            where: { role: 'ADMIN' }
        });
    }
    async updateMessage(userId, messageId, content) {
        const message = await this.prisma.message.findUnique({
            where: { id: messageId },
        });
        if (!message) {
            throw new common_1.NotFoundException('Message non trouvé');
        }
        if (message.senderId !== userId) {
            throw new common_1.BadRequestException('Vous n\'êtes pas l\'auteur de ce message');
        }
        return this.prisma.message.update({
            where: { id: messageId },
            data: { content },
        });
    }
    async getConversations(userId) {
        const conversations = await this.prisma.conversation.findMany({
            where: {
                OR: [
                    { participant1Id: userId },
                    { participant2Id: userId },
                ],
            },
            include: {
                participant1: { select: { id: true, fullName: true, role: true } },
                participant2: { select: { id: true, fullName: true, role: true } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
                _count: {
                    select: {
                        messages: {
                            where: {
                                senderId: { not: userId },
                                status: { not: client_1.MessageStatus.READ },
                            },
                        },
                    },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
        return conversations.map((conv) => this._formatConversation(conv, userId));
    }
    async getUnreadCount(userId) {
        return this.prisma.message.count({
            where: {
                conversation: {
                    OR: [
                        { participant1Id: userId },
                        { participant2Id: userId },
                    ],
                },
                senderId: { not: userId },
                status: { not: client_1.MessageStatus.READ },
            },
        });
    }
    async markAsRead(conversationId, userId) {
        return this.prisma.message.updateMany({
            where: {
                conversationId,
                senderId: { not: userId },
                status: { not: client_1.MessageStatus.READ },
            },
            data: {
                status: client_1.MessageStatus.READ,
            },
        });
    }
    async deleteMessage(userId, messageId) {
        const message = await this.prisma.message.findUnique({
            where: { id: messageId },
        });
        if (!message) {
            throw new common_1.NotFoundException('Message non trouvé');
        }
        if (message.senderId !== userId) {
            throw new common_1.BadRequestException('Vous n\'êtes pas l\'auteur de ce message');
        }
        if (message.fileUrl) {
            try {
                const relativePath = message.fileUrl.startsWith('/') ? message.fileUrl.substring(1) : message.fileUrl;
                const fullPath = path.join(process.cwd(), relativePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            }
            catch (error) {
                console.error('Error deleting file:', error);
            }
        }
        return this.prisma.message.delete({
            where: { id: messageId },
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map