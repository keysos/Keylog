import type { User, Game, UserGame, Review, List, ListGame } from "@/types";
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
type Table<Row, Required extends keyof Row> = {
  Row: { [K in keyof Row]: Row[K] };
  Insert: Pick<Row, Required> & Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};
export type Database = {
  public: {
    Tables: {
      profiles: Table<User, "id" | "username">;
      games: Table<
        Game & { metadata: Json; popularity: number },
        "id" | "igdb_id" | "title" | "slug"
      >;
      user_games: Table<UserGame, "user_id" | "game_id" | "status">;
      reviews: Table<Review, "user_id" | "game_id" | "rating" | "content">;
      lists: Table<List, "user_id" | "title">;
      list_games: Table<ListGame, "list_id" | "game_id">;
      favorites: Table<
        {
          user_id: string;
          game_id: number;
          position: number;
          created_at: string;
        },
        "user_id" | "game_id" | "position"
      >;
    };
    Views: Record<string, never>;
    Functions: {
      set_favorite: {
        Args: { target_game_id: number; target_position: number | null };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
