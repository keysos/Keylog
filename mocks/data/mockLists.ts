import type { List } from "@/mocks/types";

export const mockLists: List[] = [
  {
    id: 1,
    user_id: 1,
    name: "My Favorites",
    description: "Games that I absolutely love.",
    is_public: true,
    created_at: "2026-07-05T12:00:00Z",
    updated_at: "2026-07-05T12:00:00Z",
  },
  {
    id: 2,
    user_id: 1,
    name: "RPGs I Need To Play",
    description: "RPGs currently sitting in my backlog.",
    is_public: true,
    created_at: "2026-07-10T15:00:00Z",
    updated_at: "2026-07-10T15:00:00Z",
  },
  {
    id: 3,
    user_id: 2,
    name: "My Top Games",
    description: "My favorite games of all time.",
    is_public: true,
    created_at: "2026-07-15T18:00:00Z",
    updated_at: "2026-07-20T18:00:00Z",
  },
  {
    id: 4,
    user_id: 3,
    name: "Games To Play",
    description: "Games I want to play eventually.",
    is_public: false,
    created_at: "2026-07-20T10:00:00Z",
    updated_at: "2026-07-20T10:00:00Z",
  },
];
