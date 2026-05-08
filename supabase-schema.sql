-- Ruyo.uz Supabase Schema
-- Run this in Supabase SQL Editor

-- ══════════════════════════════════════════
-- NAMES
-- ══════════════════════════════════════════

create table if not exists names (
  id          bigint primary key generated always as identity,
  slug        text unique not null,
  name        text not null,
  gender      text not null check (gender in ('male','female','unisex')),
  origin      text not null check (origin in ('uzbek','arabic','persian','turkic','slavic','greek','latin','hebrew','scandinavian')),
  meaning     text not null,
  character   text not null,
  lucky_numbers integer[] not null default '{}',
  element     text not null,
  compatible_names text[] not null default '{}',
  popularity  integer not null default 50,
  source      text default 'static',   -- 'static' | 'ai' | 'user'
  status      text not null default 'approved' check (status in ('approved','pending','rejected')),
  created_at  timestamptz default now()
);

-- Name submissions (user-submitted names for moderation)
create table if not exists name_submissions (
  id          bigint primary key generated always as identity,
  name        text not null,
  gender      text not null,
  origin      text not null,
  meaning     text,
  character   text,
  source_url  text,
  notes       text,
  submitter_ip text,
  status      text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_at timestamptz,
  created_at  timestamptz default now()
);

-- ══════════════════════════════════════════
-- DREAMS
-- ══════════════════════════════════════════

create table if not exists dreams (
  id          bigint primary key generated always as identity,
  slug        text unique not null,
  title       text not null,
  letter      text not null,
  short       text not null,
  full_text   text not null,
  for_woman   text not null,
  for_man     text not null,
  by_day      jsonb not null default '{}',
  tags        text[] not null default '{}',
  related     text[] not null default '{}',
  source      text default 'static',
  status      text not null default 'approved',
  views       integer not null default 0,
  created_at  timestamptz default now()
);

-- ══════════════════════════════════════════
-- HOROSCOPES (dynamic weekly/monthly data)
-- ══════════════════════════════════════════

create table if not exists horoscope_content (
  id          bigint primary key generated always as identity,
  sign        text not null,
  period      text not null check (period in ('daily','weekly','monthly','yearly')),
  locale      text not null default 'ru',
  content     jsonb not null,
  valid_from  date not null,
  valid_to    date not null,
  created_at  timestamptz default now(),
  unique (sign, period, locale, valid_from)
);

-- ══════════════════════════════════════════
-- PERSONAL HOROSCOPES (user birth data)
-- ══════════════════════════════════════════

create table if not exists personal_horoscopes (
  id          bigint primary key generated always as identity,
  session_id  text not null,
  birth_date  date not null,
  birth_time  time,
  birth_city  text,
  gender      text,
  sun_sign    text not null,
  moon_sign   text,
  rising_sign text,
  reading     jsonb not null,
  locale      text default 'ru',
  created_at  timestamptz default now()
);

-- ══════════════════════════════════════════
-- INDEXES
-- ══════════════════════════════════════════

create index if not exists idx_names_origin on names(origin);
create index if not exists idx_names_gender on names(gender);
create index if not exists idx_names_status on names(status);
create index if not exists idx_dreams_letter on dreams(letter);
create index if not exists idx_dreams_status on dreams(status);
create index if not exists idx_horoscope_sign_period on horoscope_content(sign, period, locale);
create index if not exists idx_name_submissions_status on name_submissions(status);

-- ══════════════════════════════════════════
-- RLS POLICIES
-- ══════════════════════════════════════════

alter table names enable row level security;
alter table dreams enable row level security;
alter table name_submissions enable row level security;
alter table horoscope_content enable row level security;
alter table personal_horoscopes enable row level security;

-- Public can read approved content
drop policy if exists "Public read names" on names;
create policy "Public read names" on names for select using (status = 'approved');

drop policy if exists "Public read dreams" on dreams;
create policy "Public read dreams" on dreams for select using (status = 'approved');

drop policy if exists "Public read horoscopes" on horoscope_content;
create policy "Public read horoscopes" on horoscope_content for select using (true);

-- Anyone can submit a name
drop policy if exists "Public insert name submissions" on name_submissions;
create policy "Public insert name submissions" on name_submissions for insert with check (true);

-- Anyone can insert personal horoscope sessions
drop policy if exists "Public insert personal horoscopes" on personal_horoscopes;
create policy "Public insert personal horoscopes" on personal_horoscopes for insert with check (true);

drop policy if exists "Public read own personal horoscopes" on personal_horoscopes;
create policy "Public read own personal horoscopes" on personal_horoscopes for select using (true);
