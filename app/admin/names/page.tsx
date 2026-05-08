import { createServerSupabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

// Simple auth — protect with env variable
const ADMIN_KEY = process.env.ADMIN_SECRET_KEY;

async function getSubmissions() {
  const sb = createServerSupabase();
  const { data } = await sb
    .from('name_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  return data ?? [];
}

export default async function AdminNamesPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string; action?: string; id?: string }>;
}) {
  const { key, action, id } = await searchParams;

  if (!ADMIN_KEY || key !== ADMIN_KEY) {
    notFound();
  }

  const sb = createServerSupabase();

  if (action === 'approve' && id) {
    await sb.from('name_submissions').update({ status: 'approved', reviewed_at: new Date().toISOString() }).eq('id', id);
  }
  if (action === 'reject' && id) {
    await sb.from('name_submissions').update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', id);
  }

  const submissions = await getSubmissions();
  const pending = submissions.filter((s) => s.status === 'pending');
  const reviewed = submissions.filter((s) => s.status !== 'pending');

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-stone-900 mb-2">Модерация имён</h1>
      <p className="text-stone-500 text-sm mb-8">Ожидают проверки: {pending.length}</p>

      {pending.length === 0 && (
        <div className="bg-stone-50 rounded-2xl p-8 text-center text-stone-400">
          Нет заявок на проверке
        </div>
      )}

      <div className="space-y-3">
        {pending.map((s) => (
          <div key={s.id} className="bg-white border border-stone-200 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-semibold text-stone-900">{s.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">{s.gender}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-600">{s.origin}</span>
                </div>
                {s.meaning && <p className="text-sm text-stone-600 mb-1">{s.meaning}</p>}
                {s.notes && <p className="text-xs text-stone-400">{s.notes}</p>}
                <p className="text-xs text-stone-300 mt-2">
                  {new Date(s.created_at).toLocaleString('ru-RU')} · IP: {s.submitter_ip}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <a
                  href={`?key=${key}&action=approve&id=${s.id}`}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Одобрить
                </a>
                <a
                  href={`?key=${key}&action=reject&id=${s.id}`}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-sm font-medium transition-colors"
                >
                  Отклонить
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviewed.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-medium text-stone-400 uppercase tracking-wide mb-4">Обработанные</h2>
          <div className="space-y-2">
            {reviewed.map((s) => (
              <div key={s.id} className="flex items-center gap-3 px-4 py-3 bg-stone-50 rounded-xl text-sm">
                <span className={`w-2 h-2 rounded-full ${s.status === 'approved' ? 'bg-teal-500' : 'bg-stone-300'}`} />
                <span className="font-medium text-stone-700">{s.name}</span>
                <span className="text-stone-400">{s.origin} · {s.gender}</span>
                <span className="ml-auto text-stone-400 text-xs">{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
