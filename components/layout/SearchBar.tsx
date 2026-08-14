import { Input } from "@/components/ui/input";
import { IGDBGame } from "@/lib/igdb/type";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { searchGames } from "@/lib/igdb/actions";
import Link from "next/link";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [games, setGames] = useState<IGDBGame[]>([]);

  function handleClick() {}

  useEffect(() => {
    if (query.trim().length < 3) {
      return;
    }

    const debounce = setTimeout(async () => {
      const data = await searchGames(query, 20);
      setGames(data);
    }, 700);

    return () => {
      clearTimeout(debounce);
    };
  }, [query]);

  return (
    <div className="relative flex">
      <Input
        type="search"
        placeholder="Search"
        value={query}
        className="focus-none! rounded-xs text-sm md:text-base [&::-webkit-search-cancel-button]:appearance-none"
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={handleClick}
        className="focus-none! absolute top-1/2 right-0 -translate-y-1/2 p-3"
      >
        <Search className="text-muted-foreground size-4" />
      </button>

      {query.trim().length >= 3 && games.length > 0 && (
        <div className="absolute inset-x-0 top-full z-20 flex max-h-60 w-full flex-col overflow-y-auto">
          {games.map((game) => (
            <Link
              href={`/games/${game.slug}`}
              key={game.id}
              onClick={() => {
                setQuery("");
              }}
              className="bg-card border-border border p-2"
            >
              {game.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
