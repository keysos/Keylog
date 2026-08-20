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
