import type { Review } from "@/mocks/types";

export const mockReviews: Review[] = [
  {
    id: 1,
    user_id: 1,
    game_id: 10,
    rating: 4.5,
    content:
      "One of the best remakes I've ever played. The atmosphere, combat, and pacing are incredible.",
    created_at: "2026-07-06T12:00:00Z",
    updated_at: "2026-07-06T12:00:00Z",
  },
  {
    id: 2,
    user_id: 2,
    game_id: 6,
    rating: 5,
    content:
      "Absolutely fantastic game. The gameplay feels great and the final boss is unforgettable.",
    created_at: "2026-07-10T15:30:00Z",
    updated_at: "2026-07-10T15:30:00Z",
  },
  {
    id: 3,
    user_id: 2,
    game_id: 3,
    rating: 4.5,
    content:
      "An incredible open-world RPG with an insane amount of freedom. Still discovering new things.",
    created_at: "2026-08-02T18:00:00Z",
    updated_at: "2026-08-02T18:00:00Z",
  },
  {
    id: 4,
    user_id: 3,
    game_id: 2,
    rating: 4,
    content:
      "The amount of freedom you have is ridiculous. Every playthrough can feel completely different.",
    created_at: "2026-08-04T20:00:00Z",
    updated_at: "2026-08-04T20:00:00Z",
  },
];
