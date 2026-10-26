// ==============================================================================
// DZITOE — JWT Session Token Service (@dzitoe/auth)
// Edge-compatible using standard Web Crypto API (jose)
// ==============================================================================

import { SignJWT, jwtVerify } from 'jose';
import type { AuthUser } from './types';

const DEFAULT_SECRET = 'dzitoe_development_secret_key_min_32_characters_long';

function getJwtSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET || DEFAULT_SECRET;
  if (!process.env.AUTH_SECRET && process.env.NODE_ENV === 'production') {
    console.warn('[SECURITY] AUTH_SECRET environment variable is missing in production mode. Set AUTH_SECRET immediately!');
  }
  return new TextEncoder().encode(secret);
}

/**
 * Membuat token JWT sesi untuk user yang berhasil login.
 * Masa berlaku default: 7 hari.
 */
export async function createSessionToken(
  user: AuthUser,
  expiresIn = '7d'
): Promise<string> {
  const secretKey = getJwtSecret();

  return new SignJWT({
    sub: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    muridId: user.muridId,
    guruId: user.guruId,
    nisn: user.nisn,
    nip: user.nip,
    kelas: user.kelas,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey);
}

/**
 * Memvalidasi dan mendecode token JWT sesi.
 * Mengembalikan data payload AuthUser jika valid, null jika expired/invalid.
 */
export async function verifySessionToken(
  token: string
): Promise<AuthUser | null> {
  try {
    const secretKey = getJwtSecret();
    const { payload } = await jwtVerify(token, secretKey);

    return {
      id: (payload.sub as string) || '',
      name: (payload.name as string) || '',
      username: (payload.username as string) || '',
      email: (payload.email as string) || '',
      role: (payload.role as AuthUser['role']) || 'MURID',
      avatar: (payload.avatar as string | null) || null,
      muridId: (payload.muridId as string | null) || null,
      guruId: (payload.guruId as string | null) || null,
      nisn: (payload.nisn as string | null) || null,
      nip: (payload.nip as string | null) || null,
      kelas: (payload.kelas as string | null) || null,
    };
  } catch {
    return null;
  }
}
