"use client";

import { Button } from "@/components/ui/button";
import { IGDBGame } from "@/lib/igdb/type";
import Image from "next/image";
import { useState } from "react";

type LoggedInGameDetailProps = {
  game: IGDBGame;
};

const LoggedInGameDetail = ({ game }: LoggedInGameDetailProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const developer = game.involved_companies?.find(
    (company) => company.developer,
  );

  const publisher = game.involved_companies?.find(
    (company) => company.publisher,
  );

  const artwork = game.artworks
    ?.filter((artwork) => artwork.width && artwork.height)
    .sort((a, b) => {
      const targetRatio = 16 / 9;

      const aDifference = Math.abs(a.width! / a.height! - targetRatio);
      const bDifference = Math.abs(b.width! / b.height! - targetRatio);

      return aDifference - bDifference;
    })[0];

  return (
    <main className="w-full p-2">
      {/* Card */}
      <div className="border-border mx-auto flex h-auto max-w-6xl flex-col rounded-sm border">
        {/* Game cover and Title */}
        <div
          className="relative min-h-60 bg-cover bg-center bg-no-repeat py-12 sm:px-6"
          style={{
            backgroundImage: `url("${artwork?.url}")`,
          }}
        >
          <div className="absolute inset-0 bg-black/80"></div>

          <div className="from-background absolute inset-x-0 bottom-0 h-26 bg-linear-to-t to-transparent"></div>

          <div className="relative z-10 flex w-full items-center gap-8 px-2 sm:px-0">
            <Image
              src={game.cover?.url ?? ""}
              width={300}
              height={300}
              alt={game.name}
              className="border-border h-auto w-1/3 rounded-sm border object-contain shadow-2xl shadow-black/40 sm:w-1/6"
            />

            <div className="w-full space-y-2">
              <h1 className="text-2xl font-bold sm:text-4xl">{game.name}</h1>
              <span className="text-base sm:text-2xl">
                {game.first_release_date
                  ? new Date(game.first_release_date * 1000).getFullYear()
                  : ""}
                {" • "}
                <span className="text-muted-foreground">
                  {developer?.company.name}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8 px-2 pb-6 sm:flex-row sm:px-6">
          {/* Button and Game details */}
          <div className="flex flex-col gap-4 sm:w-1/3">
            <Button className={"border-border border p-2 py-6 sm:text-lg"}>
              Log this game
            </Button>

            <div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold sm:text-xl">
                  Game Details
                </h2>

                <div className="bg-secondary h-0.5 w-full"></div>

                <div className="flex flex-col sm:text-lg">
                  <span className="text-muted-foreground">Publisher</span>
                  <span>{publisher?.company.name}</span>
                </div>

                <div className="flex flex-col sm:text-lg">
                  <span className="text-muted-foreground">Genres</span>
                  <span>
                    {game.genres?.map((genre) => genre.name).join(", ")}
                  </span>
                </div>

                <div className="flex flex-col sm:text-lg">
                  <span className="text-muted-foreground">Platforms</span>
                  <span>
                    {game.platforms
                      ?.map((platform) => platform.name)
                      .join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* About */}

          <div className="w-full space-y-2">
            <h2 className="text-muted-foreground text-lg font-semibold">
              About
            </h2>

            <p className={isExpanded ? "" : "line-clamp-3"}>{game.summary}</p>

            <div className="flex items-center sm:hidden">
              <div className="bg-secondary h-0.5 w-full"></div>
              <Button
                variant={"ghost"}
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                {isExpanded ? "Collapse" : "Show more"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoggedInGameDetail;
