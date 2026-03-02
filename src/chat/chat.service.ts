import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/chat.dto';
import { MessageStatus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) { }

    private _formatConversation(conv: any, userId: string) {
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

    async getOrCreateConversation(participant1Id: string, participant2Id: string, bookingId?: string) {
        // Sort IDs to ensure order consistency (participant1Id < participant2Id)
        const [p1, p2] = [participant1Id, participant2Id].sort();

        let conversation = await this.prisma.conversation.findUnique({
            where: {
                participant1Id_participant2Id_bookingId: {
                    participant1Id: p1,
                    participant2Id: p2,
                    bookingId: bookingId ?? null as any,
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
                                status: { not: MessageStatus.READ },
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
                                    status: { not: MessageStatus.READ },
                                },
                            },
                        },
                    },
                },
            });
        }

        return this._formatConversation(conversation, participant1Id);
    }

    async saveMessage(senderId: string, dto: CreateMessageDto) {
        const message = await this.prisma.message.create({
            data: {
                conversationId: dto.conversationId,
                senderId,
                content: dto.content,
                fileUrl: dto.fileUrl,
                fileType: dto.fileType,
                fileName: dto.fileName,
                status: MessageStatus.SENT,
            },
        });

        // Update conversation lastMessage info and refresh timestamp
        await this.prisma.conversation.update({
            where: { id: dto.conversationId },
            data: {
                updatedAt: new Date(),
                lastMessageId: message.id
            },
        });

        return message;
    }

    async getMessages(conversationId: string, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        return this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
            skip,
            take: limit,
        });
    }

    async verifyBookingCode(code: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { code },
            include: {
                client: { select: { id: true, fullName: true } },
                provider: { select: { id: true, fullName: true } },
                service: true,
            },
        });

        if (!booking) {
            throw new NotFoundException('Code de réservation invalide');
        }

        return booking;
    }

    async findUserByRole(role: string) {
        return this.prisma.user.findFirst({
            where: { role: 'ADMIN' as any }
        })
    }

    async updateMessage(userId: string, messageId: string, content: string) {
        const message = await this.prisma.message.findUnique({
            where: { id: messageId },
        });

        if (!message) {
            throw new NotFoundException('Message non trouvé');
        }

        if (message.senderId !== userId) {
            throw new BadRequestException('Vous n\'êtes pas l\'auteur de ce message');
        }

        return this.prisma.message.update({
            where: { id: messageId },
            data: { content },
        });
    }

    async getConversations(userId: string) {
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
                                status: { not: MessageStatus.READ },
                            },
                        },
                    },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });

        return conversations.map((conv) => this._formatConversation(conv, userId));
    }

    async getUnreadCount(userId: string) {
        return this.prisma.message.count({
            where: {
                conversation: {
                    OR: [
                        { participant1Id: userId },
                        { participant2Id: userId },
                    ],
                },
                senderId: { not: userId },
                status: { not: MessageStatus.READ },
            },
        });
    }

    async markAsRead(conversationId: string, userId: string) {
        return this.prisma.message.updateMany({
            where: {
                conversationId,
                senderId: { not: userId },
                status: { not: MessageStatus.READ },
            },
            data: {
                status: MessageStatus.READ,
            },
        });
    }

    async deleteMessage(userId: string, messageId: string) {
        const message = await this.prisma.message.findUnique({
            where: { id: messageId },
        });

        if (!message) {
            throw new NotFoundException('Message non trouvé');
        }

        if (message.senderId !== userId) {
            throw new BadRequestException('Vous n\'êtes pas l\'auteur de ce message');
        }

        // Delete file if exists
        if (message.fileUrl) {
            try {
                // fileUrl is like /uploads/chat/filename.ext
                const relativePath = message.fileUrl.startsWith('/') ? message.fileUrl.substring(1) : message.fileUrl;
                const fullPath = path.join(process.cwd(), relativePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            } catch (error) {
                console.error('Error deleting file:', error);
            }
        }

        return this.prisma.message.delete({
            where: { id: messageId },
        });
    }
}
