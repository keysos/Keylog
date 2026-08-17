import { getGames } from "@/lib/igdb/games";
import GameDetailCard from "./components/GameDetailCard";

type GameDetailProps = {
  params: Promise<{
    slug?: string;
  }>;
};

const GameDetail = async ({ params }: GameDetailProps) => {
  const { slug } = await params;

  const { games } = await getGames(undefined, undefined, 1, slug);

  const game = games[0];

  /* Add placeholder here later */
  return <GameDetailCard game={game} isLoggedIn={false} />;
};

export default GameDetail;
