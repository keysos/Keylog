import type { Game } from "@/mocks/types";

export const mockGames: Game[] = [
  {
    id: 1,
    igdb_id: 1942,
    title: "Resident Evil 4",
    slug: "resident-evil-4",
    summary:
      "Leon S. Kennedy travels to a remote European village on a mission to rescue the president's daughter.",
    cover_url: "/images/games/resident-evil-4.jpg",
    release_date: "2023-03-24",
    igdb_rating: 9.5,
    created_at: "2026-08-01T12:00:00Z",
    updated_at: "2026-08-01T12:00:00Z",
  },
  {
    id: 2,
    igdb_id: 119171,
    title: "Baldur's Gate 3",
    slug: "baldurs-gate-3",
    summary:
      "Gather your party and return to the Forgotten Realms in a cinematic RPG adventure.",
    cover_url: "/images/games/baldurs-gate-3.jpg",
    release_date: "2023-08-03",
    igdb_rating: 9.8,
    created_at: "2026-08-01T12:00:00Z",
    updated_at: "2026-08-01T12:00:00Z",
  },
  {
    id: 3,
    igdb_id: 119277,
    title: "Elden Ring",
    slug: "elden-ring",
    summary:
      "Explore a vast fantasy world filled with dangerous enemies, mysterious locations, and powerful bosses.",
    cover_url: "/images/games/elden-ring.jpg",
    release_date: "2022-02-25",
    igdb_rating: 9.7,
    created_at: "2026-08-01T12:00:00Z",
    updated_at: "2026-08-01T12:00:00Z",
  },
];
