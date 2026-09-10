"use client";
import { Input } from "@/components/ui/input";
import type { IGDBGame } from "@/lib/igdb/types";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { searchGames } from "@/features/search/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export default function SearchBar() {
  const [query, setQuery] = useState(""),
    [games, setGames] = useState<IGDBGame[]>([]),
    [open, setOpen] = useState(false),
    [error, setError] = useState("");
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  useEffect(() => {
    if (query.trim().length < 3) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const data = await searchGames(query, 8, 0);
        if (!cancelled) {
          setGames(data);
          setError("");
          setOpen(true);
        }
      } catch {
        if (!cancelled) {
          setError("Search unavailable. Try again.");
          setOpen(true);
        }
      }
    }, 700);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);
  function search() {
    if (query.trim().length < 2) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }
  return (
    <div ref={ref} className="relative">
      <div className="relative flex">
        <Input
          aria-label="Search games"
          type="search"
          placeholder="Search games"
          value={query}
          maxLength={100}
          className="pr-10 text-sm"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") search();
            if (e.key === "Escape") setOpen(false);
          }}
        />
        <Button
          aria-label="Submit game search"
          type="button"
          variant="ghost"
          size="icon"
          onClick={search}
          className="absolute top-0 right-0"
        >
          <Search className="size-4" />
        </Button>
      </div>
      {open && query.trim().length >= 3 && (
        <div className="absolute inset-x-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-md border border-border bg-card shadow-lg">
          {error ? (
            <p role="alert" className="p-3 text-xs">
              {error}
            </p>
          ) : games.length ? (
            games.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.slug}`}
                className="block p-3 text-sm hover:bg-accent"
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
              >
                {game.name}
              </Link>
            ))
          ) : (
            <p className="p-3 text-xs text-muted-foreground">No games found.</p>
          )}
        </div>
      )}
    </div>
  );
}
