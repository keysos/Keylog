import { mockUserGames } from "@/mocks/data/mockUserGames";

type ProfileStatsProps = {
  userId: number;
};

const ProfileStats = ({ userId }: ProfileStatsProps) => {
  const userGames = mockUserGames.filter(
    (userGame) => userGame.user_id === userId,
  );

  const played = userGames.filter((game) => game.status === "playing").length;

  const backlogged = userGames.filter(
    (game) => game.status === "backlog",
  ).length;

  const dropped = userGames.filter((game) => game.status === "dropped").length;

  return (
    <div className="flex justify-center gap-8 border-b border-border py-6">
      <div className="flex w-1/3 flex-col items-center text-center">
        <h3 className="text-4xl font-bold sm:text-6xl">
          {String(played).padStart(3, "0")}
        </h3>

        <span className="text-sm text-muted-foreground sm:text-lg">
          Games Played
        </span>
      </div>

      <div className="flex w-1/3 flex-col items-center text-center">
        <h3 className="text-4xl font-bold sm:text-6xl">
          {String(backlogged).padStart(3, "0")}
        </h3>

        <span className="text-sm text-muted-foreground sm:text-lg">
          Games Logged
        </span>
      </div>

      <div className="flex w-1/3 flex-col items-center text-center">
        <h3 className="text-4xl font-bold sm:text-6xl">
          {String(dropped).padStart(3, "0")}
        </h3>

        <span className="text-sm text-muted-foreground sm:text-lg">
          Games Dropped
        </span>
      </div>
    </div>
  );
};

export default ProfileStats;
