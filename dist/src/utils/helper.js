"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicFileUrl = getPublicFileUrl;
exports.toBoolean = toBoolean;
exports.getPaginationValues = getPaginationValues;
function getPublicFileUrl(filePath) {
    if (!filePath)
        return null;
    const baseUrl = process.env.SERVEUR_URL || 'http://localhost:3001';
    const normalizedPath = filePath.replace(/\\/g, '/');
    const finalPath = normalizedPath.startsWith('/')
        ? normalizedPath
        : `/${normalizedPath}`;
    return `${baseUrl}${finalPath}`;
}
function toBoolean(value) {
    if (typeof value === 'boolean')
        return value;
    if (typeof value === 'string')
        return value.toLowerCase() === 'true';
    return false;
}
function getPaginationValues(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const take = limit;
    return { skip, take };
}
//# sourceMappingURL=helper.js.map