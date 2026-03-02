import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';

export class CreateMessageDto {
    @IsUUID()
    conversationId: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsString()
    fileUrl?: string;

    @IsOptional()
    @IsString()
    fileType?: 'image' | 'audio' | 'file';

    @IsOptional()
    @IsString()
    fileName?: string;
}

export class StartConversationDto {
    @IsUUID()
    participant2Id: string;

    @IsOptional()
    @IsUUID()
    bookingId?: string;
}

export class UpdateMessageDto {
    @IsString()
    content: string;
}

export class SendBotMessageDto {
    @IsUUID()
    conversationId: string;
    @IsString()
    content: string;
}
