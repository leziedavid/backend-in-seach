"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueCode = generateUniqueCode;
const crypto_1 = require("crypto");
function generateUniqueCode(prefix) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 6;
    let code = '';
    const bytes = (0, crypto_1.randomBytes)(length);
    for (let i = 0; i < length; i++) {
        code += characters[bytes[i] % characters.length];
    }
    return `${prefix.toUpperCase()}-${code}`;
}
//# sourceMappingURL=code-generator.util.js.map