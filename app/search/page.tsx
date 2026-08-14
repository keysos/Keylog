import { searchGames } from "@/lib/igdb/actions";
import SearchContainer from "./components/SearchContainer";
import Link from "next/link";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

const SearchPageProps = async ({ searchParams }: SearchPageProps) => {
  const params = await searchParams;

  const query = params.q ?? "";

  const games = await searchGames(query, 20);

  return (
    <div className="mt-4 w-full space-y-4 px-2 sm:mt-8 sm:space-y-6">
      <div>
        <h1 className="text-center text-lg sm:text-2xl">
          Results for <span className="text-primary">{query}</span>
        </h1>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-2">
        {games.map((game) => (
          <Link key={game.id} href={`/games/${game.slug}`}>
            <SearchContainer game={game}></SearchContainer>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchPageProps;
