import type { User } from "@/mocks/types";

export const mockUsers: User[] = [
  {
    id: 1,
    username: "keysos",
    email: "keysos@example.com",
    display_name: "Keysos",
    bio: "Just here to keep track of the games I play.",
    avatar_url: "/images/avatars/keysos.jpg",
    created_at: "2026-07-01T12:00:00Z",
    updated_at: "2026-08-01T12:00:00Z",
  },
  {
    id: 2,
    username: "gamer42",
    email: "gamer42@example.com",
    display_name: "Gamer42",
    bio: "RPGs, horror and everything in between.",
    avatar_url: "/images/avatars/gamer42.jpg",
    created_at: "2026-07-10T14:30:00Z",
    updated_at: "2026-08-02T10:00:00Z",
  },
  {
    id: 3,
    username: "pixelhunter",
    email: "pixelhunter@example.com",
    display_name: "Pixel Hunter",
    bio: "Trying to finish my backlog one game at a time.",
    avatar_url: "/images/avatars/pixelhunter.jpg",
    created_at: "2026-07-15T09:00:00Z",
    updated_at: "2026-08-03T16:00:00Z",
  },
];
