import "server-only";
import { createClient as adminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getGames } from "./remote";
import type { Database, Json } from "@/lib/supabase/database.types";
// Only server-fetched IGDB metadata is accepted. Client-supplied titles/IDs are never trusted.
export async function ensureGame(slug: string) {
  if (!/^[a-zA-Z0-9-]{1,250}$/.test(slug)) throw new Error("Invalid game.");
  const db = await createClient();
  const { data, error } = await db
    .from("games")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (data) return data.id;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret)
    throw new Error(
      "Catalog import is not configured. Add SUPABASE_SECRET_KEY on the server.",
    );
  const { games } = await getGames(undefined, 1, 1, slug);
  const game = games[0];
  if (!game || game.slug !== slug) throw new Error("Game not found.");
  const admin = adminClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const { error: writeError } = await admin
    .from("games")
    .upsert(
      {
        id: game.id,
        igdb_id: game.id,
        title: game.name,
        slug: game.slug,
        summary: game.summary ?? null,
        cover_url: game.cover?.url ?? null,
        release_date: game.first_release_date
          ? new Date(game.first_release_date * 1000).toISOString().slice(0, 10)
          : null,
        igdb_rating: game.rating ?? null,
        popularity: game.total_rating_count ?? 0,
        metadata: game as unknown as Json,
      },
      { onConflict: "id" },
    );
  if (writeError) throw writeError;
  return game.id;
}
