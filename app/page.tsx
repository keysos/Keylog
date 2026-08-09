"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

import { mockGames } from "@/mocks/data/mockGames";
import Image from "next/image";

import placeholder from "@/assets/placeholder.jpg";

export default function Home() {
  const [isLogged, seIsLogged] = useState(true);

  return (
    <div className="mt-12 flex flex-col gap-6 px-4">
      {isLogged && (
        <>
          <div className="flex flex-col gap-2">
            <h1 className="text-6xl font-bold">Keylog</h1>
            <p className="text-muted-foreground text-xl font-medium">
              Keep track of what you play
            </p>
          </div>

          <div></div>

          <div className="text-muted-foreground flex flex-col gap-2">
            <Button className={"w-full max-w-xs rounded-sm"}>
              Create a free account
            </Button>
            <span>
              Or{" "}
              <Link
                href="/login"
                className="text-foreground hover:border-foreground hover:border-b"
              >
                Log in
              </Link>{" "}
              if you already have one
            </span>
          </div>
        </>
      )}

      <div>
        <div>
          <h2>Recently trending</h2>
        </div>

        <div className="flex gap-2">
          {mockGames.slice(0, 5).map((game) => (
            <div key={game.id}>
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
    </div>
  );
}
