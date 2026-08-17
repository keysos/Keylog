import { searchGames } from "@/lib/igdb/actions";
import SearchResults from "./components/SearchResults";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const params = await searchParams;

  const query = params.q ?? "";

  const games = await searchGames(query, 20, 0);

  return (
    <div className="mt-4 w-full space-y-4 px-2 sm:mt-8 sm:space-y-6">
      <h1 className="text-center text-lg sm:text-2xl">
        Results for <span className="text-primary">{query}</span>
      </h1>

      <SearchResults query={query} initialGames={games} />
    </div>
  );
};

export default SearchPage;
