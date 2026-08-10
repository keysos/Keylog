"use client";
/* Components */
import { Button } from "@/components/ui/button";
import ReviewCard from "@/components/reviews/ReviewCard";
import Link from "next/link";
import Image from "next/image";

/* Context */
import { useAuthStore } from "@/stores/authStore";

/* Data */
import placeholder from "@/assets/placeholder.png";
import placeholder_2 from "@/assets/placeholder_2.png";
import placeholder_3 from "@/assets/placeholder_3.png";

import logo from "@/assets/logo.svg";
import { mockReviews } from "@/mocks/data/mockReviews";
import { mockUsers } from "@/mocks/data/mockUsers";
import { mockGames } from "@/mocks/data/mockGames";
import { mockUserGames } from "@/mocks/data/mockUserGames";

export default function Home() {
  const isLogged = useAuthStore((state) => state.isLogged);

  const loggedUser = mockUsers[0];

  return (
    <div className="mt-16 mb-8 flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-0 lg:mx-auto lg:mt-32">
      {!isLogged && (
        <>
          <div className="flex flex-col gap-2">
            <Image src={logo} alt="Keylog" className="h-auto w-48 sm:w-56" />
            <h2 className="text-muted-foreground text-xl font-medium sm:text-3xl">
              Keep track of what you play
            </h2>
          </div>

          <div className="text-muted-foreground flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button className={"w-min rounded-sm text-base"}>
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

      {isLogged && (
        <div className="border-b-border flex flex-col gap-4 border-b pb-4 sm:gap-8">
          <p className="text-center text-xl">
            Welcome back{" "}
            <span className="font-bold">{loggedUser.display_name}</span>
          </p>
          <div className="flex justify-around">
            <div className="text-muted-foreground grid w-1/2 grid-cols-2 sm:w-1/3 sm:grid-cols-3">
              <div className="text-center">
                <p className="text-sm">Played</p>
                <p className="text-foreground text-2xl">
                  {
                    mockUserGames.filter(
                      (userGame) => userGame.status === "completed",
                    ).length
                  }
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm">Playing</p>
                <p className="text-foreground text-2xl">
                  {
                    mockUserGames.filter(
                      (userGame) => userGame.status === "playing",
                    ).length
                  }
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm">Backloged</p>
                <p className="text-foreground text-2xl">
                  {
                    mockUserGames.filter(
                      (userGame) => userGame.status === "backlog",
                    ).length
                  }
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm">Dropped</p>
                <p className="text-foreground text-2xl">
                  {
                    mockUserGames.filter(
                      (userGame) => userGame.status === "dropped",
                    ).length
                  }
                </p>
              </div>
            </div>
            <div className="flex w-1/2 flex-col justify-between gap-2 sm:w-1/3">
              <div className="flex justify-center gap-1">
                {mockUserGames.slice(0, 4).map((userGame, index) => {
                  const game = mockGames.find(
                    (game) => game.id === userGame.game_id,
                  );
                  return (
                    <div
                      key={userGame.id}
                      className={index >= 3 ? "hidden md:block" : ""}
                    >
                      <Link href="/">
                        <Image
                          src={game?.cover_url ?? placeholder}
                          alt={game?.title ?? "No game"}
                          className="border-border object-fit rounded-sm border-2"
                          width={80}
                          height={100}
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>

              <p className="text-muted-foreground text-center text-sm">
                Quicklog
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="border-b-border flex flex-col gap-2">
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

      {isLogged && (
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-lg">Popular reviews</h2>
            <Link href="/">
              <span className="text-muted-foreground hover:text-foreground">
                See more
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-2">
            {mockReviews.map((review) => {
              const game = mockGames.find((game) => review.game_id === game.id);
              const user = mockUsers.find((user) => review.user_id === user.id);

              if (!game || !user) return null;

              return (
                <ReviewCard
                  key={review.id}
                  review={review}
                  game={game}
                  user={user}
                />
              );
            })}
          </div>
        </div>
      )}

      {!isLogged && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold">What is Keylog?</h2>
            <p className="text-muted-foreground">
              Keylog is a place to keep track of the games you play. Add games
              to your library, keep a record of what you&apos;ve played, and
              discover new titles along the way. Whether you&apos;re revisiting
              an old favorite or starting something new, Keylog makes it easy to
              organize your gaming journey and keep everything in one place.
            </p>
            <div className="flex flex-col gap-8 md:gap-12">
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-6">
                <Image
                  src={placeholder_2}
                  alt="Keylog profile library"
                  className="w-full rounded-xs"
                  width={440}
                />
                <div className="flex flex-col justify-center gap-2">
                  <h3 className="text-2xl font-bold">
                    Track your personal game collection
                  </h3>
                  <p className="text-muted-foreground">
                    Keep your entire game collection organized in one place. Add
                    the games you own, keep track of what you&apos;ve played,
                    and build a personal library that reflects your gaming
                    journey.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                <div className="sm-order-1 order-2 flex flex-col justify-center gap-2">
                  <h3 className="text-2xl font-bold">
                    Express your thoughts with reviews
                  </h3>
                  <p className="text-muted-foreground">
                    Share your thoughts on the games you play. Write reviews,
                    rate your experiences, and let others know what you loved,
                    disliked, or remembered most.
                  </p>
                </div>
                <Image
                  src={placeholder_2}
                  alt="Keylog profile library"
                  className="order-1 w-full rounded-xs sm:order-2"
                  width={440}
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                <Image
                  src={placeholder_2}
                  alt="Keylog profile library"
                  className="w-full rounded-xs"
                  width={440}
                />
                <div className="flex flex-col justify-center gap-2">
                  <h3 className="text-2xl font-bold">
                    Create and organize games with lists
                  </h3>
                  <p className="text-muted-foreground">
                    Create custom lists to organize your games however you want.
                    Group your favorites, keep track of what you want to play,
                    or make lists around specific genres, moods, and
                    experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
