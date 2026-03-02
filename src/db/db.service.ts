import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execPromise = promisify(exec);

@Injectable()
export class DbService {
  async seed() {
    try {
      const seedPath = path.join(process.cwd(), 'prisma', 'seed.ts');
      // We use npx ts-node to run the seed script
      const { stdout, stderr } = await execPromise(`npx ts-node ${seedPath}`);
      return {
        status: true,
        message: 'Seeding completed successfully',
        output: stdout,
        error: stderr,
      };
    } catch (error) {
      return {
        status: false,
        message: 'Seeding failed',
        error: error.message,
      };
    }
  }
}
