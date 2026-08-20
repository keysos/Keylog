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
