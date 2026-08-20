import GamesGrid from "@/features/games/components/GamesGrid";

import { GameSort, getGames } from "@/lib/igdb/games";
import GamesSort from "@/features/games/components/GamesSort";
import { GamesPagination } from "@/features/games/components/GamesPagination";

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
    <div className="mx-auto mt-6 flex w-full max-w-6xl flex-col gap-3 px-4 sm:px-2">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="flex h-full flex-col justify-end">
          {totalGames} games
        </span>
        <GamesSort defaultValue="popularity" />
      </div>

      <GamesGrid games={games} />
      <div className="mb-6">
        <GamesPagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalGames / LIMIT)}
        />
      </div>
    </div>
  );
};

export default Games;
