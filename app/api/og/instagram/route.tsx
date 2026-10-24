import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const THEMES = {
  dream:     { from: '#3b0764', to: '#6d28d9' },
  name:      { from: '#064e3b', to: '#059669' },
  horoscope: { from: '#78350f', to: '#d97706' },
};

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(
      'https://fonts.gstatic.com/s/notosans/v36/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5a7du2mhS2_M.woff',
      { next: { revalidate: 86400 } }
    );
    return res.ok ? res.arrayBuffer() : null;
  } catch { return null; }
}

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const type   = (p.get('type') ?? 'dream') as keyof typeof THEMES;
  const locale = p.get('locale') ?? 'ru';
  const theme  = THEMES[type] ?? THEMES.dream;
  const font   = await loadFont();
  const ff     = font ? 'NotoSans' : 'sans-serif';

  let content: React.ReactNode;

  if (type === 'name') {
    const name    = p.get('name')    ?? '';
    const meaning = p.get('meaning') ?? '';
    const origin  = p.get('origin')  ?? '';
    const element = p.get('element') ?? '';
    const lucky   = p.get('lucky')   ?? '';
    const isUz = locale === 'uz';

    content = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <div style={{ fontSize: '96px', lineHeight: 1 }}>✨</div>
        <div style={{ color: '#fff', fontSize: '72px', fontWeight: 700, letterSpacing: '-1px', display: 'flex' }}>{name}</div>
        <div style={{
          color: 'rgba(255,255,255,0.88)', fontSize: '34px', fontStyle: 'italic',
          textAlign: 'center', maxWidth: '860px', lineHeight: 1.3, display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
        }}>
          «{meaning}»
        </div>
        <div style={{ display: 'flex', gap: '32px', marginTop: '12px' }}>
          {[
            { icon: '🌍', label: origin },
            { icon: '🌿', label: element },
            { icon: '🔢', label: lucky },
          ].map(({ icon, label }) => label ? (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.15)', borderRadius: '100px',
              padding: '10px 22px', color: '#fff', fontSize: '26px',
            }}>
              <span>{icon}</span><span>{label}</span>
            </div>
          ) : null)}
        </div>
        <div style={{
          marginTop: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '22px', display: 'flex',
        }}>
          {isUz ? `Ismning to'liq tahlili → ruyo.uz` : 'Полный разбор имени → ruyo.uz'}
        </div>
      </div>
    );
  } else if (type === 'dream') {
    const title = p.get('title') ?? '';
    const short = (p.get('short') ?? '').slice(0, 130);
    const emoji = p.get('emoji') ?? '🌙';
    const isUz = locale === 'uz';
    const headline = isUz ? `Tushda ${title.toLowerCase()} — nima degani?` : `К чему снится ${title.toLowerCase()}?`;
    const headSize = headline.length > 40 ? 44 : 52;

    content = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <div style={{ fontSize: '96px', lineHeight: 1 }}>{emoji}</div>
        <div style={{
          color: '#fff', fontSize: `${headSize}px`, fontWeight: 700,
          textAlign: 'center', maxWidth: '900px', lineHeight: 1.2, display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {headline.toUpperCase()}
        </div>
        <div style={{
          color: 'rgba(255,255,255,0.82)', fontSize: '28px', textAlign: 'center',
          maxWidth: '840px', lineHeight: 1.45, display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {short}
        </div>
        <div style={{
          marginTop: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '22px', display: 'flex',
        }}>
          {isUz ? "To'liq ta'bir → ruyo.uz" : 'Полное толкование → ruyo.uz'}
        </div>
      </div>
    );
  } else {
    // horoscope
    const sign      = p.get('sign')      ?? '';
    const signEmoji = p.get('signEmoji') ?? '⭐';
    const date      = p.get('date')      ?? '';
    const text      = (p.get('text')     ?? '').slice(0, 150);
    const love      = p.get('love')      ?? '';
    const finance   = p.get('finance')   ?? '';
    const isUz = locale === 'uz';

    content = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '90px', lineHeight: 1 }}>{signEmoji}</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{ color: '#fff', fontSize: '60px', fontWeight: 700, display: 'flex' }}>{sign}</div>
          <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '26px', display: 'flex' }}>{date}</div>
        </div>
        <div style={{
          color: 'rgba(255,255,255,0.88)', fontSize: '28px', textAlign: 'center',
          maxWidth: '840px', lineHeight: 1.4, display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {text}
        </div>
        {(love || finance) && (
          <div style={{ display: 'flex', gap: '24px', marginTop: '4px' }}>
            {love && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.15)', borderRadius: '100px',
                padding: '8px 18px', color: '#fff', fontSize: '22px' }}>
                💕 {love.slice(0, 40)}
              </div>
            )}
            {finance && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.15)', borderRadius: '100px',
                padding: '8px 18px', color: '#fff', fontSize: '22px' }}>
                💰 {finance.slice(0, 40)}
              </div>
            )}
          </div>
        )}
        <div style={{ marginTop: '4px', color: 'rgba(255,255,255,0.6)', fontSize: '22px', display: 'flex' }}>
          {isUz ? "To'liq goroskop → ruyo.uz" : 'Полный гороскоп → ruyo.uz'}
        </div>
      </div>
    );
  }

  return new ImageResponse(
    (
      <div style={{
        width: '1080px', height: '1080px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(145deg, ${theme.from} 0%, ${theme.to} 100%)`,
        padding: '60px', position: 'relative',
        fontFamily: ff, overflow: 'hidden',
      }}>
        {/* Radial glows */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 20% 80%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 45%)',
          display: 'flex',
        }} />

        {/* Header */}
        <div style={{
          position: 'absolute', top: '44px', left: '56px', right: '56px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>🌙</span>
            <span style={{ color: 'rgba(255,255,255,0.92)', fontSize: '26px', fontWeight: 700, display: 'flex' }}>Ruyo.uz</span>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.18)', borderRadius: '100px',
            padding: '10px 24px', color: 'rgba(255,255,255,0.92)', fontSize: '20px', display: 'flex',
          }}>
            {type === 'name' ? '✨ Имена' : type === 'dream' ? '🌙 Сонник' : '⭐ Гороскоп'}
          </div>
        </div>

        {content}

        {/* Footer line */}
        <div style={{
          position: 'absolute', bottom: '44px',
          display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          <div style={{ width: '56px', height: '2px', background: 'rgba(255,255,255,0.3)', display: 'flex' }} />
          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '18px' }}>ruyo.uz</span>
          <div style={{ width: '56px', height: '2px', background: 'rgba(255,255,255,0.3)', display: 'flex' }} />
        </div>
      </div>
    ),
    {
      width: 1080, height: 1080,
      ...(font ? { fonts: [{ name: 'NotoSans', data: font, style: 'normal', weight: 700 }] } : {}),
    }
  );
}
