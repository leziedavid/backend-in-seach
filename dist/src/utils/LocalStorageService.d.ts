export declare class LocalStorageService {
    private readonly uploadDir;
    constructor();
    saveFile(fileData: Buffer | string, folder?: string): Promise<{
        fileCode: `${string}-${string}-${string}-${string}-${string}`;
        fileName: string;
        fileMimeType: string;
        fileSize: number;
        filePath: string;
        fileUrl: string;
    }>;
    saveFileForPrisma(fileData: Buffer | string, folder?: string): Promise<{
        fileCode: `${string}-${string}-${string}-${string}-${string}`;
        fileName: string;
        fileMimeType: string;
        fileSize: number;
        fileUrl: string;
    }>;
    deleteFile(filePath: string): Promise<void>;
    downloadFolderAsZip(folder: string): Promise<unknown>;
    saveChatFile(fileData: Buffer | string, fileName?: string): Promise<{
        fileCode: `${string}-${string}-${string}-${string}-${string}`;
        fileName: string;
        fileMimeType: string;
        fileSize: number;
        filePath: string;
        fileUrl: string;
    }>;
    saveVoiceMessage(audioBuffer: Buffer): Promise<{
        fileCode: `${string}-${string}-${string}-${string}-${string}`;
        fileName: string;
        fileMimeType: string;
        fileSize: number;
        filePath: string;
        fileUrl: string;
    }>;
}
