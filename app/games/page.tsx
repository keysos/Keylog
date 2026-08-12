import GamesGrid from "./components/GamesGrid";

import { GameSort, getGames } from "@/lib/igdb";
import GamesSort from "./components/GamesSort";
import { GamesPagination } from "./components/GamesPagination";

type GamesProps = {
  searchParams: Promise<{
    sort?: string;
    page?: string;
  }>;
};

const Games = async ({ searchParams }: GamesProps) => {
  const LIMIT = 36;

  const params = await searchParams;

  const sort = params.sort ?? "popularity";
  const currentPage = Number(params.page ?? 1);

  const { games, totalGames } = await getGames(
    sort as GameSort,
    currentPage,
    LIMIT,
  );

  return (
    <div className="mx-auto mt-6 flex w-full max-w-6xl flex-col gap-3 px-4">
      <div className="text-muted-foreground flex items-center justify-between">
        <span>{totalGames} games</span>
        <GamesSort defaultValue="popularity" />
      </div>

      <GamesGrid games={games} />
      <GamesPagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalGames / LIMIT)}
      />
    </div>
  );
};

export default Games;
