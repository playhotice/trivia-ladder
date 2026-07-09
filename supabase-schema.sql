-- Trivia Ladder Supabase schema
-- Run this in Supabase SQL Editor.

create table if not exists public.trivia_ladder_results (
  id text primary key,
  room_id text not null,
  player_id text not null,
  player_name text not null,
  game_date date not null,
  bank integer not null check (bank >= 0 and bank <= 2000),
  answers jsonb not null default '[]'::jsonb,
  final jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now(),
  inserted_at timestamptz not null default now()
);

create unique index if not exists trivia_ladder_results_room_date_player_idx
on public.trivia_ladder_results (room_id, game_date, player_id);

alter table public.trivia_ladder_results enable row level security;

drop policy if exists "trivia ladder public read" on public.trivia_ladder_results;
drop policy if exists "trivia ladder public insert" on public.trivia_ladder_results;
drop policy if exists "trivia ladder public update" on public.trivia_ladder_results;
drop policy if exists "trivia ladder public delete" on public.trivia_ladder_results;

create policy "trivia ladder public read"
on public.trivia_ladder_results
for select
using (room_id = 'ian-shannon');

create policy "trivia ladder public insert"
on public.trivia_ladder_results
for insert
with check (
  room_id = 'ian-shannon'
  and player_id in ('ian', 'shannon')
  and bank >= 0
  and bank <= 2000
);

create policy "trivia ladder public update"
on public.trivia_ladder_results
for update
using (
  room_id = 'ian-shannon'
  and player_id in ('ian', 'shannon')
)
with check (
  room_id = 'ian-shannon'
  and player_id in ('ian', 'shannon')
  and bank >= 0
  and bank <= 2000
);

create policy "trivia ladder public delete"
on public.trivia_ladder_results
for delete
using (
  room_id = 'ian-shannon'
  and player_id in ('ian', 'shannon')
);

-- Optional realtime setup:
-- In the Supabase dashboard, enable Realtime for the `trivia_ladder_results` table.
-- If Realtime is not enabled, scores still save and load; the leaderboard updates when the page opens/refreshes.
