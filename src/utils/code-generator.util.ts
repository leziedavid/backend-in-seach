import { randomBytes } from 'crypto';

/**
 * Generates a unique alphanumeric code with a prefix.
 * Format: PREFIX-XXXX (where XXXX is 6-8 alphanumeric characters)
 */
export function generateUniqueCode(prefix: string): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 6;
    let code = '';

    // Generate random bytes and map to characters for better randomness than Math.random
    const bytes = randomBytes(length);
    for (let i = 0; i < length; i++) {
        code += characters[bytes[i] % characters.length];
    }

    return `${prefix.toUpperCase()}-${code}`;
}
