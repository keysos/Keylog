"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

import { mockGames } from "@/mocks/data/mockGames";
import Image from "next/image";

import placeholder from "@/assets/placeholder.jpg";
import logo from "@/assets/logo.svg";

export default function Home() {
  const [isLogged, seIsLogged] = useState(true);

  const [value, setValue] = useState(4);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)");

    const update = () => setValue(media.matches ? 7 : 4);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div className="mt-12 flex w-fit flex-col gap-12 px-4 sm:mx-12 md:mx-auto">
      {isLogged && (
        <>
          <div className="flex flex-col gap-2">
            <Image src={logo} alt="Keylog" className="sm:w-56n h-auto w-32" />
            <h2 className="text-muted-foreground text-xl font-medium sm:text-3xl">
              Keep track of what you play
            </h2>
          </div>

          <div className="text-muted-foreground flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button className={"w-full max-w-xs rounded-sm"}>
              Create a free account
            </Button>
            <span className="text-sm sm:text-base">
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

      <div className="flex flex-col gap-2">
        <div>
          <h2 className="text-xl">Recently trending</h2>
        </div>

        <div className="flex gap-2">
          {mockGames.slice(0, 7).map((game, index) => (
            <div
              key={game.id}
              className={`${index >= 5 ? "hidden sm:block" : ""}`}
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
    </div>
  );
}
