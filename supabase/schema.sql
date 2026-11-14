-- ============================================================
-- TUTOR · PROGRESSIVE BREAKDOWN — Supabase schema
-- ------------------------------------------------------------
-- Run this file in the SQL Editor of your Supabase project.
-- It includes: the progress table, security (Row Level Security),
-- the updated_at trigger and the realtime subscription.
--
-- MODEL: one row per user, with progress as a JSON document.
-- Why not a normalized table (one row per step)?
--   · progress is by nature a "document" belonging to the user;
--   · syncing is a single upsert (atomic, one round-trip);
--   · no migration is needed as the prototype evolves.
-- If teacher analytics are ever needed (e.g. "average autonomy
-- per exercise"), normalize into a second table with a small
-- export script: the choice stays reversible.
-- ============================================================

-- 1 · Progress table --------------------------------------------------------
create table if not exists public.user_progress (
  user_id    uuid        not null primary key references auth.users (id) on delete cascade,
  data       jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

comment on table public.user_progress is
  'Progressive Breakdown Tutor progress: data = {progress, current, updatedAt} saved by the client (local-first).';

-- 2 · Security: Row Level Security ------------------------------------------
-- The client's anon key is PUBLIC by design: data protection depends
-- ONLY on these rules. Each user sees and modifies exclusively their
-- own row.
alter table public.user_progress enable row level security;

drop policy if exists "progressi_visibili_solo_al_proprietario" on public.user_progress;
create policy "progressi_visibili_solo_al_proprietario"
  on public.user_progress
  for all
  using      (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 3 · updated_at managed by the database ------------------------------------
create or replace function public.tutor_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_tutor_touch_updated_at on public.user_progress;
create trigger trg_tutor_touch_updated_at
  before update on public.user_progress
  for each row execute function public.tutor_touch_updated_at();

-- 4 · Realtime: two open devices stay in sync in real time ------------------
do $$
begin
  alter publication supabase_realtime add table public.user_progress;
exception
  when duplicate_object then null;   -- already present: ok
end $$;

-- Done. ---------------------------------------------------------------------
-- Expected final check:
--   select * from pg_policies where tablename = 'user_progress';
-- it must show the policy for "all" with auth.uid() = user_id.
