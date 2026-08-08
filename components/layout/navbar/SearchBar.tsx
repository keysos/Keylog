import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="relative flex">
      <Input
        type="search"
        placeholder="Search"
        className="text-sm md:text-base [&::-webkit-search-cancel-button]:appearance-none"
      />
      <button
        type="submit"
        className="absolute top-1/2 right-0 -translate-y-1/2 p-3"
      >
        <Search className="text-muted-foreground size-4" />
      </button>
    </div>
  );
};

export default SearchBar;
