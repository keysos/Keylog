// Run with: npm install --no-save @electric-sql/pglite && node tests/database.mjs
// Test-only auth/storage stubs; the application uses real Supabase APIs.
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url);
const { PGlite } = require(process.env.PGLITE_MODULE || "@electric-sql/pglite");
const db = new PGlite();
await db.exec(`
create role anon; create role authenticated; create role service_role bypassrls;
create schema auth; create schema storage;
create table auth.users(id uuid primary key,raw_user_meta_data jsonb);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema public,auth,storage to anon,authenticated,service_role;
grant execute on function auth.uid() to anon,authenticated,service_role;
create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);
alter table storage.objects enable row level security;
grant select,insert,update,delete on storage.objects to anon,authenticated;
create function storage.foldername(text) returns text[] language sql immutable as $$ select string_to_array($1,'/') $$;
`);
await db.exec(
  await readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8"),
);
const a = "11111111-1111-4111-8111-111111111111",
  b = "22222222-2222-4222-8222-222222222222";
await db.exec(
  `insert into auth.users values('${a}','{"username":"player_a"}'),('${b}','{"username":"player_b"}');insert into public.games(id,igdb_id,title,slug) select i,i,'Game '||i,'game-'||i from generate_series(1,7)i;`,
);
async function as(role, user = "") {
  await db.exec(
    `reset role;set role ${role};select set_config('request.jwt.claim.sub','${user}',false);`,
  );
}
async function scalar(sql) {
  return Object.values((await db.query(sql)).rows[0])[0];
}
async function denied(sql) {
  let failed = false;
  try {
    await db.exec(sql);
  } catch {
    failed = true;
  }
  assert.ok(failed, `Expected denied: ${sql}`);
}
await as("authenticated", a);
await db.exec(`insert into lists(id,user_id,title,is_private) values('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','${a}','Private',true),('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','${a}','Public',false);
insert into list_games(list_id,game_id,is_hidden) values('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',1,false),('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',2,false),('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',3,true);
insert into user_games(user_id,game_id,status,rating) values('${a}',1,'playing',4.5);
insert into reviews(user_id,game_id,rating,content) values('${a}',1,4.5,'A review');`);
assert.equal(await scalar("select count(*)::int from list_games"), 3);
await as("anon");
assert.equal(await scalar("select count(*)::int from lists"), 1);
assert.equal(await scalar("select count(*)::int from list_games"), 1);
await denied(`insert into lists(user_id,title) values('${a}','Forbidden')`);
await as("authenticated", b);
assert.equal(await scalar("select count(*)::int from list_games"), 1);
await denied(
  `insert into list_games(list_id,game_id) values('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',4)`,
);
assert.equal(
  (
    await db.query(
      `update lists set title='stolen' where user_id='${a}' returning id`,
    )
  ).rows.length,
  0,
);
assert.equal(
  (await db.query(`delete from reviews where user_id='${a}' returning id`)).rows
    .length,
  0,
);
await denied(
  `insert into reviews(user_id,game_id,rating,content) values('${a}',2,4,'Forged')`,
);
await denied(
  `insert into games(id,igdb_id,title,slug) values(999,999,'Fake','fake')`,
);
await as("authenticated", a);
await denied(`update lists set user_id='${b}' where title='Public'`);
await denied(
  `update list_games set list_id='cccccccc-cccc-4ccc-8ccc-cccccccccccc' where game_id=2`,
);
await denied(
  `insert into user_games(user_id,game_id,status,rating) values('${a}',2,'playing',5.5)`,
);
await denied(
  `insert into user_games(user_id,game_id,status,rating) values('${a}',2,'playing',3.3)`,
);
await denied(
  `insert into list_games(list_id,game_id) values('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',2)`,
);
for (let i = 1; i <= 5; i++) await db.exec(`select set_favorite(${i},${i});`);
assert.equal(
  await scalar(`select count(*)::int from favorites where user_id='${a}'`),
  5,
);
assert.equal(
  Number(await scalar(`select favorite_game_id from profiles where id='${a}'`)),
  1,
);
await denied("select set_favorite(6,6)");
await db.exec("select set_favorite(5,1)");
assert.equal(
  Number(await scalar(`select favorite_game_id from profiles where id='${a}'`)),
  5,
);
await db.exec(
  `update profiles set favorite_game_id=7,bio='Updated' where id='${a}'`,
);
assert.equal(
  Number(
    await scalar(
      `select game_id from favorites where user_id='${a}' and position=1`,
    ),
  ),
  7,
);
await db.exec("select set_favorite(7,null)");
assert.equal(
  await scalar(`select favorite_game_id from profiles where id='${a}'`),
  null,
);
await db.exec(
  `insert into storage.objects(bucket_id,name) values('avatars','${a}/avatar.png')`,
);
await as("authenticated", b);
await denied(
  `insert into storage.objects(bucket_id,name) values('avatars','${a}/stolen.png')`,
);
assert.equal(await scalar(`select count(*)::int from storage.objects`), 0);
await as("authenticated", a);
await db.exec(`update list_games set is_hidden=false where game_id=3`);
await as("anon");
assert.equal(await scalar("select count(*)::int from list_games"), 2);
await as("authenticated", a);
await db.exec(
  `delete from lists where id='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'`,
);
assert.equal(await scalar("select count(*)::int from list_games"), 1);
await as("postgres");
assert.equal(
  await scalar(
    `select count(*)::int from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r' and not c.relrowsecurity`,
  ),
  0,
);
console.log(
  "PASS: baseline SQL, auth profile trigger, grants, ownership, private/hidden lists, reveal, cascade deletion, ratings, favorites sync and storage RLS.",
);
await db.close();
