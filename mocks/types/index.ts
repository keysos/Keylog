// types/index.ts
export type GameStatus = "backlog" | "playing" | "completed" | "dropped";

export interface User {
  id: number;
  username: string;
  email: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  created_at: string;
  stats: {
    played: number;
    playing: number;
    backlog: number;
    dropped: number;
    reviews: number;
    lists: number;
  };
}

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

export interface Review {
  id: number;
  user_id: number;
  game_id: number;
  rating: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface List {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListGame {
  list_id: number;
  game_id: number;
  position: number | null;
  added_at: string;
}
