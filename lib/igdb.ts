const IGDB_URL = "https://api.igdb.com/v4";

export interface IGDBGame {
  id: number;
  name: string;
  game_type?: number;
  cover?: {
    url: string;
  };
  slug: string;
  first_release_date?: number;
  rating?: number;
  rating_count?: number;
  total_rating?: number;
  total_rating_count?: number;
  aggregated_rating?: number;
  aggregated_rating_count?: number;
  summary?: string;
}

function normalizeIGDBImage(url: string): string {
  return url.replace("/t_thumb/", "/t_cover_big/").replace("//", "https://");
}

async function getIGDBToken(): Promise<string> {
  const response = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.IGDB_CLIENT_ID!,
      client_secret: process.env.IGDB_CLIENT_SECRET!,
      grant_type: "client_credentials",
    }),
  });
  if (!response.ok) {
    const errorBody = await response.text();
    console.error("IGDB authentication error:", response.status, errorBody);
    throw new Error("Failed to authenticate with IGDB");
  }
  const data = await response.json();
  return data.access_token;
}

/* Game Fetching */

export type GameSort = "popularity" | "release_date" | "rating" | "game_title";

const sortQueries: Record<GameSort, string> = {
  popularity: "total_rating_count desc",
  release_date: "first_release_date desc",
  rating: "rating_count desc",
  game_title: "name asc",
};

export async function getGames(
  sort: GameSort,
  currentPage: number,
  limit: number,
): Promise<{ games: IGDBGame[]; totalGames: number }> {
  const query = `
    fields
      id,
      name,
      cover.url,
      slug,
      first_release_date,
      rating,
      rating_count,
      total_rating,
      total_rating_count,
      summary;

    where cover != null;
    
    sort ${sortQueries[sort]};

    limit ${limit};
    offset ${(currentPage - 1) * limit};
  
  `;
  const access_token = await getIGDBToken();

  const [gamesResponse, countResponse] = await Promise.all([
    fetch(`${IGDB_URL}/games`, {
      method: "POST",
      headers: {
        "Client-ID": process.env.IGDB_CLIENT_ID!,
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "text/plain",
      },
      body: query,
    }),

    fetch(`${IGDB_URL}/games/count`, {
      method: "POST",
      headers: {
        "Client-ID": process.env.IGDB_CLIENT_ID!,
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "text/plain",
      },
      body: `
        where cover != null;
        count;
      `,
    }),
  ]);

  if (!gamesResponse || !countResponse) {
    throw new Error(`IGDB request failed: ${gamesResponse.status}`);
  }

  const data: IGDBGame[] = await gamesResponse.json();
  const { count } = await countResponse.json();

  const games = data.map((game) => ({
    ...game,
    cover: {
      ...game.cover,
      url: normalizeIGDBImage(game.cover!.url),
    },
  }));

  return {
    games: games,
    totalGames: count,
  };
}
