export interface IGDBGame {
  id: number;
  name: string;
  game_type?: number;

  cover?: {
    url: string;
  };

  slug: string;

  artworks?: {
    id?: number;
    url: string;
    image_id?: string;
    width?: number;
    height?: number;
  }[];

  involved_companies?: {
    developer: boolean;
    publisher: boolean;
    company: {
      id: string;
      name: string;
    };
  }[];

  genres?: {
    id: number;
    name: string;
  }[];

  platforms?: {
    id: number;
    name: string;
  }[];

  game_modes?: {
    id: number;
    name: string;
  }[];

  player_perspectives?: {
    id: number;
    name: string;
  }[];

  themes?: {
    id: number;
    name: string;
  }[];

  first_release_date?: number;

  rating?: number;
  rating_count?: number;

  total_rating?: number;
  total_rating_count?: number;

  aggregated_rating?: number;
  aggregated_rating_count?: number;

  summary?: string;
}

export const GameType: Record<number, string> = {
  0: "Main Game",
  1: "DLC",
  2: "Expansion",
  3: "Bundle",
  4: "Standalone Expansion",
  5: "Mod",
  6: "Episode",
  7: "Season",
  8: "Remake",
  9: "Remaster",
  10: "Expanded Game",
  11: "Port",
  12: "Fork",
  13: "Pack",
  14: "Update",
} as const;
