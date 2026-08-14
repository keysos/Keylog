import { IGDBGame } from "@/lib/igdb/type";
import Image from "next/image";
import { GameType } from "@/lib/igdb/type";

type SearchContainerProps = {
  game: IGDBGame;
};

const SearchContainer = ({ game }: SearchContainerProps) => {
  if (game.game_type === undefined) {
    throw new Error("Game does not have a type");
  }
  const type = GameType[game.game_type] ?? "Unknown";

  const visiblePlatforms = game.platforms?.slice(0, 3) ?? [];
  const remainingPlatforms =
    (game.platforms?.length ?? 0) - visiblePlatforms.length;

  return (
    <div className="border-border flex w-full gap-2 border-b py-2 sm:gap-4">
      <div className="relative aspect-3/4 w-24 shrink-0 p-4 sm:w-30">
        <Image
          src={game.cover?.url ?? ""}
          alt={game.name}
          width={300}
          height={300}
          className="border-border rounded-sm border"
        />
      </div>
      <div className="flex flex-col justify-center gap-2">
        <h1 className="font-semibold sm:text-2xl">{game.name}</h1>
        <div className="flex flex-wrap gap-2">
          <span className="bg-primary rounded-sm p-1 text-xs text-nowrap sm:px-2 sm:text-base">
            {type}
          </span>
          {visiblePlatforms.map((platform) => (
            <span
              key={platform.id}
              className="bg-secondary rounded-sm p-1 text-xs sm:px-2 sm:text-base"
            >
              {platform.name}
            </span>
          ))}

          {remainingPlatforms > 0 && (
            <span className="text-muted-foreground rounded-sm p-1 text-xs sm:px-2 sm:text-base">
              +{remainingPlatforms} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchContainer;
