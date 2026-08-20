export type GameStatus = "backlog" | "playing" | "completed" | "dropped";

export interface Game {
  id: number;
  igdb_id: number;
  title: string;
  slug: string | null;
  summary: string | null;
  cover_url: string | null;
  release_date: string | null;
  igdb_rating: number | null;
  created_at: string;
}

export interface UserGame {
  id: number;
  user_id: number;
  game_id: number;
  status: GameStatus;
  rating: number | null;
  is_favorite: boolean;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}
