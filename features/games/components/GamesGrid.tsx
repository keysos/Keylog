import Link from "next/link";
import Image from "next/image";
import { IGDBGame } from "@/lib/igdb/types";

type GamesGridProps = {
  games: IGDBGame[];
};

const GamesGrid = ({ games }: GamesGridProps) => {
  return (
    <div className="grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-6">
      {games.map((game) => {
        return (
          <Link
            href={`/games/${game.slug}`}
            key={game.id}
            className="group relative flex aspect-3/4 items-center overflow-hidden rounded-sm border border-border bg-muted"
          >
            <Image
              src={game.cover?.url ?? ""}
              alt=""
              fill
              sizes="150px"
              className="scale-110 object-cover blur-xl"
            />

            <div className="absolute inset-0 bg-black/30"></div>

            <Image
              src={game.cover?.url ?? ""}
              alt={game.name}
              fill
              sizes="150px"
              className="object-contain"
            />

            <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="text-center font-semibold">{game.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default GamesGrid;
