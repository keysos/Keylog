import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { IGDBGame } from "./types";
import {
  getGames as remoteGames,
  searchIGDBGames as remoteSearch,
} from "./remote";
import type { Game } from "@/types";
import type { Json } from "@/lib/supabase/database.types";
export type GameSort = "popularity" | "release_date" | "rating" | "game_title";
export function toIGDB(game: Game & { metadata?: Json }): IGDBGame {
  return {
    ...(game.metadata as unknown as Partial<IGDBGame>),
    id: game.id,
    name: game.title,
    slug: game.slug!,
    summary: game.summary ?? undefined,
    cover: game.cover_url ? { url: game.cover_url } : undefined,
    first_release_date: game.release_date
      ? Date.parse(game.release_date) / 1000
      : undefined,
  };
}
function remoteEnabled() {
  return Boolean(process.env.IGDB_CLIENT_ID && process.env.IGDB_CLIENT_SECRET);
}
export async function getGames(
  sort: GameSort = "popularity",
  currentPage = 1,
  limit = 20,
  slug?: string,
): Promise<{ games: IGDBGame[]; totalGames: number }> {
  limit = Math.max(1, Math.min(100, Math.floor(limit) || 20));
  currentPage = Math.max(1, Math.min(10000, Math.floor(currentPage) || 1));
  if (slug && !/^[a-zA-Z0-9-]{1,250}$/.test(slug))
    return { games: [], totalGames: 0 };
  const db = await createClient();
  if (slug) {
    const { data, error } = await db
      .from("games")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (data) return { games: [toIGDB(data)], totalGames: 1 };
  }
  if (remoteEnabled()) return remoteGames(sort, currentPage, limit, slug);
  const column =
    (
      {
        popularity: "popularity",
        release_date: "release_date",
        rating: "igdb_rating",
        game_title: "title",
      } as const
    )[sort] ?? "popularity";
  let query = db
    .from("games")
    .select("*", { count: "exact" })
    .order(column, { ascending: sort === "game_title", nullsFirst: false })
    .order("id");
  if (slug) query = query.eq("slug", slug);
  const { data, error, count } = await query.range(
    (currentPage - 1) * limit,
    currentPage * limit - 1,
  );
  if (error) throw error;
  return { games: data.map(toIGDB), totalGames: count ?? 0 };
}
export async function searchIGDBGames(
  query: string,
  limit = 20,
  offset = 0,
): Promise<IGDBGame[]> {
  query = query.trim().slice(0, 100);
  limit = Math.max(1, Math.min(40, Math.floor(limit) || 20));
  offset = Math.max(0, Math.min(10000, Math.floor(offset) || 0));
  if (query.length < 2) return [];
  if (remoteEnabled()) return remoteSearch(query, limit, offset);
  const db = await createClient();
  const { data, error } = await db
    .from("games")
    .select("*")
    .ilike("title", `%${query.replace(/[%_]/g, "")}%`)
    .order("popularity", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data.map(toIGDB);
}
