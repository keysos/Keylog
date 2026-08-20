"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { searchGames } from "@/features/search/actions";
import { IGDBGame } from "@/lib/igdb/types";

import SearchContainer from "./SearchContainer";
import { LoaderCircle } from "lucide-react";

type SearchResultsProps = {
  query: string;
  initialGames: IGDBGame[];
};

const LIMIT = 20;

const SearchResults = ({ query, initialGames }: SearchResultsProps) => {
  const [games, setGames] = useState(initialGames);
  const [offset, setOffset] = useState(initialGames.length);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialGames.length === LIMIT);

  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = loaderRef.current;

    if (!loader || !hasMore) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || isLoading) return;

        setIsLoading(true);

        const newGames = await searchGames(query, LIMIT, offset);

        setGames((prev) => [...prev, ...newGames]);

        setOffset((prev) => prev + newGames.length);

        if (newGames.length < LIMIT) {
          setHasMore(false);
        }

        setIsLoading(false);
      },
      {
        rootMargin: "200px",
      },
    );

    observer.observe(loader);

    return () => observer.disconnect();
  }, [query, offset, isLoading, hasMore]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-2">
      {games.map((game) => (
        <Link key={game.id} href={`/games/${game.slug}`}>
          <SearchContainer game={game} />
        </Link>
      ))}

      {hasMore && <div ref={loaderRef} className="h-1" />}

      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-6">
          <LoaderCircle className="text-primary size-5 animate-spin" />
          <span className="text-muted-foreground text-sm">
            Loading more games...
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
