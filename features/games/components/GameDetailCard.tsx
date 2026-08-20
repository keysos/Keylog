"use client";

import { Button } from "@/components/ui/button";
import { IGDBGame } from "@/lib/igdb/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type GameDetailCardProps = {
  game: IGDBGame;
  isLoggedIn: boolean;
};

const GameDetailCard = ({ game, isLoggedIn }: GameDetailCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const developer = game.involved_companies?.find(
    (company) => company.developer,
  );

  const publisher = game.involved_companies?.find(
    (company) => company.publisher,
  );

  const releaseDate: string = game.first_release_date
    ? String(new Date(game.first_release_date * 1000).getFullYear())
    : "Unknown";

  const artwork = game.artworks
    ?.filter((artwork) => artwork.width && artwork.height)
    .sort((a, b) => {
      const targetRatio = 16 / 9;

      const aDifference = Math.abs(a.width! / a.height! - targetRatio);
      const bDifference = Math.abs(b.width! / b.height! - targetRatio);

      return aDifference - bDifference;
    })[0];

  return (
    <div className="w-full p-2">
      {/* Card */}
      <div className="mx-auto flex h-auto max-w-6xl flex-col rounded-sm">
        {/* Game cover and Title */}
        <div
          className="relative min-h-60 bg-cover bg-center bg-no-repeat py-12 sm:px-6"
          style={{
            backgroundImage: `url("${artwork?.url}")`,
          }}
        >
          <div className="absolute inset-0 bg-black/80"></div>

          <div className="absolute inset-x-0 top-0 h-26 bg-linear-to-t from-transparent to-background" />

          <div className="absolute inset-y-0 right-0 w-26 bg-linear-to-l from-background to-transparent" />

          <div className="absolute inset-y-0 left-0 w-26 bg-linear-to-r from-background to-transparent" />

          <div className="absolute inset-x-0 bottom-0 h-60 bg-linear-to-b from-transparent to-background" />

          <div className="relative z-10 flex w-full items-center gap-8 px-2 sm:px-0">
            <Image
              src={game.cover?.url ?? ""}
              width={300}
              height={300}
              alt={game.name}
              className="h-auto w-1/3 rounded-sm border border-border object-contain shadow-2xl shadow-black/40 sm:w-1/6"
            />

            <div className="w-full space-y-2">
              <h1 className="text-2xl font-bold sm:text-4xl">{game.name}</h1>
              <span className="text-base sm:text-2xl">
                {releaseDate}
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
            {!isLoggedIn && (
              <div className="flex flex-wrap items-center justify-center rounded-sm border border-border bg-secondary p-2">
                <Button variant={"link"} className={"h-auto px-1 text-base"}>
                  <Link href="/signup">Create an account</Link>
                </Button>
                <span> or </span>
                <Button variant={"link"} className={"h-auto px-1 text-base"}>
                  <Link href="/login">Log in</Link>
                </Button>
                <span className="pb-1">to track this game</span>
              </div>
            )}

            {isLoggedIn && (
              <Button className={"border border-border p-2 py-6 sm:text-lg"}>
                Log this game
              </Button>
            )}

            <div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold sm:text-xl">
                  Game Details
                </h2>

                <div className="h-0.5 w-full bg-secondary"></div>

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
            <h2 className="text-lg font-semibold text-muted-foreground">
              About
            </h2>

            <p className={isExpanded ? "" : "line-clamp-3"}>{game.summary}</p>

            <div className="flex items-center sm:hidden">
              <div className="h-0.5 w-full bg-secondary"></div>
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
    </div>
  );
};

export default GameDetailCard;
