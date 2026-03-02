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
exports.LocalStorageService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
let LocalStorageService = class LocalStorageService {
    uploadDir;
    constructor() {
        this.uploadDir = process.env.FILE_STORAGE_PATH || path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
    async saveFile(fileData, folder = 'default') {
        const fileCode = (0, crypto_1.randomUUID)();
        const targetDir = path.join(this.uploadDir, folder);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        if (typeof fileData === 'string') {
            const fileName = path.basename(fileData);
            const destPath = path.join(targetDir, `${fileCode}-${fileName}`);
            fs.copyFileSync(fileData, destPath);
            const stats = fs.statSync(destPath);
            return {
                fileCode,
                fileName,
                fileMimeType: path.extname(fileName).replace('.', ''),
                fileSize: stats.size,
                filePath: destPath,
                fileUrl: `/uploads/${folder}/${fileCode}-${fileName}`,
            };
        }
        const arrayBuffer = new Uint8Array(fileData);
        let extension = 'bin';
        let mime = 'application/octet-stream';
        const textContent = Buffer.from(arrayBuffer).toString('utf-8');
        const isSvg = textContent.trim().startsWith('<svg');
        if (isSvg) {
            extension = 'svg';
            mime = 'image/svg+xml';
        }
        else {
            const { fromBuffer } = await Promise.resolve().then(() => require('file-type'));
            const type = await fromBuffer(arrayBuffer);
            if (type) {
                extension = type.ext;
                mime = type.mime;
            }
        }
        const fileName = `${fileCode}.${extension}`;
        const destPath = path.join(targetDir, fileName);
        await fs.promises.writeFile(destPath, arrayBuffer);
        const stats = await fs.promises.stat(destPath);
        return {
            fileCode,
            fileName,
            fileMimeType: mime,
            fileSize: stats.size,
            filePath: destPath,
            fileUrl: `/uploads/${folder}/${fileName}`,
        };
    }
    async saveFileForPrisma(fileData, folder = 'default') {
        const upload = await this.saveFile(fileData, folder);
        return {
            fileCode: upload.fileCode,
            fileName: upload.fileName,
            fileMimeType: upload.fileMimeType,
            fileSize: upload.fileSize,
            fileUrl: upload.fileUrl,
        };
    }
    async deleteFile(filePath) {
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
        }
    }
    async downloadFolderAsZip(folder) {
        const folderPath = path.join(this.uploadDir, folder);
        const zipPath = path.join(this.uploadDir, `${folder}.zip`);
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });
        return new Promise((resolve, reject) => {
            output.on('close', () => resolve({ zipPath, zipUrl: `/uploads/${folder}.zip` }));
            archive.on('error', reject);
            archive.pipe(output);
            archive.directory(folderPath, folder);
            archive.finalize();
        });
    }
    async saveChatFile(fileData, fileName) {
        return this.saveFile(fileData, 'chat');
    }
    async saveVoiceMessage(audioBuffer) {
        const fileCode = (0, crypto_1.randomUUID)();
        const targetDir = path.join(this.uploadDir, 'chat', 'audio');
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        const fileName = `${fileCode}.wav`;
        const destPath = path.join(targetDir, fileName);
        await fs.promises.writeFile(destPath, audioBuffer);
        const stats = await fs.promises.stat(destPath);
        return {
            fileCode,
            fileName,
            fileMimeType: 'audio/wav',
            fileSize: stats.size,
            filePath: destPath,
            fileUrl: `/uploads/chat/audio/${fileName}`,
        };
    }
};
exports.LocalStorageService = LocalStorageService;
exports.LocalStorageService = LocalStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LocalStorageService);
//# sourceMappingURL=LocalStorageService.js.map