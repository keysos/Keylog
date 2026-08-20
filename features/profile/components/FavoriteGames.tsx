import { mockGames } from "@/mocks/data/mockGames";
import { mockUserGames } from "@/mocks/data/mockUserGames";

import Link from "next/link";
import Image from "next/image";

type FavoriteGamesProps = {
  userId: number;
};

const FavoriteGames = ({ userId }: FavoriteGamesProps) => {
  return (
    <div className="space-y-2 border-b border-border">
      <h2 className="text-lg font-semibold sm:text-2xl">Favorite Games</h2>

      <div className="mb-6 grid grid-cols-5 gap-2">
        {mockUserGames
          .filter((userGame) => userGame.user_id === userId)
          .slice(0, 5)
          .map((userGame) => {
            const game = mockGames.find((game) => game.id === userGame.game_id);

            if (!game) return null;

            return (
              <div
                key={userGame.id}
                className="relative aspect-3/4 w-full max-w-40"
              >
                <Link href="/">
                  <Image
                    src={game?.cover_url ?? ""}
                    alt={game?.title ?? "No game"}
                    className="h-auto rounded-sm border-2 border-border"
                    width={300}
                    height={300}
                  />
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default FavoriteGames;
