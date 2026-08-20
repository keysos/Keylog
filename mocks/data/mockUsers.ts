import type { User } from "@/types";

import profile_placeholder from "@/assets/profile_picture.jpg";
import banner_placeholder from "@/assets/profile_banner.jpg";

export const mockUsers: User[] = [
  {
    id: 1,
    username: "keysos",
    email: "keysos@example.com",
    display_name: "Keysos",
    bio: "Just here to keep track of the games I play.",
    avatar_url: profile_placeholder.src,
    banner_url: banner_placeholder.src,
    created_at: "2026-07-01T12:00:00Z",
    stats: {
      played: 42,
      playing: 3,
      backlog: 27,
      dropped: 4,
      reviews: 12,
      lists: 5,
    },
  },
  {
    id: 2,
    username: "gamer42",
    email: "gamer42@example.com",
    display_name: "Gamer42",
    bio: "RPGs, horror and everything in between.",
    avatar_url: profile_placeholder.src,
    banner_url: banner_placeholder.src,
    created_at: "2026-07-10T14:30:00Z",
    stats: {
      played: 88,
      playing: 5,
      backlog: 41,
      dropped: 9,
      reviews: 34,
      lists: 8,
    },
  },
  {
    id: 3,
    username: "pixelhunter",
    email: "pixelhunter@example.com",
    display_name: "Pixel Hunter",
    bio: "Trying to finish my backlog one game at a time.",
    avatar_url: profile_placeholder.src,
    banner_url: banner_placeholder.src,
    created_at: "2026-07-15T09:00:00Z",
    stats: {
      played: 31,
      playing: 2,
      backlog: 56,
      dropped: 6,
      reviews: 9,
      lists: 3,
    },
  },
];
