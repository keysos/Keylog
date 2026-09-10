import { createClient } from "@/lib/supabase/server";
import GameCovers from "@/components/shared/GameCovers";
import type { Game } from "@/types";
export default async function FavoriteGames({ userId }: { userId: string }) {
  const db = await createClient();
  const { data, error } = await db
    .from("favorites")
    .select("games(*)")
    .eq("user_id", userId)
    .order("position");
  if (error) throw error;
  return (
    <section className="space-y-3 border-b border-border pb-6">
      <h2 className="text-xl font-semibold">Favorite games</h2>
      <GameCovers
        games={(data as unknown as { games: Game }[]).map((x) => x.games)}
      />
    </section>
  );
}
