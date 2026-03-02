// src/utils/LocalStorageService.ts
// ⚠️ Service central de gestion des fichiers — NE PAS DUPLIQUER

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';

@Injectable()
export class LocalStorageService {
  private readonly uploadDir: string;

  constructor() {
    this.uploadDir = process.env.FILE_STORAGE_PATH || path.join(process.cwd(), 'uploads');

    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(fileData: Buffer | string, folder = 'default') {
    const fileCode = randomUUID();
    const targetDir = path.join(this.uploadDir, folder);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // 🔹 Chemin local
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

    // 🔹 Buffer
    const arrayBuffer = new Uint8Array(fileData);

    let extension = 'bin';
    let mime = 'application/octet-stream';

    const textContent = Buffer.from(arrayBuffer).toString('utf-8');
    const isSvg = textContent.trim().startsWith('<svg');

    if (isSvg) {
      extension = 'svg';
      mime = 'image/svg+xml';
    } else {
      // @ts-ignore
      const { fromBuffer } = await import('file-type');
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

  async saveFileForPrisma(fileData: Buffer | string, folder = 'default') {
    const upload = await this.saveFile(fileData, folder);

    return {
      fileCode: upload.fileCode,
      fileName: upload.fileName,
      fileMimeType: upload.fileMimeType,
      fileSize: upload.fileSize,
      fileUrl: upload.fileUrl,
    };
  }

  async deleteFile(filePath: string) {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }

  async downloadFolderAsZip(folder: string) {
    const folderPath = path.join(this.uploadDir, folder);
    const zipPath = path.join(this.uploadDir, `${folder}.zip`);

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
      output.on('close', () =>
        resolve({ zipPath, zipUrl: `/uploads/${folder}.zip` }),
      );

      archive.on('error', reject);
      archive.pipe(output);
      archive.directory(folderPath, folder);
      archive.finalize();
    });
  }

  // 🔹 Chat Methods
  async saveChatFile(fileData: Buffer | string, fileName?: string) {
    return this.saveFile(fileData, 'chat');
  }

  async saveVoiceMessage(audioBuffer: Buffer) {
    const fileCode = randomUUID();
    const targetDir = path.join(this.uploadDir, 'chat', 'audio');

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const fileName = `${fileCode}.wav`; // Default to wav or detect mime if possible
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
}
