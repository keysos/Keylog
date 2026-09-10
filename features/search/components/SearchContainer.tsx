import placeholder from "@/assets/placeholder.png";
import { IGDBGame } from "@/lib/igdb/types";
import Image from "next/image";
import { GameType } from "@/lib/igdb/types";

type SearchContainerProps = {
  game: IGDBGame;
};

const SearchContainer = ({ game }: SearchContainerProps) => {
  const type = GameType[game.game_type ?? 0] ?? "Unknown";
  const releaseDate: string = game.first_release_date
    ? String(new Date(game.first_release_date * 1000).getFullYear())
    : "Unknown";

  const visiblePlatforms = game.platforms?.slice(0, 3) ?? [];
  const remainingPlatforms =
    (game.platforms?.length ?? 0) - visiblePlatforms.length;

  return (
    <div className="flex w-full gap-2 border-b border-border py-2 sm:gap-4">
      <div className="relative aspect-3/4 w-24 shrink-0 p-4 sm:w-30">
        <Image
          src={game.cover?.url ?? placeholder}
          alt={game.name}
          width={300}
          height={300}
          className="rounded-sm border border-border"
        />
      </div>
      <div className="flex flex-col justify-center gap-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <h1 className="font-semibold sm:text-2xl">{game.name}</h1>
          <span className="text-sm text-muted-foreground">{releaseDate}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-sm bg-primary p-1 text-xs text-nowrap sm:px-2 sm:text-base">
            {type}
          </span>
          {visiblePlatforms.map((platform) => (
            <span
              key={platform.id}
              className="rounded-sm bg-secondary p-1 text-xs sm:px-2 sm:text-base"
            >
              {platform.name}
            </span>
          ))}

          {remainingPlatforms > 0 && (
            <span className="rounded-sm p-1 text-xs text-muted-foreground sm:px-2 sm:text-base">
              +{remainingPlatforms} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchContainer;
