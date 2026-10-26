import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken, canAccessRoute } from '@dzitoe/auth';
import { checkRateLimit } from '@dzitoe/utils';

const PUBLIC_ROUTES = [
  '/login',
  '/forgot-password',
  '/reset-password',
  '/unauthorized',
  '/publik',
  '/coming-soon',
];

const COMING_SOON_ROUTES = [
  // Fase 3: Tata Kelola Keuangan
  '/keuangan',
  // Fase 4: Bank Soal Siap Cetak
  '/kurikulum',
  '/bank-soal',
  // Fase 5: Layanan & Karakter Murid
  '/bk',
  '/kesehatan',
  // Fase 6: Alumni & Portal PPID
  '/alumni',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lewati static files & assets
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // A30.1 Rate limiting bertingkat untuk proteksi DDoS & brute force
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  const isAuthAttempt = pathname === '/api/auth/login' || pathname === '/login';
  const rateLimit = checkRateLimit(
    `${ip}:${isAuthAttempt ? 'auth' : 'general'}`,
    isAuthAttempt ? 15 : 120, // 15 login per menit, 120 request umum per menit
    60
  );

  if (!rateLimit.allowed) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: 'Terlalu banyak permintaan (Rate limit exceeded). Silakan coba lagi dalam beberapa saat.',
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

  // Lewati API route umum (ditangani controller tersendiri)
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = token ? await verifySessionToken(token) : null;
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route));

  // 1. Jika belum login dan mengakses halaman yang diproteksi
  if (!user && !isPublicRoute) {
    if (pathname === '/ppid' || pathname === '/ppid/') {
      return NextResponse.redirect(new URL('/publik/ppid', request.url));
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Proteksi Akses Langsung URL untuk Fitur Fase 3, 4, 5, 6 (Coming Soon)
  const isComingSoonRoute =
    COMING_SOON_ROUTES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)) ||
    (pathname === '/ppid' || pathname.startsWith('/ppid/'));

  if (isComingSoonRoute) {
    const comingSoonUrl = new URL('/coming-soon', request.url);
    comingSoonUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(comingSoonUrl);
  }

  // 3. Jika sudah login dan mencoba akses halaman autentikasi publik
  if (user && (pathname === '/login' || pathname === '/forgot-password')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3. Hak Akses Granular per Role (Task A1.6)
  if (user) {
    if (user.role === 'MURID' || user.role === 'ORANG_TUA') {
      if (pathname !== '/unauthorized') {
        const unauthUrl = new URL('/unauthorized', request.url);
        unauthUrl.searchParams.set('role', user.role);
        return NextResponse.redirect(unauthUrl);
      }
    } else {
      const isAllowed = canAccessRoute(user.role, pathname);
      if (!isAllowed) {
        const unauthUrl = new URL('/unauthorized', request.url);
        unauthUrl.searchParams.set('denied', pathname);
        unauthUrl.searchParams.set('role', user.role);
        return NextResponse.rewrite(unauthUrl, { status: 403 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
