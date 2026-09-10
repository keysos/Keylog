import { getGames } from "@/lib/igdb/games";
import Link from "next/link";
import GamesGrid from "@/features/games/components/GamesGrid";
export default async function TrendingGames() {
  const { games } = await getGames("popularity", 1, 7);
  return (
    <section className="space-y-3">
      <div className="flex justify-between">
        <h2 className="text-lg">Popular games</h2>
        <Link className="text-sm text-muted-foreground" href="/games">
          See more
        </Link>
      </div>
      {games.length ? (
        <GamesGrid games={games} />
      ) : (
        <p className="text-sm text-muted-foreground">
          No games in the catalog yet.
        </p>
      )}
    </section>
  );
}
