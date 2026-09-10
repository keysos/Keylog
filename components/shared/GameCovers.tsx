import Image from "next/image";
import Link from "next/link";
import placeholder from "@/assets/placeholder.png";
import type { Game } from "@/types";
export default function GameCovers({ games }: { games: Game[] }) {
  if (!games.length)
    return <p className="py-5 text-sm text-muted-foreground">No games yet.</p>;
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
      {games.map((game) => (
        <Link
          key={game.id}
          href={`/games/${game.slug}`}
          className="group min-w-0"
        >
          <Image
            src={game.cover_url ?? placeholder}
            alt={game.title}
            width={180}
            height={240}
            className="aspect-3/4 w-full rounded-sm border border-border object-cover transition group-hover:border-primary"
          />
          <p className="mt-2 truncate text-xs text-muted-foreground group-hover:text-foreground">
            {game.title}
          </p>
        </Link>
      ))}
    </div>
  );
}
