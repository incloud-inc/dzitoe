import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@dzitoe/auth';
import { checkRateLimit } from '@dzitoe/utils';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lewati static files & assets
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.json' ||
    pathname === '/sw.js'
  ) {
    return NextResponse.next();
  }

  // Rate limiting untuk mobile app (proteksi endpoint mobile & brute-force)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  const isAuthAttempt = pathname === '/api/auth/login' || pathname === '/login';
  const rateLimit = checkRateLimit(
    `mobile:${ip}:${isAuthAttempt ? 'auth' : 'general'}`,
    isAuthAttempt ? 20 : 180, // 20 login/menit, 180 request/menit untuk sync mobile
    60
  );

  if (!rateLimit.allowed) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: 'Terlalu banyak permintaan. Silakan tunggu beberapa saat.',
        retryAfter: rateLimit.resetSeconds,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(rateLimit.resetSeconds),
        },
      }
    );
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = token ? await verifySessionToken(token) : null;
  const isLoginPage = pathname === '/login';

  // Jika belum login dan mengakses halaman selain /login
  if (!user && !isLoginPage) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Jika sudah login dan mencoba akses /login
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json).*)',
  ],
};
