import { NextResponse } from 'next/server';
import { refreshHoroscopes } from '@/lib/horoscope-refresh';

export const runtime = 'nodejs';
export const maxDuration = 300;

export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const result = await refreshHoroscopes('weekly');
  return NextResponse.json({ period: 'weekly', ...result });
}
