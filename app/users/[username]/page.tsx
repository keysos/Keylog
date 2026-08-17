import { mockUsers } from "@/mocks/data/mockUsers";
import { notFound } from "next/navigation";

import ProfileNavbar from "./components/ProfileNavbar";
import ProfileUserCard from "./components/ProfileUserCard";
import { mockUserGames } from "@/mocks/data/mockUserGames";
import { mockGames } from "@/mocks/data/mockGames";
import Link from "next/link";
import Image from "next/image";

type ProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { username } = await params;
  const user = mockUsers.find((user) => user.username === username);

  if (!user) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-2">
      <div className="space-y-4">
        <div className="border-border flex flex-col gap-2 border-b">
          <ProfileUserCard user={user} />

          {/* Profile Navbar */}
          <ProfileNavbar />
        </div>
        <div className="flex flex-col px-2 sm:flex-row sm:justify-between sm:gap-4 sm:px-0">
          <div className="w-full sm:w-1/3 md:w-1/4">
            <h2 className="text-muted-foreground border-border border-b text-lg">
              Bio
            </h2>

            <p className="text-muted-foreground py-2">{user.bio}</p>
          </div>

          {/* RIGHT PANEL */}

          <div>
            <div className="border-border space-y-2 border-b">
              <h2 className="text-lg font-semibold sm:text-2xl">
                Favorite Games
              </h2>

              <div className="mb-6 grid grid-cols-5 gap-2">
                {mockUserGames
                  .filter((userGame) => userGame.user_id === user.id)
                  .slice(0, 5)
                  .map((userGame) => {
                    const game = mockGames.find(
                      (game) => game.id === userGame.game_id,
                    );

                    if (!game) return null;

                    return (
                      <div
                        key={userGame.id}
                        className="relative aspect-3/4 w-full max-w-40"
                      >
                        <Link href="/">
                          <Image
                            src={game?.cover_url ?? ""}
                            alt={game?.title ?? "No game"}
                            className="border-border h-auto rounded-sm border-2"
                            width={300}
                            height={300}
                          />
                        </Link>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* STATS */}
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
