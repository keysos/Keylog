-- Keylog baseline: run once on an empty public schema. Transactional, no DROP/CASCADE.
-- Existing conflicting tables stop this transaction; inspect/back up before adapting.
begin;
create schema if not exists keylog_private;
revoke all on schema keylog_private from public, anon, authenticated;
create table public.games (
 id bigint primary key check (id>0), igdb_id bigint not null unique check(igdb_id=id),
 title text not null check(length(title) between 1 and 500), slug text not null unique,
 summary text, cover_url text, release_date date, igdb_rating numeric,
 popularity integer not null default 0, metadata jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now()
);
create index games_title_idx on public.games (lower(title));
create index games_popularity_idx on public.games (popularity desc,id);
create index games_release_idx on public.games (release_date desc,id);
create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 username text not null unique check(username ~ '^[a-z0-9_]{3,24}$'),
 display_name text check(length(display_name)<=80), avatar_url text, bio text check(length(bio)<=1000),
 favorite_game_id bigint references public.games(id) on delete set null,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create index profiles_favorite_idx on public.profiles(favorite_game_id);
create table public.user_games (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
 game_id bigint not null references public.games(id) on delete cascade,
 status text not null check(status in ('backlog','playing','completed','dropped')),
 rating numeric(2,1) check(rating between 0.5 and 5 and rating*2=trunc(rating*2)),
 started_at date, completed_at date, created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 unique(user_id,game_id),check(completed_at is null or started_at is null or completed_at>=started_at)
);
create index user_games_game_idx on public.user_games(game_id);
create index user_games_status_idx on public.user_games(user_id,status,updated_at desc);
create table public.reviews (
 id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles(id) on delete cascade,
 game_id bigint not null references public.games(id) on delete cascade,
 rating numeric(2,1) not null check(rating between 0.5 and 5 and rating*2=trunc(rating*2)),
 content text not null check(length(trim(content)) between 1 and 10000),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(), unique(user_id,game_id)
);
create index reviews_game_idx on public.reviews(game_id,created_at desc);
create index reviews_recent_idx on public.reviews(created_at desc);
create index reviews_user_recent_idx on public.reviews(user_id,created_at desc);
create table public.lists (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
 title text not null check(length(trim(title)) between 1 and 100),description text check(length(description)<=2000),
 is_private boolean not null default true,created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create index lists_user_idx on public.lists(user_id,updated_at desc);
create table public.list_games (
 id uuid primary key default gen_random_uuid(),list_id uuid not null references public.lists(id) on delete cascade,
 game_id bigint not null references public.games(id) on delete cascade,
 is_hidden boolean not null default false,added_at timestamptz not null default now(),unique(list_id,game_id)
);
create index list_games_game_idx on public.list_games(game_id);
create table public.favorites (
 user_id uuid not null references public.profiles(id) on delete cascade,
 game_id bigint not null references public.games(id) on delete cascade,
 position smallint not null check(position between 1 and 5),created_at timestamptz not null default now(),
 primary key(user_id,game_id),unique(user_id,position)
);
create index favorites_game_idx on public.favorites(game_id);
-- Five slots + a unique constraint enforce the limit even for concurrent requests.
create function keylog_private.touch_updated_at() returns trigger language plpgsql set search_path='' as $$
begin new.updated_at=now();return new;end;$$;
create function keylog_private.create_profile() returns trigger language plpgsql security definer set search_path='' as $$
declare requested text;
begin
 requested=lower(trim(new.raw_user_meta_data->>'username'));
 if requested is null or requested !~ '^[a-z0-9_]{3,24}$' then
 requested='user_'||replace(new.id::text,'-',''); requested=left(requested,24);
 end if;
 insert into public.profiles(id,username,display_name) values(new.id,requested,requested);
 return new;
end;$$;
-- Internal auth trigger only; no authorization decisions use editable metadata.
revoke all on function keylog_private.create_profile() from public,anon,authenticated;
revoke all on function keylog_private.touch_updated_at() from public,anon,authenticated;
create trigger keylog_auth_profile after insert on auth.users for each row execute function keylog_private.create_profile();
-- Backfill real existing auth accounts, without inventing mock users.
insert into public.profiles(id,username,display_name)
select id,'user_'||left(replace(id::text,'-',''),19),'Player' from auth.users on conflict(id) do nothing;
create trigger profiles_updated before update on public.profiles for each row execute function keylog_private.touch_updated_at();
create trigger user_games_updated before update on public.user_games for each row execute function keylog_private.touch_updated_at();
create trigger reviews_updated before update on public.reviews for each row execute function keylog_private.touch_updated_at();
create trigger lists_updated before update on public.lists for each row execute function keylog_private.touch_updated_at();
alter table public.profiles enable row level security;
revoke all on public.profiles from anon,authenticated;
grant select on public.profiles to anon,authenticated;
grant all on public.profiles to service_role;
alter table public.games enable row level security;
revoke all on public.games from anon,authenticated;
grant select on public.games to anon,authenticated;
grant all on public.games to service_role;
alter table public.user_games enable row level security;
revoke all on public.user_games from anon,authenticated;
grant select on public.user_games to anon,authenticated;
grant all on public.user_games to service_role;
alter table public.reviews enable row level security;
revoke all on public.reviews from anon,authenticated;
grant select on public.reviews to anon,authenticated;
grant all on public.reviews to service_role;
alter table public.lists enable row level security;
revoke all on public.lists from anon,authenticated;
grant select on public.lists to anon,authenticated;
grant all on public.lists to service_role;
alter table public.list_games enable row level security;
revoke all on public.list_games from anon,authenticated;
grant select on public.list_games to anon,authenticated;
grant all on public.list_games to service_role;
alter table public.favorites enable row level security;
revoke all on public.favorites from anon,authenticated;
grant select on public.favorites to anon,authenticated;
grant all on public.favorites to service_role;
create policy "profiles_read" on public.profiles for select to anon,authenticated using(true);
create policy "games_read" on public.games for select to anon,authenticated using(true);
create policy "user_games_read" on public.user_games for select to anon,authenticated using(true);
create policy "reviews_read" on public.reviews for select to anon,authenticated using(true);
create policy "favorites_read" on public.favorites for select to anon,authenticated using(true);
grant insert,update,delete on public.user_games to authenticated;
create policy "user_games_insert" on public.user_games for insert to authenticated with check((select auth.uid())=user_id);
create policy "user_games_update" on public.user_games for update to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id);
create policy "user_games_delete" on public.user_games for delete to authenticated using((select auth.uid())=user_id);
grant insert,update,delete on public.reviews to authenticated;
create policy "reviews_insert" on public.reviews for insert to authenticated with check((select auth.uid())=user_id);
create policy "reviews_update" on public.reviews for update to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id);
create policy "reviews_delete" on public.reviews for delete to authenticated using((select auth.uid())=user_id);
grant insert,update,delete on public.lists to authenticated;
create policy "lists_insert" on public.lists for insert to authenticated with check((select auth.uid())=user_id);
create policy "lists_update" on public.lists for update to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id);
create policy "lists_delete" on public.lists for delete to authenticated using((select auth.uid())=user_id);
grant insert,update,delete on public.favorites to authenticated;
create policy "favorites_insert" on public.favorites for insert to authenticated with check((select auth.uid())=user_id);
create policy "favorites_update" on public.favorites for update to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id);
create policy "favorites_delete" on public.favorites for delete to authenticated using((select auth.uid())=user_id);
grant update(username,display_name,avatar_url,bio,favorite_game_id) on public.profiles to authenticated;
create policy profiles_update on public.profiles for update to authenticated using((select auth.uid())=id) with check((select auth.uid())=id);
create policy lists_read on public.lists for select to anon,authenticated using(not is_private or (select auth.uid())=user_id);
grant insert,update,delete on public.list_games to authenticated;
create policy list_games_read on public.list_games for select to anon,authenticated using(
 exists(select 1 from public.lists l where l.id=list_id and (l.user_id=(select auth.uid()) or (not l.is_private and not is_hidden)))
);
create policy list_games_insert on public.list_games for insert to authenticated with check(
 exists(select 1 from public.lists l where l.id=list_id and l.user_id=(select auth.uid()))
);
create policy list_games_update on public.list_games for update to authenticated using(
 exists(select 1 from public.lists l where l.id=list_id and l.user_id=(select auth.uid()))
) with check(exists(select 1 from public.lists l where l.id=list_id and l.user_id=(select auth.uid())));
create policy list_games_delete on public.list_games for delete to authenticated using(
 exists(select 1 from public.lists l where l.id=list_id and l.user_id=(select auth.uid()))
);
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('avatars','avatars',true,2097152,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=true,file_size_limit=2097152,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
create policy keylog_avatar_read on storage.objects for select to authenticated using(bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy keylog_avatar_insert on storage.objects for insert to authenticated with check(bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy keylog_avatar_update on storage.objects for update to authenticated using(bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid())::text) with check(bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy keylog_avatar_delete on storage.objects for delete to authenticated using(bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid())::text);
-- Keep profiles.favorite_game_id and favorite slot 1 consistent in one transaction.
create function keylog_private.profile_favorite_changed() returns trigger language plpgsql set search_path='' as $$
begin
 if pg_trigger_depth()>1 or new.favorite_game_id is not distinct from old.favorite_game_id then return new; end if;
 delete from public.favorites where user_id=new.id and (position=1 or game_id=new.favorite_game_id);
 if new.favorite_game_id is not null then
 insert into public.favorites(user_id,game_id,position) values(new.id,new.favorite_game_id,1);
 end if;
 return new;
end;$$;
create function keylog_private.favorite_slot_changed() returns trigger language plpgsql set search_path='' as $$
declare owner_id uuid;
begin
 if pg_trigger_depth()>1 then return null; end if;
 if TG_OP='DELETE' then owner_id=old.user_id; else owner_id=new.user_id; end if;
 update public.profiles set favorite_game_id=(select game_id from public.favorites where user_id=owner_id and position=1) where id=owner_id;
 return null;
end;$$;
revoke all on function keylog_private.profile_favorite_changed() from public,anon,authenticated;
revoke all on function keylog_private.favorite_slot_changed() from public,anon,authenticated;
create trigger profile_favorite_changed after update of favorite_game_id on public.profiles for each row execute function keylog_private.profile_favorite_changed();
create trigger favorite_slot_changed after insert or update or delete on public.favorites for each row execute function keylog_private.favorite_slot_changed();
-- Invoker RPC: serialize favorite moves per owner; RLS still applies throughout.
create function public.set_favorite(target_game_id bigint, target_position integer) returns void language plpgsql security invoker set search_path='' as $$
declare owner_id uuid := auth.uid();
begin
 if owner_id is null then raise exception 'Login required'; end if;
 if target_position is not null and (target_position<1 or target_position>5) then raise exception 'Invalid favorite position'; end if;
 perform 1 from public.profiles where id=owner_id for update;
 delete from public.favorites where user_id=owner_id and (game_id=target_game_id or position=target_position);
 if target_position is not null then insert into public.favorites(user_id,game_id,position) values(owner_id,target_game_id,target_position); end if;
end;$$;
revoke all on function public.set_favorite(bigint,integer) from public,anon;
grant execute on function public.set_favorite(bigint,integer) to authenticated;
commit;
