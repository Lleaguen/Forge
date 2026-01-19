import { Request } from 'express';

export function extractRefreshToken(req: Request): string | null {
  const header = req.headers['authorization'];
  if (!header) return null;

  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) return null;

  return token;
}
