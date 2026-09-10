"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { searchGames } from "@/features/search/actions";
import type { IGDBGame } from "@/lib/igdb/types";
import SearchContainer from "./SearchContainer";
import { Button } from "@/components/ui/button";
export default function SearchResults({
  query,
  initialGames,
}: {
  query: string;
  initialGames: IGDBGame[];
}) {
  const [games, setGames] = useState(initialGames),
    [offset, setOffset] = useState(initialGames.length),
    [loading, setLoading] = useState(false),
    [more, setMore] = useState(initialGames.length === 20),
    [error, setError] = useState("");
  const loader = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);
  const load = useCallback(async () => {
    if (inFlight.current || !more) return;
    inFlight.current = true;
    setLoading(true);
    setError("");
    try {
      const data = await searchGames(query, 20, offset);
      setGames((old) => [
        ...old,
        ...data.filter((game) => !old.some((x) => x.id === game.id)),
      ]);
      setOffset((old) => old + data.length);
      setMore(data.length === 20);
    } catch {
      setError("Unable to load more games.");
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, [query, offset, more]);
  useEffect(() => {
    if (!loader.current || !more || error) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void load();
      },
      { rootMargin: "200px" },
    );
    observer.observe(loader.current);
    return () => observer.disconnect();
  }, [load, more, error]);
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-2">
      {!games.length && (
        <p className="py-8 text-center text-muted-foreground">
          No games found. Try another name.
        </p>
      )}
      {games.map((game) => (
        <Link key={game.id} href={`/games/${game.slug}`}>
          <SearchContainer game={game} />
        </Link>
      ))}
      {more && <div ref={loader} className="h-1" />}
      {loading && (
        <p
          role="status"
          className="py-4 text-center text-sm text-muted-foreground"
        >
          Loading more games…
        </p>
      )}
      {error && (
        <div role="alert" className="space-y-2 py-4 text-center">
          <p>{error}</p>
          <Button variant="outline" onClick={load}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
