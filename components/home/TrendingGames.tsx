import React from "react";

import Link from "next/link";
import Image from "next/image";
import { mockGames } from "@/mocks/data/mockGames";
import placeholder from "@/assets/placeholder.png";

const TrendingGames = () => {
  return (
    <div className="border-b-border space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg">Recently trending</h2>
        <Link href="/">
          <span className="text-muted-foreground hover:text-foreground">
            See more
          </span>
        </Link>
      </div>

      <div className="flex justify-between gap-2 sm:gap-4 md:gap-6">
        {mockGames.slice(0, 7).map((game, index) => (
          <div
            key={game.id}
            className={`${index >= 5 ? "hidden md:block" : ""}`}
          >
            <Link href="/">
              <Image
                className="border-border rounded-sm border"
                src={game.cover_url ?? placeholder}
                alt={game.title}
                width={156}
                height={212}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingGames;
