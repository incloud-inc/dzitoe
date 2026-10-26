// ==============================================================================
// DZITOE — Session Cookie Helper (@dzitoe/auth)
// ==============================================================================

export const SESSION_COOKIE_NAME = 'dzitoe_session';

export const SESSION_COOKIE_OPTIONS = {
  name: SESSION_COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 hari dalam detik
};

/**
 * Serializes cookie header string untuk Response Set-Cookie
 */
export function serializeSessionCookie(token: string): string {
  const isProd = process.env.NODE_ENV === 'production';
  const secureFlag = isProd ? '; Secure' : '';
  const maxAge = SESSION_COOKIE_OPTIONS.maxAge;
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secureFlag}`;
}

/**
 * Serializes cookie deletion string untuk Response Set-Cookie (Logout)
 */
export function serializeClearSessionCookie(): string {
  const isProd = process.env.NODE_ENV === 'production';
  const secureFlag = isProd ? '; Secure' : '';
  return `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secureFlag}`;
}
