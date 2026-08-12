const IGDB_URL = "https://api.igdb.com/v4";

export interface IGDBGame {
  id: number;
  name: string;
  cover?: {
    url: string;
  };
  first_release_date?: number;
  rating?: number;
  rating_count?: number;
  total_rating?: number;
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
