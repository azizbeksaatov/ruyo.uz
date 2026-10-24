import { createServerSupabase, createAdminSupabase } from './supabase';

export type HoroscopeRow = {
  sign: string;
  period: string;
  locale: string;
  period_key: string;
  general: string | null;
  love: string | null;
  finance: string | null;
  health: string | null;
  advice: string | null;
  lucky_color: string | null;
  lucky_number: number | null;
};

export function getDailyKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function getWeeklyKey(): string {
  const d = new Date();
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

export function getMonthlyKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function getPeriodKey(period: 'daily' | 'weekly' | 'monthly'): string {
  if (period === 'daily') return getDailyKey();
  if (period === 'weekly') return getWeeklyKey();
  return getMonthlyKey();
}

export async function fetchHoroscope(
  sign: string,
  period: 'daily' | 'weekly' | 'monthly',
  locale: string,
): Promise<HoroscopeRow | null> {
  const key = getPeriodKey(period);
  const { data } = await createServerSupabase()
    .from('horoscopes')
    .select('*')
    .eq('sign', sign)
    .eq('period', period)
    .eq('locale', locale)
    .eq('period_key', key)
    .maybeSingle();
  return (data as HoroscopeRow) ?? null;
}

export async function upsertHoroscope(row: HoroscopeRow) {
  return createAdminSupabase()
    .from('horoscopes')
    .upsert(row, { onConflict: 'sign,period,locale,period_key' });
}
