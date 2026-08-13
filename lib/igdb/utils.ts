export function normalizeIGDBImage(url: string): string {
  return url.replace("/t_thumb/", "/t_cover_big/").replace("//", "https://");
}

export function normalizeIGDBArtwork(url: string): string {
  return url.replace("/t_thumb/", "/t_1080p/").replace("//", "https://");
}
