import { getGames } from "@/lib/igdb/games";
import PublicGameDetail from "./components/PublicGameDetail";
import LoggedInGameDetail from "./components/LoggedInGameDetail";

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
  return <LoggedInGameDetail game={game} />;
};

export default GameDetail;
