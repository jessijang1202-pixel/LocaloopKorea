-- ============================================================
-- Localoop Korea — Supabase Postgres Schema
-- Version: 1.0 MVP
--
-- Run order:
--   1. Enums
--   2. Tables (dependency order)
--   3. Triggers
--   4. Indexes
--   5. Row Level Security
--   6. Seed data
--
-- Run in Supabase SQL Editor (dashboard.supabase.com → SQL Editor)
-- ============================================================


-- ── EXTENSIONS ───────────────────────────────────────────────
-- gen_random_uuid() is available by default in Supabase
-- pgcrypto only needed if on older Postgres
-- create extension if not exists "pgcrypto";


-- ── ENUMS ────────────────────────────────────────────────────

create type user_type_enum as enum ('foreigner', 'korean');

create type reservation_difficulty_enum as enum ('easy', 'moderate', 'hard');

create type connection_status_enum as enum ('pending', 'accepted', 'declined');

create type meetup_status_enum as enum ('open', 'full', 'cancelled', 'completed');

create type participant_status_enum as enum ('confirmed', 'cancelled');

create type saved_item_type_enum as enum (
  'place', 'guide', 'meetup', 'restaurant', 'menu'
);

create type guide_difficulty_enum as enum (
  'beginner', 'intermediate', 'advanced'
);


-- ── REGIONS ──────────────────────────────────────────────────
-- Reference table. Small, static, seeded at deploy.
-- city column allows future city-level filtering.

create table if not exists regions (
  id             uuid        primary key default gen_random_uuid(),
  name_ko        text        not null,
  name_en        text        not null,
  slug           text        not null unique,
  city           text,
  description_en text,
  description_ko text,
  -- Future: lat numeric(10,7), lng numeric(10,7) for map center
  -- Future: cover_image_url text
  -- Future: parent_region_id uuid references regions(id)
  created_at     timestamptz not null default now()
);

comment on table regions is
  'Geographic regions used for filtering content and matching users. Seeded at deploy.';


-- ── INTERESTS ─────────────────────────────────────────────────
-- Reference table for user interest tags.
-- category groups interests for display in onboarding UI.

create table if not exists interests (
  id       uuid primary key default gen_random_uuid(),
  name_ko  text not null,
  name_en  text not null,
  slug     text not null unique,
  icon     text,            -- emoji, e.g. '🍜'
  category text             -- 'lifestyle' | 'outdoor' | 'social' | 'learning' | 'arts'
  -- Future: display_order int for controlled sort
  -- Future: is_active boolean default true for soft disable
);

comment on table interests is
  'Interest tags users select during onboarding. Seeded, admin-managed.';


-- ── PROFILES ──────────────────────────────────────────────────
-- 1:1 with auth.users. Created by trigger on signup.
-- id matches auth.users(id) exactly — no separate FK lookup needed.

create table if not exists profiles (
  id              uuid        primary key references auth.users(id) on delete cascade,
  display_name    text        not null default '',
  avatar_url      text,
  bio             text,
  user_type       user_type_enum not null default 'foreigner',
  nationality     text,
  languages       text[]      not null default '{}',  -- spoken languages, e.g. {en, ko, ja}
  language_goal   text,                               -- free text learning goal
  region_id       uuid        references regions(id) on delete set null,
  onboarding_done boolean     not null default false,
  -- Future: username text unique
  -- Future: verified boolean default false
  -- Future: premium_until timestamptz
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table profiles is
  'Public user profile. Auto-created by trigger when auth.users row is inserted.';
comment on column profiles.onboarding_done is
  'Checked by middleware to redirect new users through the onboarding wizard.';
comment on column profiles.languages is
  'Array of BCP-47 language codes the user speaks, e.g. {en, ko}.';


-- ── USER_INTERESTS ─────────────────────────────────────────────
-- Thin many-to-many join. No extra columns needed at MVP.

create table if not exists user_interests (
  user_id     uuid not null references profiles(id) on delete cascade,
  interest_id uuid not null references interests(id) on delete cascade,
  primary key (user_id, interest_id)
);

comment on table user_interests is
  'Many-to-many join between profiles and interests. Set during onboarding.';


-- ── PLACES ────────────────────────────────────────────────────
-- Core discovery content. The three boolean columns are the
-- primary foreigner-friendliness filters and intentionally
-- sit here (not in place_tags) for index efficiency.

create table if not exists places (
  id                     uuid        primary key default gen_random_uuid(),
  name_ko                text        not null,
  name_en                text        not null,
  slug                   text        not null unique,
  description_ko         text,
  description_en         text,
  category               text        not null,  -- 'cafe'|'restaurant'|'bar'|'market'|'activity'|'shopping'|'health'
  region_id              uuid        references regions(id) on delete set null,
  address                text,
  lat                    numeric(10,7),          -- ready for PostGIS migration
  lng                    numeric(10,7),
  image_url              text,
  english_support        boolean     not null default false,
  card_payment           boolean     not null default true,
  solo_friendly          boolean     not null default true,
  reservation_difficulty reservation_difficulty_enum,
  -- Future: operating_hours jsonb
  -- Future: price_level int check (price_level between 1 and 4)
  -- Future: verified_at timestamptz
  -- Future: submitted_by uuid references profiles(id)
  created_at             timestamptz not null default now()
);

comment on table places is
  'Foreigner-friendly places. Seeded, expandable via admin. Indexed for region + category + boolean filter combos.';
comment on column places.english_support is
  'Staff can communicate in English. Primary filter for foreigner users.';
comment on column places.lat is
  'Numeric lat/lng — ready for ST_DWithin once PostGIS is added.';


-- ── PLACE_TAGS ────────────────────────────────────────────────
-- Flexible labels separate from the boolean columns on places.
-- Boolean columns = primary filters. Tags = everything else.

create table if not exists place_tags (
  id       uuid primary key default gen_random_uuid(),
  place_id uuid not null references places(id) on delete cascade,
  tag_en   text not null,
  tag_ko   text
);

comment on table place_tags is
  'Flexible text tags on places. Separate from places boolean columns which drive primary filtering.';


-- ── GUIDES ────────────────────────────────────────────────────
-- Editorial life guides for foreigners. Markdown body text.
-- Not user-generated in MVP — admin/seed content only.

create table if not exists guides (
  id         uuid                 primary key default gen_random_uuid(),
  title_ko   text                 not null,
  title_en   text                 not null,
  slug       text                 not null unique,
  body_ko    text,                              -- Markdown
  body_en    text,                              -- Markdown
  category   text                 not null,     -- 'dining'|'transportation'|'social'|'daily_life'|'admin'|'language'
  difficulty guide_difficulty_enum,
  image_url  text,
  tags       text[]               not null default '{}',
  -- Future: author_id uuid references profiles(id) for UGC guides
  -- Future: view_count int default 0
  -- Future: updated_at timestamptz
  created_at timestamptz          not null default now()
);

comment on table guides is
  'Life guidance articles for foreigners. Markdown body. GIN index on tags for fast containment queries.';


-- ── RESTAURANTS ───────────────────────────────────────────────
-- Parent for menu items. Exists independently from places —
-- a restaurant can appear in food discovery without a places entry.

create table if not exists restaurants (
  id             uuid        primary key default gen_random_uuid(),
  name_ko        text        not null,
  name_en        text        not null,
  slug           text        not null unique,
  description_en text,
  description_ko text,
  region_id      uuid        references regions(id) on delete set null,
  category       text,       -- 'korean_bbq'|'noodles'|'seafood'|'cafe'|'fusion' etc.
  image_url      text,
  address        text,
  -- Future: place_id uuid references places(id) to link to place card
  -- Future: michelin_stars int
  created_at     timestamptz not null default now()
);

comment on table restaurants is
  'Restaurant parent records for menu discovery. Can exist without a corresponding places row.';


-- ── MENUS ─────────────────────────────────────────────────────
-- Individual dish records. The how_to_order_en and local_tip_en
-- columns are the core value-add for foreign users.

create table if not exists menus (
  id              uuid        primary key default gen_random_uuid(),
  restaurant_id   uuid        not null references restaurants(id) on delete cascade,
  name_ko         text        not null,
  name_en         text        not null,
  slug            text        not null unique,
  description_en  text,
  description_ko  text,
  spice_level     int         check (spice_level between 0 and 5),  -- 0=none 5=extreme
  price_range     text,       -- text for display flexibility, e.g. '₩11,000–13,000'
  how_to_order_en text,       -- key foreigner value: how to say/point/order
  local_tip_en    text,       -- insider context: what locals actually do
  image_url       text,
  vegetarian      boolean     not null default false,
  -- Future: vegan boolean, gluten_free boolean, halal boolean
  -- Future: seasonal boolean + available_from/until dates
  created_at      timestamptz not null default now()
);

comment on table menus is
  'Dish-level records within a restaurant. how_to_order_en and local_tip_en are core foreigner value.';
comment on column menus.price_range is
  'Text range for display — honest about approximation. Add price_min/max int columns if price filtering is needed.';


-- ── MEETUPS ───────────────────────────────────────────────────
-- User-created community events. current_count is denormalized
-- and maintained by trigger to avoid COUNT(*) on list queries.

create table if not exists meetups (
  id               uuid              primary key default gen_random_uuid(),
  title            text              not null,
  description      text,
  host_id          uuid              references profiles(id) on delete set null,
  region_id        uuid              references regions(id) on delete set null,
  location_name    text,
  scheduled_at     timestamptz       not null,
  max_participants int               not null default 10 check (max_participants > 0),
  current_count    int               not null default 0 check (current_count >= 0),
  tags             text[]            not null default '{}',
  language_tags    text[]            not null default '{}',
  image_url        text,
  status           meetup_status_enum not null default 'open',
  -- Future: recurring_rule text (RRULE format)
  -- Future: external_link text (Discord/Eventbrite)
  -- Future: cancelled_reason text
  created_at       timestamptz       not null default now()
);

comment on table meetups is
  'User-created community events. current_count is trigger-maintained to avoid subquery on list renders.';
comment on column meetups.host_id is
  'SET NULL on profile delete — meetup history persists even if host leaves the platform.';
comment on column meetups.language_tags is
  'Languages spoken at this event. Separate from general tags — it is a primary filter.';


-- ── MEETUP_PARTICIPANTS ────────────────────────────────────────
-- INSERT triggers current_count increment.
-- DELETE triggers current_count decrement + status reopen if was full.

create table if not exists meetup_participants (
  meetup_id  uuid                    not null references meetups(id) on delete cascade,
  user_id    uuid                    not null references profiles(id) on delete cascade,
  joined_at  timestamptz             not null default now(),
  status     participant_status_enum not null default 'confirmed',
  -- Future: waitlist_position int
  -- Future: checked_in_at timestamptz
  -- Future: role text default 'attendee' for co-host
  primary key (meetup_id, user_id)
);

comment on table meetup_participants is
  'One row per user per meetup. Triggers on this table maintain meetups.current_count.';


-- ── CONNECTIONS ───────────────────────────────────────────────
-- Directional request model. Connection = accepted row.
-- Query "all my connections": WHERE (requester_id = me OR recipient_id = me)
--   AND status = 'accepted'

create table if not exists connections (
  id           uuid                  primary key default gen_random_uuid(),
  requester_id uuid                  not null references profiles(id) on delete cascade,
  recipient_id uuid                  not null references profiles(id) on delete cascade,
  status       connection_status_enum not null default 'pending',
  -- Future: message text for connection request note
  -- Future: updated_at timestamptz
  created_at   timestamptz           not null default now(),
  unique (requester_id, recipient_id),
  check (requester_id <> recipient_id)  -- prevent self-connections
);

comment on table connections is
  'Directional connection requests. Accepted rows represent mutual connections. Unique constraint prevents duplicate requests.';


-- ── SAVED_ITEMS ───────────────────────────────────────────────
-- Polymorphic bookmark table. item_id has no FK (references
-- multiple tables) — handle stale references at app layer.

create table if not exists saved_items (
  id         uuid                primary key default gen_random_uuid(),
  user_id    uuid                not null references profiles(id) on delete cascade,
  item_type  saved_item_type_enum not null,
  item_id    uuid                not null,   -- no FK — polymorphic reference
  created_at timestamptz         not null default now(),
  unique (user_id, item_type, item_id)
);

comment on table saved_items is
  'Universal bookmark table. item_id is polymorphic — no FK constraint. Handle stale refs at app layer.';


-- ── TRIGGERS ──────────────────────────────────────────────────

-- 1. Auto-create profile on auth.users insert

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'display_name',
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();


-- 2. Auto-update profiles.updated_at

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on profiles;
create trigger profiles_set_updated_at
  before update on profiles
  for each row execute procedure set_updated_at();


-- 3. Maintain meetups.current_count + auto-update status

create or replace function update_meetup_participant_count()
returns trigger
language plpgsql
as $$
begin
  if TG_OP = 'INSERT' then
    update meetups
    set
      current_count = current_count + 1,
      status = case
        when (current_count + 1) >= max_participants then 'full'::meetup_status_enum
        else status
      end
    where id = new.meetup_id;

  elsif TG_OP = 'DELETE' then
    update meetups
    set
      current_count = greatest(0, current_count - 1),
      status = case
        when status = 'full'::meetup_status_enum
             and greatest(0, current_count - 1) < max_participants
        then 'open'::meetup_status_enum
        else status
      end
    where id = old.meetup_id;
  end if;

  return null;  -- AFTER trigger, return value ignored
end;
$$;

drop trigger if exists on_participant_change on meetup_participants;
create trigger on_participant_change
  after insert or delete on meetup_participants
  for each row execute procedure update_meetup_participant_count();


-- ── INDEXES ───────────────────────────────────────────────────

-- profiles
create index if not exists idx_profiles_region_id
  on profiles(region_id);
create index if not exists idx_profiles_user_type
  on profiles(user_type);
create index if not exists idx_profiles_onboarding_pending
  on profiles(onboarding_done)
  where onboarding_done = false;

-- places
create index if not exists idx_places_region_id
  on places(region_id);
create index if not exists idx_places_category
  on places(category);
create index if not exists idx_places_english_support
  on places(english_support)
  where english_support = true;
create index if not exists idx_places_region_category
  on places(region_id, category);

-- guides
create index if not exists idx_guides_category
  on guides(category);
create index if not exists idx_guides_difficulty
  on guides(difficulty);
create index if not exists idx_guides_tags_gin
  on guides using gin(tags);

-- restaurants
create index if not exists idx_restaurants_region_id
  on restaurants(region_id);

-- meetups (most query-intensive table)
create index if not exists idx_meetups_region_id
  on meetups(region_id);
create index if not exists idx_meetups_scheduled_at
  on meetups(scheduled_at);
create index if not exists idx_meetups_status
  on meetups(status);
create index if not exists idx_meetups_host_id
  on meetups(host_id);
create index if not exists idx_meetups_region_status_date
  on meetups(region_id, status, scheduled_at);
create index if not exists idx_meetups_language_tags_gin
  on meetups using gin(language_tags);

-- meetup_participants
create index if not exists idx_participants_user_id
  on meetup_participants(user_id);

-- connections
create index if not exists idx_connections_requester
  on connections(requester_id, status);
create index if not exists idx_connections_recipient
  on connections(recipient_id, status);

-- saved_items
create index if not exists idx_saved_user_type
  on saved_items(user_id, item_type);
create index if not exists idx_saved_lookup
  on saved_items(user_id, item_type, item_id);

-- user_interests
create index if not exists idx_user_interests_user_id
  on user_interests(user_id);
create index if not exists idx_user_interests_interest_id
  on user_interests(interest_id);


-- ── ROW LEVEL SECURITY ────────────────────────────────────────

-- Public read: content tables (no auth required to browse)
alter table regions     enable row level security;
alter table interests   enable row level security;
alter table places      enable row level security;
alter table place_tags  enable row level security;
alter table guides      enable row level security;
alter table restaurants enable row level security;
alter table menus       enable row level security;

create policy "public_read" on regions     for select using (true);
create policy "public_read" on interests   for select using (true);
create policy "public_read" on places      for select using (true);
create policy "public_read" on place_tags  for select using (true);
create policy "public_read" on guides      for select using (true);
create policy "public_read" on restaurants for select using (true);
create policy "public_read" on menus       for select using (true);

-- Profiles: public read, owner update only
-- No INSERT policy — handled by trigger on auth.users
alter table profiles enable row level security;

create policy "profiles_public_read"
  on profiles for select
  using (true);

create policy "profiles_owner_update"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- User interests: public read, owner manages
alter table user_interests enable row level security;

create policy "user_interests_public_read"
  on user_interests for select
  using (true);

create policy "user_interests_owner_write"
  on user_interests for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Meetups: public read, auth create, host update/delete
alter table meetups enable row level security;

create policy "meetups_public_read"
  on meetups for select
  using (true);

create policy "meetups_auth_insert"
  on meetups for insert
  with check (auth.uid() = host_id);

create policy "meetups_host_update"
  on meetups for update
  using (auth.uid() = host_id);

create policy "meetups_host_delete"
  on meetups for delete
  using (auth.uid() = host_id);

-- Meetup participants: public read, self join/leave
alter table meetup_participants enable row level security;

create policy "participants_public_read"
  on meetup_participants for select
  using (true);

create policy "participants_self_insert"
  on meetup_participants for insert
  with check (auth.uid() = user_id);

create policy "participants_self_delete"
  on meetup_participants for delete
  using (auth.uid() = user_id);

-- Connections: visible only to the two parties involved
alter table connections enable row level security;

create policy "connections_parties_read"
  on connections for select
  using (auth.uid() = requester_id or auth.uid() = recipient_id);

create policy "connections_requester_insert"
  on connections for insert
  with check (auth.uid() = requester_id);

create policy "connections_parties_update"
  on connections for update
  using (auth.uid() = requester_id or auth.uid() = recipient_id);

create policy "connections_requester_delete"
  on connections for delete
  using (auth.uid() = requester_id);

-- Saved items: owner only
alter table saved_items enable row level security;

create policy "saved_owner_all"
  on saved_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── SEED DATA ─────────────────────────────────────────────────

insert into regions (id, name_ko, name_en, slug, city, description_en, description_ko)
values
  ('00000000-0000-0000-0000-000000000001', '홍대',       'Hongdae',       'hongdae',      'Seoul',   'Creative hub with indie music, street art, and young energy',         '인디 음악, 거리 예술의 창의적 허브'),
  ('00000000-0000-0000-0000-000000000002', '이태원',     'Itaewon',       'itaewon',      'Seoul',   'International district with global food and expat community',         '글로벌 음식과 외국인 커뮤니티'),
  ('00000000-0000-0000-0000-000000000003', '강남',       'Gangnam',       'gangnam',      'Seoul',   'Upscale shopping, fine dining, and business south of Han River',       '한강 남쪽의 고급 쇼핑과 비즈니스'),
  ('00000000-0000-0000-0000-000000000004', '북촌/종로',  'Bukchon',       'bukchon',      'Seoul',   'Traditional hanok village — history, palaces, and craft culture',     '역사와 전통 한옥 마을'),
  ('00000000-0000-0000-0000-000000000005', '성수',       'Seongsu',       'seongsu',      'Seoul',   'Seoul''s Brooklyn — artisan workshops, roasters, pop-up culture',     '공방, 로스터리, 팝업 문화의 서울 브루클린'),
  ('00000000-0000-0000-0000-000000000006', '해운대',     'Haeundae',      'haeundae',     'Busan',   'Busan''s famous beach with seafood, night markets, and ocean views',  '해산물과 야시장, 바다 전망'),
  ('00000000-0000-0000-0000-000000000007', '전주 한옥마을', 'Jeonju Hanok', 'jeonju-hanok', 'Jeonju', 'Korea''s food capital and best-preserved traditional village',       '한국의 음식 수도이자 한옥 마을')
on conflict (slug) do nothing;


insert into interests (id, name_ko, name_en, slug, icon, category)
values
  ('00000000-0000-0000-0001-000000000001', '음식',     'Food',             'food',       '🍜', 'lifestyle'),
  ('00000000-0000-0000-0001-000000000002', '언어 교환', 'Language Exchange', 'language',   '💬', 'learning'),
  ('00000000-0000-0000-0001-000000000003', 'K-컬처',   'K-Culture',        'culture',    '🎭', 'culture'),
  ('00000000-0000-0000-0001-000000000004', '등산',     'Hiking',           'hiking',     '🏔️', 'outdoor'),
  ('00000000-0000-0000-0001-000000000005', '음악',     'Music',            'music',      '🎵', 'arts'),
  ('00000000-0000-0000-0001-000000000006', '예술',     'Art',              'art',        '🎨', 'arts'),
  ('00000000-0000-0000-0001-000000000007', '스포츠',   'Sports',           'sport',      '⚽', 'outdoor'),
  ('00000000-0000-0000-0001-000000000008', '카페',     'Coffee & Cafes',   'coffee',     '☕', 'lifestyle'),
  ('00000000-0000-0000-0001-000000000009', '야경',     'Nightlife',        'nightlife',  '🌙', 'social'),
  ('00000000-0000-0000-0001-000000000010', '요리',     'Cooking',          'cooking',    '👨‍🍳', 'lifestyle'),
  ('00000000-0000-0000-0001-000000000011', '사진',     'Photography',      'photography','📷', 'arts'),
  ('00000000-0000-0000-0001-000000000012', '여행',     'Travel',           'travel',     '✈️', 'outdoor')
on conflict (slug) do nothing;
