"use server";

import { searchIGDBGames } from "@/lib/igdb/games";

export async function searchGames(
  query: string,
  limit: number,
  offset: number,
) {
  return searchIGDBGames(query, limit, offset);
}
