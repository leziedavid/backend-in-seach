// src/utils/helper.ts

export function getPublicFileUrl(filePath: string): string | null {
  if (!filePath) return null;

  const baseUrl = process.env.SERVEUR_URL || 'http://localhost:3001';
  const normalizedPath = filePath.replace(/\\/g, '/');

  // If path already starts with / we don't need double slash
  const finalPath = normalizedPath.startsWith('/')
    ? normalizedPath
    : `/${normalizedPath}`;

  return `${baseUrl}${finalPath}`;
}

export function toBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return false;
}

export function getPaginationValues(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const take = limit;
  return { skip, take };
}
