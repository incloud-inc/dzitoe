import { NextResponse } from 'next/server';
import { serializeClearSessionCookie } from '@dzitoe/auth';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Berhasil keluar.',
  });

  response.headers.set('Set-Cookie', serializeClearSessionCookie());
  return response;
}
