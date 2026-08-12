"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const items = [
  { label: "Popularity", value: "popularity" },
  { label: "Game Title", value: "game_title" },
  { label: "Rating", value: "rating" },
  { label: "Release Date", value: "release_date" },
];

type GamesSortProps = {
  defaultValue: string;
};

const GamesSort = ({ defaultValue }: GamesSortProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function handleChange(value: string | null) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div>
      <Select
        items={items}
        defaultValue={defaultValue}
        onValueChange={handleChange}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GamesSort;
