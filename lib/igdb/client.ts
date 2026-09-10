import "server-only";
export const IGDB_URL = "https://api.igdb.com/v4";
let cached: { token: string; expiresAt: number } | null = null;
let pending: Promise<string> | null = null;
export async function getIGDBToken(): Promise<string> {
  if (cached && cached.expiresAt > Date.now()) return cached.token;
  if (pending) return pending;
  pending = (async () => {
    if (!process.env.IGDB_CLIENT_ID || !process.env.IGDB_CLIENT_SECRET)
      throw new Error("IGDB credentials are not configured.");
    const response = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.IGDB_CLIENT_ID,
        client_secret: process.env.IGDB_CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
    });
    if (!response.ok) throw new Error("Failed to authenticate with IGDB.");
    const data = await response.json();
    if (
      typeof data.access_token !== "string" ||
      typeof data.expires_in !== "number"
    )
      throw new Error("Invalid IGDB token response.");
    cached = {
      token: data.access_token,
      expiresAt: Date.now() + Math.max(0, data.expires_in - 60) * 1000,
    };
    return cached.token;
  })();
  try {
    return await pending;
  } finally {
    pending = null;
  }
}
