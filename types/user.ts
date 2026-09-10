export interface User {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  favorite_game_id: number | null;
  created_at: string;
  updated_at: string;
}
