import { mockUserGames } from "@/mocks/data/mockUserGames";
import { mockUsers } from "@/mocks/data/mockUsers";
import { mockGames } from "@/mocks/data/mockGames";
import Image from "next/image";
import Link from "next/link";
import placeholder from "@/assets/placeholder.png";

const UserOverview = () => {
  const loggedUser = mockUsers[0];

  return (
    <div className="border-b-border space-y-4 border-b pb-4 sm:space-y-8">
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

          <p className="text-muted-foreground text-center text-sm">Quicklog</p>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;
