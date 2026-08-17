// lib/igdb/actions.ts

"use server";

import { SearchGame } from "./games";

export async function searchGames(
  query: string,
  limit: number,
  offset: number,
) {
  return SearchGame(query, limit, offset);
}
