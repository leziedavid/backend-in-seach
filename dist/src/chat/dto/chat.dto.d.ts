export declare class CreateMessageDto {
    conversationId: string;
    content?: string;
    fileUrl?: string;
    fileType?: 'image' | 'audio' | 'file';
    fileName?: string;
}
export declare class StartConversationDto {
    participant2Id: string;
    bookingId?: string;
}
export declare class UpdateMessageDto {
    content: string;
}
export declare class SendBotMessageDto {
    conversationId: string;
    content: string;
}
