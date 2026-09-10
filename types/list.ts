import type { Game } from "./game";
export interface List {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}
export interface ListGame {
  id: string;
  list_id: string;
  game_id: number;
  is_hidden: boolean;
  added_at: string;
}
export type ListWithGames = List & {
  list_games: (ListGame & { games: Game })[];
};
