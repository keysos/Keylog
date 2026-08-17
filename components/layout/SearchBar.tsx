import { Input } from "@/components/ui/input";
import { IGDBGame } from "@/lib/igdb/type";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { searchGames } from "@/lib/igdb/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [games, setGames] = useState<IGDBGame[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  function handleClick() {
    router.replace(`/search?q=${encodeURIComponent(query)}`);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (query.trim().length < 3) {
      return;
    }

    const debounce = setTimeout(async () => {
      const data = await searchGames(query, 20);
      setGames(data);
      setIsOpen(true);
    }, 300);

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
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleClick}
        className="absolute top-1/2 right-0 -translate-y-1/2 hover:bg-transparent"
      >
        <Search className="text-muted-foreground size-4" />
      </Button>

      {isOpen && query.trim().length >= 3 && games.length > 0 && (
        <div
          ref={searchRef}
          className="absolute inset-x-0 top-full z-20 flex max-h-60 w-full flex-col overflow-y-auto"
        >
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
