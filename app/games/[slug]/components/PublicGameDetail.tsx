"use client";

import { Button } from "@/components/ui/button";
import { IGDBGame } from "@/lib/igdb/type";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type PublicGameDetailProps = {
  game: IGDBGame;
};

const PublicGameDetail = ({ game }: PublicGameDetailProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const developer = game.involved_companies?.find(
    (company) => company.developer,
  );

  const publisher = game.involved_companies?.find(
    (company) => company.publisher,
  );

  const artwork = game.artworks?.find((artwork) => {
    if (!artwork.width || !artwork.height) return false;

    const ratio = artwork.width / artwork.height;

    return ratio >= 1.7 && ratio <= 2.5;
  });

  return (
    <main className="w-full px-2 py-4 sm:px-4 sm:py-8">
      <div className="bg-card border-border mx-auto max-w-6xl overflow-hidden rounded-md border shadow-xl shadow-black/30">
        {/* Hero */}
        <section
          style={{
            backgroundImage: artwork?.url ? `url("${artwork.url}")` : undefined,
          }}
          className="relative flex min-h-56 items-center bg-cover bg-center sm:min-h-80"
        >
          <div className="absolute inset-0 bg-black/75" />

          <div className="from-card absolute inset-x-0 bottom-0 h-32 bg-linear-to-t to-transparent" />

          <div className="relative z-10 flex w-full items-center gap-4 p-4 sm:gap-8 sm:px-8 sm:py-6">
            {game.cover?.url && (
              <Image
                src={game.cover.url}
                alt={game.name}
                width={300}
                height={400}
                className="border-border w-28 shrink-0 rounded-md border object-cover shadow-xl shadow-black/40 sm:w-52"
              />
            )}

            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
                {game.name}
              </h1>

              <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-sm sm:text-base">
                <span>
                  {game.first_release_date
                    ? new Date(game.first_release_date * 1000).getFullYear()
                    : "Unknown"}
                </span>

                {developer && (
                  <>
                    <span>•</span>
                    <span className="font-medium">
                      {developer.company.name}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="grid gap-6 p-4 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-8 sm:p-8">
          {/* Left column */}
          <aside className="space-y-6">
            <div className="bg-secondary rounded-md p-3 text-center text-sm">
              <div className="flex flex-wrap items-center justify-center gap-1">
                <Button variant="link" className="h-auto p-0">
                  <Link href="/signup">Create an account</Link>
                </Button>

                <span className="text-muted-foreground">or</span>

                <Button variant="link" className="h-auto p-0">
                  <Link href="/login">Log in</Link>
                </Button>
              </div>

              <p className="text-muted-foreground mt-1">to track this game</p>
            </div>

            <div className="space-y-4">
              <h2 className="border-border border-b pb-2 font-semibold">
                Game Details
              </h2>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Publisher</p>
                  <p className="font-medium">
                    {publisher?.company.name ?? "Unknown"}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Genres</p>
                  <p className="font-medium">
                    {game.genres?.map((genre) => genre.name).join(", ") ||
                      "Unknown"}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Platforms</p>
                  <p className="font-medium">
                    {game.platforms
                      ?.map((platform) => platform.name)
                      .join(", ") || "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Right column */}
          <section className="min-w-0">
            <h2 className="mb-3 text-lg font-semibold">About</h2>

            <p
              className={`text-muted-foreground leading-7 ${
                !isExpanded ? "line-clamp-4 sm:line-clamp-none" : ""
              }`}
            >
              {game.summary ?? "No description available."}
            </p>

            <div className="mt-3 flex items-center sm:hidden">
              <div className="bg-border h-px flex-1" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                {isExpanded ? "Collapse" : "Show more"}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PublicGameDetail;
