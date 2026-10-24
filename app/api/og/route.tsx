import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const TYPE_STYLES = {
  dream:     { from: '#3b0764', to: '#6d28d9', badge: '🌙 Сонник' },
  name:      { from: '#064e3b', to: '#059669', badge: '✨ Имена' },
  horoscope: { from: '#78350f', to: '#d97706', badge: '⭐ Гороскоп' },
};

const TYPE_STYLES_UZ = {
  dream:     { badge: '🌙 Tush ta\'biri' },
  name:      { badge: '✨ Ismlar' },
  horoscope: { badge: '⭐ Goroskop' },
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title  = (searchParams.get('title') ?? 'Ruyo.uz').slice(0, 80);
  const emoji  = searchParams.get('emoji') ?? '🌙';
  const type   = (searchParams.get('type') ?? 'dream') as keyof typeof TYPE_STYLES;
  const locale = searchParams.get('locale') ?? 'ru';

  const style = TYPE_STYLES[type] ?? TYPE_STYLES.dream;
  const badge = locale === 'uz'
    ? (TYPE_STYLES_UZ[type]?.badge ?? style.badge)
    : style.badge;

  const fontSize = title.length > 55 ? 36 : title.length > 38 ? 44 : 52;

  // Load font data for Cyrillic support. The file URL is resolved from the CSS
  // because Google changes versioned font URLs (a hardcoded one 404'd and broke every image).
  let fontData: ArrayBuffer | null = null;
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@700',
      { headers: { 'User-Agent': 'Wget/1.0' }, next: { revalidate: 86400 } }
    ).then((r) => (r.ok ? r.text() : ''));
    const fontUrl = css.match(/src: url\((.+?\.ttf)\)/)?.[1];
    if (fontUrl) {
      const res = await fetch(fontUrl, { next: { revalidate: 86400 } });
      if (res.ok) fontData = await res.arrayBuffer();
    }
  } catch {
    // fallback: render without custom font
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(140deg, ${style.from} 0%, ${style.to} 100%)`,
          padding: '60px',
          position: 'relative',
          fontFamily: fontData ? 'NotoSans' : 'sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Subtle radial highlights */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 15% 85%, rgba(255,255,255,0.07) 0%, transparent 55%), radial-gradient(ellipse at 85% 15%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          display: 'flex',
        }} />

        {/* Top bar */}
        <div style={{
          position: 'absolute', top: '40px', left: '60px', right: '60px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px' }}>🌙</span>
            <span style={{ color: 'rgba(255,255,255,0.92)', fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px' }}>
              Ruyo.uz
            </span>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.18)',
            borderRadius: '100px',
            padding: '8px 22px',
            color: 'rgba(255,255,255,0.92)',
            fontSize: '17px',
            display: 'flex',
          }}>
            {badge}
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>
          <div style={{ fontSize: '110px', lineHeight: 1, filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.3))' }}>
            {emoji}
          </div>
          <div style={{
            color: '#ffffff',
            fontSize: `${fontSize}px`,
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: 1.22,
            maxWidth: '1000px',
            textShadow: '0 2px 24px rgba(0,0,0,0.25)',
            display: 'flex',
          }}>
            {title}
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          position: 'absolute', bottom: '40px',
          display: 'flex', alignItems: 'center', gap: '14px',
        }}>
          <div style={{ width: '48px', height: '2px', background: 'rgba(255,255,255,0.35)', display: 'flex' }} />
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '17px' }}>ruyo.uz</span>
          <div style={{ width: '48px', height: '2px', background: 'rgba(255,255,255,0.35)', display: 'flex' }} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // Same query → same image: let the CDN keep it instead of re-rendering per crawler
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable' },
      ...(fontData ? {
        fonts: [{ name: 'NotoSans', data: fontData, style: 'normal', weight: 700 }],
      } : {}),
    }
  );
}
