import GameCovers from "@/components/shared/GameCovers";
import type { EntryWithGame } from "@/lib/data";
export default function ProfileGamesGrid({
  games,
}: {
  games: EntryWithGame[];
}) {
  return <GameCovers games={games.map((x) => x.games)} />;
}
