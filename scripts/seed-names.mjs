#!/usr/bin/env node
/**
 * seed-names.mjs  v2
 * Target: 5000+ names from Wikipedia + Wikidata.
 * Run: node scripts/seed-names.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// ── Config ────────────────────────────────────────────────────────────────────

function loadEnv() {
  try {
    const content = readFileSync('.env.local', 'utf8');
    const env = {};
    for (const line of content.split('\n')) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch { return {}; }
}

const env = loadEnv();
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// ── Helpers ───────────────────────────────────────────────────────────────────

const CYR_MAP = {
  'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z',
  'и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r',
  'с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh',
  'щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya',
};

function toSlug(name) {
  return name.toLowerCase()
    .split('').map(c => CYR_MAP[c] ?? (c.match(/[a-z0-9]/) ? c : '-')).join('')
    .replace(/-+/g, '-').replace(/^-|-$/g, '');
}

const ELEMENTS = {
  arabic:'Огонь', persian:'Воздух', uzbek:'Земля',
  turkic:'Земля', slavic:'Вода', hebrew:'Огонь',
  greek:'Огонь', latin:'Воздух', scandinavian:'Вода',
};

const ORIGIN_LABELS = {
  arabic:'арабское', persian:'персидское', uzbek:'узбекское',
  turkic:'тюркское', slavic:'славянское', hebrew:'еврейское',
  greek:'греческое', latin:'латинское', scandinavian:'скандинавское',
};

const CHAR_TPLS = [
  (n,m) => `${n} — человек с глубоким внутренним миром. Имя несёт смысл "${m}" и наделяет носителя силой духа и целеустремлённостью.`,
  (n,m) => `Носители имени ${n} отличаются яркой индивидуальностью. Этимология ("${m}") говорит об их природной мудрости и умении находить гармонию.`,
  (n,m) => `${n} — натура творческая и сильная. Значение "${m}" определяет их путь: они стремятся к совершенству и вдохновляют окружающих.`,
  (n,m) => `Имя ${n} означает "${m}". Люди с этим именем обладают природным обаянием, умом и способностью строить крепкие отношения.`,
];

function genChar(name, meaning) {
  return CHAR_TPLS[(name.charCodeAt(0) + name.length) % 4](name, meaning.slice(0, 80));
}

function genLucky(name) {
  const c = name.split('').reduce((a,x) => a + x.charCodeAt(0), 0);
  return [...new Set([(c%9)+1, ((c*7)%9)+1, ((c*13+3)%9)+1])].slice(0,3);
}

function stripHtml(s) {
  return s.replace(/<[^>]+>/g,' ')
    .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
    .replace(/&quot;/g,'"').replace(/&nbsp;/g,' ').replace(/&#\d+;/g,'')
    .replace(/\[\d+\]/g,'').replace(/\s+/g,' ').trim();
}

function isValidName(s) {
  if (!s || s.length < 2 || s.length > 40) return false;
  // Accept Cyrillic or Latin names (Uzbek uses Latin script)
  if (!/[А-Яа-яёA-Za-z]/.test(s)) return false;
  if (/^(Имя|Значение|Название|#|\d)/.test(s)) return false;
  return true;
}

function makeEntry(name, slug, gender, origin, meaning, source) {
  return {
    slug, name, gender, origin,
    meaning: meaning.slice(0, 500),
    character: genChar(name, meaning),
    lucky_numbers: genLucky(name),
    element: ELEMENTS[origin] || 'Огонь',
    compatible_names: [],
    popularity: 40 + (name.charCodeAt(0) % 30),
    source,
    status: 'approved',
  };
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Wikipedia parser ──────────────────────────────────────────────────────────

async function fetchWikiHtml(title) {
  const url = `https://ru.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&prop=text&format=json`;
  try {
    const r = await fetch(url, { headers: {'User-Agent':'RuyoUz/1.0'} });
    const d = await r.json();
    return d.parse?.text?.['*'] ?? '';
  } catch(e) { console.warn(`  Wiki failed "${title}":`, e.message); return ''; }
}

function parseWikiTable(html, origin, fallbackGender = 'male') {
  const names = []; const seen = new Set();
  const tableRe = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let tm;
  while ((tm = tableRe.exec(html)) !== null) {
    const rows = tm[1].split(/<tr[\s>]/i).slice(1);
    for (const row of rows) {
      const cells = []; const cellRe = /<td[^>]*>([\s\S]*?)<\/td>/gi; let cm;
      while ((cm = cellRe.exec(row)) !== null) cells.push(stripHtml(cm[1]));
      if (cells.length < 1) continue;
      const rawName = cells[0].trim();
      const rawMeaning = (cells[1] || '').trim();
      const rawGender = (cells[2] || fallbackGender).toLowerCase();
      if (!isValidName(rawName)) continue;
      const slug = toSlug(rawName); if (!slug || seen.has(slug)) continue; seen.add(slug);
      const gender = rawGender.includes('жен')||rawGender.includes('ж.') ? 'female' :
                     rawGender.includes('муж')||rawGender.includes('м.') ? 'male' : fallbackGender;
      const meaning = rawMeaning.length > 4 ? rawMeaning.slice(0,500)
        : `Традиционное ${ORIGIN_LABELS[origin]??''} имя`;
      names.push(makeEntry(rawName, slug, gender, origin, meaning, 'wikipedia'));
    }
  }
  return names;
}

// Also parse list format: * [[Name]] — meaning
function parseWikiList(html, origin, defaultGender) {
  const names = []; const seen = new Set();
  // Extract text links: >Name</a> followed by — meaning
  const re = /<a[^>]*>([А-Яа-яёA-Za-z][А-Яа-яёA-Za-z\s-]{1,38})<\/a>[^<—–\n]*[—–]\s*([^<\n]{5,200})/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const rawName = m[1].trim();
    if (!isValidName(rawName)) continue;
    const slug = toSlug(rawName); if (!slug || seen.has(slug)) continue; seen.add(slug);
    const meaning = stripHtml(m[2]).slice(0,500);
    names.push(makeEntry(rawName, slug, defaultGender, origin, meaning, 'wikipedia'));
  }
  return names;
}

// ── Wikidata ──────────────────────────────────────────────────────────────────

// Using wikibase:label service for better coverage (ru fallback to en)
async function queryWikidata(genderQid, langQid, limit = 1500) {
  const sparql = `
SELECT DISTINCT ?item ?itemLabel ?desc WHERE {
  ?item wdt:P31 wd:${genderQid} .
  ?item wdt:P407 wd:${langQid} .
  OPTIONAL { ?item schema:description ?desc . FILTER(LANG(?desc)="ru") }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "ru,en". }
}
LIMIT ${limit}`.trim();

  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;
  try {
    const r = await fetch(url, {
      headers: {
        'Accept':'application/sparql-results+json',
        'User-Agent':'RuyoUz/1.0 (https://ruyo.uz)',
      },
      signal: AbortSignal.timeout(55000),
    });
    if (!r.ok) { console.warn(`  WD ${r.status}`); return []; }
    return (await r.json()).results?.bindings ?? [];
  } catch(e) { console.warn('  WD error:', e.message); return []; }
}

function wdToNames(results, gender, origin) {
  const names = []; const seen = new Set();
  const genLabel = gender==='male' ? 'мужское' : 'женское';
  const origLabel = ORIGIN_LABELS[origin]??'';
  for (const b of results) {
    const rawName = b.itemLabel?.value?.trim();
    if (!rawName || rawName.startsWith('Q') || !isValidName(rawName)) continue;
    const slug = toSlug(rawName); if (!slug || seen.has(slug)) continue; seen.add(slug);
    const desc = b.desc?.value || '';
    const meaning = desc.length > 15 && !/^(имя|название)/i.test(desc)
      ? desc.slice(0,500)
      : `Традиционное ${origLabel} ${genLabel} имя`;
    names.push(makeEntry(rawName, slug, gender, origin, meaning, 'wikidata'));
  }
  return names;
}

// ── Insert ────────────────────────────────────────────────────────────────────

async function insertAll(names) {
  let total = 0;
  for (let i = 0; i < names.length; i += 300) {
    const batch = names.slice(i, i+300);
    const { error } = await sb.from('names').upsert(batch, { onConflict:'slug', ignoreDuplicates:true });
    if (error) { console.warn('  Insert err:', error.message); continue; }
    total += batch.length;
    process.stdout.write(`  ${total}/${names.length}\r`);
  }
  process.stdout.write('\n');
  return total;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  let grand = 0;

  // ─ Wikipedia pages ─
  const wikiPages = [
    { title: 'Список_арабских_имён',          origin: 'arabic' },
    { title: 'Список_еврейских_имён',          origin: 'hebrew' },
    { title: 'Список_греческих_имён',          origin: 'greek'  },
    { title: 'Список_латинских_имён',          origin: 'latin'  },
    { title: 'Список_скандинавских_имён',      origin: 'scandinavian' },
  ];

  for (const [i, p] of wikiPages.entries()) {
    console.log(`\n[Wiki ${i+1}/${wikiPages.length}] ${p.title}...`);
    const html = await fetchWikiHtml(p.title);
    const t = parseWikiTable(html, p.origin);
    const l = parseWikiList(html, p.origin, 'male');
    const combined = [...t, ...dedup(l, new Set(t.map(x=>x.slug)))];
    console.log(`  Table:${t.length} + List:${l.length} → ${combined.length}`);
    grand += await insertAll(combined);
    await sleep(400);
  }

  function dedup(arr, existingSlugs) {
    return arr.filter(x => !existingSlugs.has(x.slug));
  }

  // ─ Wikidata queries ─
  // Q12308941=male Q11879590=female
  // Q13955=Arabic Q9168=Persian Q7737=Russian Q9264=Uzbek Q256=Turkish
  // Q9288=Hebrew Q9129=Greek Q397=Latin Q9301=Scandinavian(Old Norse)
  const wdSources = [
    { gQid:'Q12308941', lQid:'Q13955', gender:'male',   origin:'arabic',       limit:2000 },
    { gQid:'Q11879590', lQid:'Q13955', gender:'female', origin:'arabic',       limit:2000 },
    { gQid:'Q12308941', lQid:'Q9168',  gender:'male',   origin:'persian',      limit:1500 },
    { gQid:'Q11879590', lQid:'Q9168',  gender:'female', origin:'persian',      limit:1500 },
    { gQid:'Q12308941', lQid:'Q7737',  gender:'male',   origin:'slavic',       limit:1500 },
    { gQid:'Q11879590', lQid:'Q7737',  gender:'female', origin:'slavic',       limit:1500 },
    { gQid:'Q12308941', lQid:'Q9264',  gender:'male',   origin:'uzbek',        limit:1000 },
    { gQid:'Q11879590', lQid:'Q9264',  gender:'female', origin:'uzbek',        limit:1000 },
    { gQid:'Q12308941', lQid:'Q256',   gender:'male',   origin:'turkic',       limit:1000 },
    { gQid:'Q11879590', lQid:'Q256',   gender:'female', origin:'turkic',       limit:1000 },
    { gQid:'Q12308941', lQid:'Q9288',  gender:'male',   origin:'hebrew',       limit:800  },
    { gQid:'Q11879590', lQid:'Q9288',  gender:'female', origin:'hebrew',       limit:800  },
    { gQid:'Q12308941', lQid:'Q9129',  gender:'male',   origin:'greek',        limit:800  },
    { gQid:'Q11879590', lQid:'Q9129',  gender:'female', origin:'greek',        limit:800  },
  ];

  for (const [i, s] of wdSources.entries()) {
    console.log(`\n[WD ${i+1}/${wdSources.length}] ${s.origin} ${s.gender} (limit ${s.limit})...`);
    const results = await queryWikidata(s.gQid, s.lQid, s.limit);
    const names = wdToNames(results, s.gender, s.origin);
    console.log(`  Raw:${results.length} → Valid:${names.length}`);
    grand += await insertAll(names);
    await sleep(800);
  }

  const { count } = await sb.from('names').select('*', { count:'exact', head:true });
  console.log(`\n✓ Session: ~${grand} | Total in DB: ${count}`);
}

main().catch(e => { console.error(e); process.exit(1); });
