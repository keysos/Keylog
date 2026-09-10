# Keylog

Next.js App Router + TypeScript + Tailwind + Supabase Auth, PostgreSQL and Storage. Real IGDB catalog integration. The existing navy/blue visual system and component layout are retained.

Start with **[SETUP.md](SETUP.md)**. This ZIP contains source, a pinned dependency lockfile, the SQL baseline, database authorization tests and setup instructions. No credentials, mock application data, node_modules or build output are included.

```bash
npm ci
# Copy .env.example to .env.local and set your values.
npm run dev
```

## Features

- Email/password signup, confirmation, login, logout and password reset.
- Cookie-based SSR sessions, refreshed by `proxy.ts`; server operations verify the current user.
- Public profiles, editable username/display name/bio, avatar upload/removal and up to five favorites.
- Game status, half-star ratings, dates, review publishing/editing/deletion.
- Private/public lists, game search/add/remove, owner-only per-game hide/reveal.
- Paginated profile games, reviews, lists and list contents; status filters run before pagination.
- Real empty/error/loading states, responsive menus and keyboard focus states.

## Code map

- `lib/supabase/`: browser/server clients, database types.
- `lib/data.ts`: request-local authenticated queries.
- `lib/igdb/`: trusted server-side IGDB lookup and catalog persistence.
- `features/auth/`, `features/profile/`, `features/lists/`, `features/games/`: features and mutations.
- `supabase/schema.sql`: transactional baseline with RLS, indexes, triggers and Storage rules.
- `tests/database.mjs`: authorization/constraint tests using an isolated PostgreSQL-compatible PGlite database.

The server secret is used only for inserting trusted game metadata fetched from IGDB. Every user-owned write uses the user's authenticated Supabase client and RLS. No user email is stored in a public profile.

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Database test (optional development dependency; does not connect to your hosted database):

```bash
npm install --no-save --package-lock=false @electric-sql/pglite@0.5.8
node tests/database.mjs
```

See SETUP.md for hosted email, Storage and two-user verification steps. The connected Supabase integration returned no accessible projects during implementation; no hosted schema was changed.
