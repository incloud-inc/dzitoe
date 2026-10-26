import { NextResponse } from 'next/server';
import { getRekapTunggakan } from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = getRekapTunggakan();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
