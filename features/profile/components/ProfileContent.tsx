import { mockGames } from "@/mocks/data/mockGames";
import { mockUserGames } from "@/mocks/data/mockUserGames";
import { mockReviews } from "@/mocks/data/mockReviews";

import Link from "next/link";
import Image from "next/image";
import ReviewCard from "@/features/reviews/components/ReviewCard";
import { User } from "@/types";
import { Button } from "@/components/ui/button";

type ProfileContentProps = {
  user: User;
};

const ProfileContent = ({ user }: ProfileContentProps) => {
  return (
    <div className="mt-4 space-y-2">
      <h2 className="text-lg font-semibold sm:text-2xl">Recently Played</h2>
      <div className="mb-6 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {mockUserGames
          .filter((userGame) => userGame.user_id === user.id)
          .slice(0, 5)
          .map((userGame, index) => {
            const game = mockGames.find((game) => game.id === userGame.game_id);

            if (!game) return null;

            return (
              <div
                key={userGame.id}
                className={`relative aspect-3/4 w-full max-w-40 ${
                  index >= 3 ? "hidden sm:block" : ""
                }`}
              >
                <Link href="/">
                  <Image
                    src={game?.cover_url ?? ""}
                    alt={game?.title ?? "No game"}
                    className="h-auto rounded-sm border-2 border-border"
                    width={300}
                    height={300}
                  />
                </Link>
              </div>
            );
          })}
      </div>
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold sm:text-2xl">Recently Reviewed</h2>
        <Button className={"h-auto p-0"} variant={"link"}>
          <Link href="/">View all</Link>
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {mockReviews
          .filter((review) => review.user_id === user.id)
          .slice(0, 3)
          .map((review) => {
            const game = mockGames.find((game) => game.id === review.game_id);

            if (!game) return null;

            return (
              <ReviewCard
                key={review.id}
                game={game}
                user={user}
                review={review}
                className="border-b border-border py-2"
              />
            );
          })}
      </div>
    </div>
  );
};

export default ProfileContent;
