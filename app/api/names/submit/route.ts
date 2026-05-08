import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, gender, origin, meaning, notes } = body;

  if (!name || !gender || !origin) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';

  try {
    const sb = createServerSupabase();
    const { error } = await sb.from('name_submissions').insert({
      name: name.trim(),
      gender,
      origin,
      meaning: meaning?.trim() ?? null,
      notes: notes?.trim() ?? null,
      submitter_ip: ip,
      status: 'pending',
    });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}
