#!/usr/bin/env node
/**
 * scrape-names.mjs v2
 * Phase 1: kakzovut.ru/musulmanskie-imena.html — Muslim names (arabic, persian, turkic, hebrew)
 * Phase 2: kp.ru/family/deti/znachenie-imeni/ — Russian names (slavic, greek, latin, scandinavian)
 * Run: node scripts/scrape-names.mjs
 * Options: --dry (no DB write)  --phase=1  --phase=2  --limit=500
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, existsSync } from 'fs';

// ── Config ────────────────────────────────────────────────────────────────────

function loadEnv() {
  const c = readFileSync('.env.local', 'utf8');
  const e = {};
  for (const l of c.split('\n')) { const i = l.indexOf('='); if (i>0) e[l.slice(0,i).trim()]=l.slice(i+1).trim(); }
  return e;
}
const env = loadEnv();
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const DRY   = process.argv.includes('--dry');
const PHASE = process.argv.find(a=>a.startsWith('--phase='))?.split('=')[1];
const LIMIT = parseInt(process.argv.find(a=>a.startsWith('--limit='))?.split('=')[1] ?? '99999');
const DELAY = 1200; // ms — kakzovut.ru has CAPTCHA protection, needs slow crawl

const CACHE1 = 'scripts/.kakzovut-urls.json';
const CACHE2 = 'scripts/.kp-urls.json';

// ── Origin map ────────────────────────────────────────────────────────────────

const ORIGIN_KEYS = [
  // Slavic first — most common for kp.ru Russian names
  ['древнерусск','slavic'],['древнеславянск','slavic'],['старославянск','slavic'],
  ['общеславянск','slavic'],['праславянск','slavic'],['славянск','slavic'],
  ['украинск','slavic'],['польск','slavic'],['чешск','slavic'],['белорусск','slavic'],
  // Greek / Latin — frequent
  ['древнегреч','greek'],['греческ','greek'],
  ['латинск','latin'],
  // Germanic / Scandinavian
  ['германск','scandinavian'],['немецк','scandinavian'],['скандинавск','scandinavian'],
  ['норвежск','scandinavian'],['шведск','scandinavian'],['датск','scandinavian'],
  ['финск','scandinavian'],
  // Hebrew
  ['древнееврейск','hebrew'],['еврейск','hebrew'],['иудейск','hebrew'],['иврит','hebrew'],
  // Arabic / Persian / Turkic
  ['арабск','arabic'],
  ['персидск','persian'],['иранск','persian'],
  ['тюркск','turkic'],['турецк','turkic'],['узбекск','uzbek'],
  ['татарск','turkic'],['башкирск','turkic'],['казахск','turkic'],['монгольск','turkic'],
];

function mapOrigin(text='') {
  const lower = text.toLowerCase();
  for (const [key, val] of ORIGIN_KEYS) {
    if (lower.includes(key)) return val;
  }
  return null;
}

// For kp.ru: extract primary origin from "переводе с X", "пришло из X языка", "имеет X происхождение"
function mapOriginKp(text='') {
  const lower = text.toLowerCase();
  // Primary pattern: "в переводе с [X] языка" / "из [X] языка" / "[X] происхождения"
  const primaryM = /(?:переводе\s+с|пришло\s+из|пришло\s+в\s+\S+\s+из|имеет)\s+([\wА-Яа-яё]+(?:ого|ого)?)\s+(?:языка|происхождени)/i.exec(lower);
  if (primaryM) {
    const found = mapOrigin(primaryM[1]);
    if (found) return found;
  }
  // Fallback: first keyword match
  return mapOrigin(lower);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const CYR = {'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'};
function toSlug(n) {
  return n.toLowerCase().split('').map(c=>CYR[c]??(c.match(/[a-z0-9]/)?c:'-')).join('').replace(/-+/g,'-').replace(/^-|-$/g,'');
}

const ELEM = {arabic:'Огонь',persian:'Воздух',uzbek:'Земля',turkic:'Земля',slavic:'Вода',hebrew:'Огонь',greek:'Огонь',latin:'Воздух',scandinavian:'Вода'};
const CHAR_T = [
  (n,m)=>`${n} — человек с глубоким внутренним миром. Имя несёт смысл «${m}» и наделяет носителя силой духа и целеустремлённостью.`,
  (n,m)=>`Носители имени ${n} обладают природной мудростью. Этимология («${m}») говорит об их особом магнетизме и умении вдохновлять окружающих.`,
  (n,m)=>`${n} — натура творческая и сильная. Значение «${m}» определяет их жизненный путь: стремление к совершенству и гармонии.`,
  (n,m)=>`Имя ${n} означает «${m}». Такие люди обладают обаянием, умом и способностью строить крепкие отношения.`,
];
function genChar(name, meaning) { return CHAR_T[(name.charCodeAt(0)+name.length)%4](name, meaning.slice(0,80)); }
function genLucky(n) { const c=n.split('').reduce((a,x)=>a+x.charCodeAt(0),0); return [...new Set([(c%9)+1,((c*7)%9)+1,((c*13+3)%9)+1])].slice(0,3); }

function sleep(ms) { return new Promise(r=>setTimeout(r,ms)); }

const UA_LIST = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
];
let uaIdx = 0;
function nextUA() { return UA_LIST[uaIdx++ % UA_LIST.length]; }

async function get(url, referer='') {
  const headers = {
    'User-Agent': nextUA(),
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': referer ? 'same-origin' : 'none',
    'Cache-Control': 'max-age=0',
  };
  if (referer) headers['Referer'] = referer;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
      if (!r.ok) return '';
      const text = await r.text();
      if (text.length < 3000 && /captcha|подтвердите|введите код|робот/i.test(text)) {
        if (attempt === 0) { await sleep(6000); continue; } // retry after 6s
        return '__CAPTCHA__';
      }
      return text;
    } catch { return ''; }
  }
  return '';
}

function stripTags(s) {
  return s.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'')
    .replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&#\d+;/g,'').replace(/\s+/g,' ').trim();
}

// Extract all <p> text blocks from HTML, filtered by min length
function extractParas(html, minLen=60) {
  const re = /<p[^>]*>([\s\S]{30,2000}?)<\/p>/gi;
  const result = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    const t = stripTags(m[1]);
    if (t.length >= minLen) result.push(t);
  }
  return result;
}

// ── kakzovut.ru ───────────────────────────────────────────────────────────────

async function collectKakzovutGender() {
  const mHtml = await get('https://kakzovut.ru/man.html', 'https://kakzovut.ru/');
  await sleep(DELAY);
  const fHtml = await get('https://kakzovut.ru/woman.html', 'https://kakzovut.ru/');
  const male = new Set();
  const female = new Set();
  for (const m of (mHtml.match(/href="\/names\/([a-z0-9-]+)\.html"/g) ?? [])) {
    male.add(m.match(/\/names\/([a-z0-9-]+)\.html/)[1]);
  }
  for (const m of (fHtml.match(/href="\/names\/([a-z0-9-]+)\.html"/g) ?? [])) {
    female.add(m.match(/\/names\/([a-z0-9-]+)\.html/)[1]);
  }
  return { male, female };
}

async function collectKakzovutSlugs() {
  const html = await get('https://kakzovut.ru/musulmanskie-imena.html');
  const seen = new Set();
  const slugs = [];
  for (const m of (html.match(/href="\/names\/([a-z0-9-]+)\.html"/g) ?? [])) {
    const slug = m.match(/\/names\/([a-z0-9-]+)\.html/)[1];
    if (!seen.has(slug)) { seen.add(slug); slugs.push(slug); }
  }
  return slugs;
}

async function parseKakzovutPage(slug, genderMap) {
  const html = await get(`https://kakzovut.ru/names/${slug}.html`, 'https://kakzovut.ru/musulmanskie-imena.html');
  if (!html || html === '__CAPTCHA__') {
    if (html === '__CAPTCHA__') { console.warn(`\n  [CAPTCHA] ${slug} — waiting 12s`); await sleep(12000); }
    return null;
  }

  // Name from h1
  const h1m = /<h1[^>]*itemprop[^>]*>Значение имени ([^<]{2,50})<\/h1>/i.exec(html);
  if (!h1m) return null;
  const rawName = stripTags(h1m[1]).trim();
  if (!rawName || !/[А-Яа-яёЁ]/.test(rawName)) return null;

  // Article body (between <article> tags or fallback to maincontent)
  const artM = /<article[^>]*>([\s\S]{100,12000}?)<\/article>/i.exec(html)
    ?? /<div[^>]*maincontent[^>]*>([\s\S]{100,12000}?)<\/div>/i.exec(html);
  if (!artM) return null;
  const artHtml = artM[1];
  const artText = stripTags(artHtml);

  // Origin: from article text — try structured patterns first, then keyword scan
  const origStructM = /имеет\s+([\wА-Яа-яёЁ]+(?:\s+[\wА-Яа-яёЁ]+)?)\s+происхождение/i.exec(artText)
    ?? /происхождение[^.]{0,30}(?:имя\s+)?([\wА-Яа-яёЁ]+(?:\s+[\wА-Яа-яёЁ]+)?)\s*(?:\.|,)/i.exec(artText);
  const origin = origStructM ? (mapOrigin(origStructM[1]) ?? mapOrigin(artText)) : mapOrigin(artText);
  if (!origin) return null;

  // Meaning: look for quoted meaning «...» first; else 2nd meaningful paragraph
  const paras = extractParas(artHtml, 60);
  let meaning = null;
  for (const p of paras) {
    const qm = /«([^»]{8,200})»/.exec(p);
    if (qm && !p.startsWith('Синоним')) { meaning = qm[1]; break; }
  }
  if (!meaning) {
    const subst = paras.filter(p => p.length > 100 && !p.includes('Синоним') && !p.includes('мусульманское'));
    meaning = subst[0]?.slice(0, 1000) ?? null;
  }
  if (!meaning || meaning.length < 8) return null;

  // Character: paragraphs about traits (skip synonyms, origin, family details, professions)
  const charSkip = /синоним|происхождение|именин|вариац|в переводе|двусоставн|версий|форм[ао] имени/i;
  const charParas = paras.filter(p => p.length > 100 && !charSkip.test(p));
  const character = charParas.slice(0, 3).join(' ').slice(0, 2000) || genChar(rawName, meaning);

  // Gender: from gender map first, then text signals
  let gender = genderMap.male.has(slug) ? 'male' : genderMap.female.has(slug) ? 'female' : null;
  if (!gender) {
    gender = /носительница|обладательница|эт[оа]й?\s+женщин|является\s+женским/i.test(artText) ? 'female' : 'male';
  }

  const nameSlug = toSlug(rawName);
  if (!nameSlug) return null;

  return {
    slug: nameSlug, name: rawName, gender, origin,
    meaning: meaning.slice(0, 500),
    character,
    lucky_numbers: genLucky(rawName),
    element: ELEM[origin],
    compatible_names: [],
    popularity: 45 + (rawName.charCodeAt(0) % 25),
    source: 'kakzovut.ru',
    status: 'approved',
  };
}

// ── kp.ru ─────────────────────────────────────────────────────────────────────

async function collectKpUrls() {
  const html = await get('https://www.kp.ru/family/deti/znachenie-imeni/');
  const seen = new Set();
  const urls = [];
  const re = /"(https:\/\/www\.kp\.ru\/family\/deti\/znachenie-imeni-[a-z0-9-]+\/)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (!seen.has(m[1])) { seen.add(m[1]); urls.push(m[1]); }
  }
  return urls;
}

async function parseKpPage(url) {
  const html = await get(url);
  if (!html) return null;

  // Name from h1
  const h1m = /<h1[^>]*article__title[^>]*>\s*(?:Значение\s+имени\s+)?([А-Яа-яёЁ][^<]{1,40}?)\s*<\/h1>/i.exec(html)
    ?? /<h1[^>]*>([^<]{2,50}?)<\/h1>/i.exec(html);
  if (!h1m) return null;
  let rawName = stripTags(h1m[1]).replace(/^значение\s+имени\s+/i, '').trim();
  if (!rawName || !/[А-Яа-яёЁ]/.test(rawName)) return null;

  // Short description
  const descM = /class="article__description"[^>]*>([\s\S]{20,600}?)<\/div>/i.exec(html);
  const desc = descM ? stripTags(descM[1]).trim() : '';

  // All <p data-c> paragraphs (main article content on kp.ru)
  const dataCParas = [...html.matchAll(/<p\s+data-c\d+[^>]*>([\s\S]{40,1500}?)<\/p>/g)]
    .map(m => stripTags(m[1])).filter(p => p.length > 50);

  // Origin: search description first with primary patterns, then all paras
  const originText = [desc, ...dataCParas].join(' ');
  const origin = mapOriginKp(originText);
  if (!origin) return null;

  // Meaning: description first, else first data-c para
  const meaning = (desc.length > 15 ? desc : dataCParas[0]) ?? null;
  if (!meaning || meaning.length < 15) return null;

  // Character: 2nd or 3rd data-c paragraph (skip the one with meaning/origin)
  const charParas = dataCParas.filter(p =>
    p.length > 80 && !/происхождени|производн|уменьшительн|сокращённ|сокращенн/i.test(p)
  );
  const character = charParas[1] ?? charParas[0] ?? genChar(rawName, meaning);

  // Gender from text
  const isFemale = /носительница|обладательница|женское\s+имя|она\s+(?:умеет|обладает|любит|стремится|является)|её\s+(?:характер|жизнь)/i.test(html.slice(0, 20000));
  const gender = isFemale ? 'female' : 'male';

  const slug = toSlug(rawName);
  if (!slug) return null;

  return {
    slug, name: rawName, gender, origin,
    meaning: meaning.slice(0, 1000),
    character: character.slice(0, 2000),
    lucky_numbers: genLucky(rawName),
    element: ELEM[origin],
    compatible_names: [],
    popularity: 45 + (rawName.charCodeAt(0) % 25),
    source: 'kp.ru',
    status: 'approved',
  };
}

// ── Supabase insert ───────────────────────────────────────────────────────────

async function upsertBatch(rows) {
  if (!rows.length || DRY) return rows.length;
  const { error } = await sb.from('names').upsert(rows, { onConflict:'slug', ignoreDuplicates:false });
  if (error) { console.warn('  DB error:', error.message); return 0; }
  return rows.length;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function phase1() {
  console.log('\n═══ Phase 1: kakzovut.ru (Muslim names) ═══');

  let slugs;
  if (existsSync(CACHE1)) {
    slugs = JSON.parse(readFileSync(CACHE1, 'utf8'));
    console.log(`Loaded ${slugs.length} slugs from cache`);
  } else {
    console.log('Collecting slugs from /musulmanskie-imena.html...');
    slugs = await collectKakzovutSlugs();
    writeFileSync(CACHE1, JSON.stringify(slugs));
    console.log(`Found ${slugs.length} slugs, saved to cache`);
    await sleep(DELAY);
  }

  console.log('Loading gender lists...');
  const genderMap = await collectKakzovutGender();
  console.log(`  male: ${genderMap.male.size}  female: ${genderMap.female.size}`);
  await sleep(DELAY);

  const limited = slugs.slice(0, LIMIT);
  console.log(`\nFetching ${limited.length} name pages...`);

  let done = 0, inserted = 0, skipped = 0;
  const batch = [];

  for (const slug of limited) {
    const entry = await parseKakzovutPage(slug, genderMap);
    if (entry) batch.push(entry); else skipped++;
    done++;
    if (batch.length >= 50) {
      inserted += await upsertBatch(batch);
      batch.length = 0;
      process.stdout.write(`  ${done}/${limited.length} fetched, ${inserted} saved, ${skipped} skipped\r`);
    }
    await sleep(DELAY);
  }
  if (batch.length) inserted += await upsertBatch(batch);
  process.stdout.write(`\n  Done: ${inserted} names from kakzovut.ru (${skipped} skipped)\n`);
}

async function phase2() {
  console.log('\n═══ Phase 2: kp.ru (Russian names) ═══');

  let urls;
  if (existsSync(CACHE2)) {
    urls = JSON.parse(readFileSync(CACHE2, 'utf8'));
    console.log(`Loaded ${urls.length} URLs from cache`);
  } else {
    console.log('Collecting URLs from /family/deti/znachenie-imeni/...');
    urls = await collectKpUrls();
    writeFileSync(CACHE2, JSON.stringify(urls));
    console.log(`Found ${urls.length} URLs, saved to cache`);
    await sleep(DELAY);
  }

  const limited = urls.slice(0, LIMIT);
  console.log(`\nFetching ${limited.length} name pages...`);

  let done = 0, inserted = 0, skipped = 0;
  const batch = [];

  for (const url of limited) {
    const entry = await parseKpPage(url);
    if (entry) batch.push(entry); else skipped++;
    done++;
    if (batch.length >= 50) {
      inserted += await upsertBatch(batch);
      batch.length = 0;
      process.stdout.write(`  ${done}/${limited.length} fetched, ${inserted} saved, ${skipped} skipped\r`);
    }
    await sleep(DELAY);
  }
  if (batch.length) inserted += await upsertBatch(batch);
  process.stdout.write(`\n  Done: ${inserted} names from kp.ru (${skipped} skipped)\n`);
}

async function main() {
  if (DRY) console.log('[DRY RUN]');
  if (!PHASE || PHASE === '1') await phase1();
  if (!PHASE || PHASE === '2') await phase2();

  const { count } = await sb.from('names').select('*', { count:'exact', head:true });
  console.log(`\n✓ Total in DB: ${count}`);
}

main().catch(e => { console.error(e); process.exit(1); });
