import { getIGDBToken, IGDB_URL } from "./client";
import { IGDBGame } from "./type";
import { normalizeIGDBArtwork, normalizeIGDBImage } from "./utils";

export type GameSort = "popularity" | "release_date" | "rating" | "game_title";

const sortQueries: Record<GameSort, string> = {
  popularity: "total_rating_count desc",
  release_date: "first_release_date desc",
  rating: "rating_count desc",
  game_title: "name asc",
};

export async function getGames(
  sort?: GameSort,
  currentPage?: number,
  limit?: number,
  slug?: string,
): Promise<{ games: IGDBGame[]; totalGames: number }> {
  const query = `
    fields
      id,
      name,
      cover.url,
      slug,

      artworks.url,
      artworks.image_id,
      artworks.width,
      artworks.height,

      involved_companies.company.name,
      involved_companies.developer,
      involved_companies.publisher,

      genres.name,
      platforms.name,
      game_modes.name,
      player_perspectives.name,
      themes.name,

      first_release_date,

      rating,
      rating_count,
      total_rating,
      total_rating_count,
      aggregated_rating,
      aggregated_rating_count,

      summary;

    where
      ${slug ? `slug = "${slug}" & cover != null` : "cover != null"};

    ${sort ? `sort ${sortQueries[sort]};` : ""}

    limit ${limit ?? 20};

    ${currentPage ? `offset ${(currentPage - 1) * (limit ?? 20)};` : ""}
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

  if (!gamesResponse.ok) {
    throw new Error(`IGDB games request failed: ${gamesResponse.status}`);
  }

  if (!countResponse.ok) {
    throw new Error(`IGDB count request failed: ${countResponse.status}`);
  }

  const data: IGDBGame[] = await gamesResponse.json();
  const { count } = await countResponse.json();

  const games = data.map((game) => ({
    ...game,

    cover: game.cover
      ? {
          ...game.cover,
          url: normalizeIGDBImage(game.cover.url),
        }
      : undefined,

    artworks: game.artworks
      ?.filter((artwork) => !!artwork.url)
      .map((artwork) => ({
        ...artwork,
        url: normalizeIGDBArtwork(artwork.url),
      })),
  }));

  return {
    games,
    totalGames: count,
  };
}

export async function SearchGame(
  gameQuery: string,
  limit: number,
): Promise<IGDBGame[]> {
  const query = `
  search "${gameQuery}";

  fields
    id,
    name,
    slug,
    game_type,
    cover.url,
    total_rating_count,
    platforms.id,
    platforms.name;

  where version_parent = null
    & game_type = (0, 1, 2, 4, 6, 8, 9, 10, 11)
    & cover.url != null;

  limit ${limit};
`;
  const access_token = await getIGDBToken();

  const response = await fetch(`${IGDB_URL}/games`, {
    method: "POST",
    headers: {
      "Client-ID": process.env.IGDB_CLIENT_ID!,
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "text/plain",
    },
    body: query,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch search query in API");
  }

  const data: IGDBGame[] = await response.json();

  const games = data.map((game) => ({
    ...game,

    cover: game.cover
      ? {
          ...game.cover,
          url: normalizeIGDBImage(game.cover.url),
        }
      : undefined,
  }));

  return games.sort(
    (a, b) => (b.total_rating_count ?? 0) - (a.total_rating_count ?? 0),
  );
}
