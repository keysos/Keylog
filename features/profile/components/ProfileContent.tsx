import { entries } from "@/lib/data";
import GameCovers from "@/components/shared/GameCovers";
import ReviewFeed from "@/features/reviews/components/ReviewFeed";
import Link from "next/link";
import type { User } from "@/types";
export default async function ProfileContent({ user }: { user: User }) {
  const games = await entries(user.id);
  return (
    <div className="mt-6 space-y-6">
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Recently logged</h2>
        <GameCovers games={games.map((x) => x.games)} />
      </section>
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent reviews</h2>
          <Link
            className="text-sm text-primary"
            href={`/users/${user.username}/reviews`}
          >
            View all
          </Link>
        </div>
        <ReviewFeed userId={user.id} limit={3} />
      </section>
    </div>
  );
}
