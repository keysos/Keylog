import { getGames } from "@/lib/igdb/games";
import { notFound } from "next/navigation";
import { currentUser } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import GameDetailCard from "@/features/games/components/GameDetailCard";
import GameActions from "@/features/games/components/GameActions";
import ReviewFeed from "@/features/reviews/components/ReviewFeed";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { games } = await getGames(undefined, 1, 1, slug);
  const game = games[0];
  if (!game) notFound();
  const user = await currentUser();
  const db = await createClient();
  const results = user
    ? await Promise.all([
        db
          .from("user_games")
          .select("*")
          .eq("user_id", user.id)
          .eq("game_id", game.id)
          .maybeSingle(),
        db
          .from("reviews")
          .select("*")
          .eq("user_id", user.id)
          .eq("game_id", game.id)
          .maybeSingle(),
        db.from("lists").select("*").eq("user_id", user.id).order("title"),
        db
          .from("favorites")
          .select("position")
          .eq("user_id", user.id)
          .eq("game_id", game.id)
          .maybeSingle(),
      ])
    : null;
  if (results)
    for (const result of results) if (result.error) throw result.error;
  return (
    <div className="w-full">
      <GameDetailCard game={game} isLoggedIn={Boolean(user)} />
      <div className="mx-auto mb-8 max-w-6xl space-y-8 px-4">
        {results && (
          <div id="game-actions">
            <GameActions
              key={`${results[0].data?.updated_at}-${results[1].data?.updated_at}-${results[3].data?.position}`}
              slug={slug}
              entry={results[0].data}
              review={results[1].data}
              lists={results[2].data ?? []}
              favoritePosition={results[3].data?.position ?? null}
            />
          </div>
        )}
        <section>
          <h2 className="text-xl font-semibold">Reviews</h2>
          <ReviewFeed gameId={game.id} />
        </section>
      </div>
    </div>
  );
}
