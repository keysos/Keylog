import GamesGrid from "./components/GamesGrid";

import { GameSort, getGames } from "@/lib/igdb";
import GamesSort from "./components/GamesSort";
import { GamesPagination } from "./components/GamesPagination";

type GamesProps = {
  searchParams: Promise<{
    sort?: string;
  }>;
};

const Games = async ({ searchParams }: GamesProps) => {
  const params = await searchParams;

  const sort = params.sort ?? "popularity";

  const games = await getGames(sort as GameSort);

  return (
    <div className="mx-auto mt-6 flex w-full max-w-6xl flex-col gap-2 px-4">
      <div className="text-muted-foreground flex items-center justify-between">
        <span>{games.length} games</span>
        <GamesSort defaultValue="popularity" />
      </div>

      <GamesGrid games={games} />
    </div>
  );
};

export default Games;
