import React from "react";

import Link from "next/link";
import Image from "next/image";
import { mockGames } from "@/mocks/data/mockGames";
import placeholder from "@/assets/placeholder.png";
import { Button } from "@/components/ui/button";

const TrendingGames = () => {
  return (
    <div className="border-b-border">
      <div className="flex items-center justify-between py-1">
        <h2 className="text-lg">Recently trending</h2>
        <Button variant={"link"}>
          <Link href="/games" className="text-muted-foreground">
            See more
          </Link>
        </Button>
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
