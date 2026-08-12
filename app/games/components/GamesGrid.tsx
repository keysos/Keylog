import Link from "next/link";
import Image from "next/image";
import { IGDBGame } from "@/lib/igdb";

type GamesGridProps = {
  games: IGDBGame[];
};

const GamesGrid = ({ games }: GamesGridProps) => {
  return (
    <div className="grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-6">
      {games.map((game) => {
        return (
          <Link
            href={`games/${game.slug}`}
            key={game.id}
            className="bg-muted relative flex aspect-3/4 items-center overflow-hidden"
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
              className="border-border rounded-sm border object-contain"
            />
          </Link>
        );
      })}
    </div>
  );
};

export default GamesGrid;
