import ReviewCard from "@/components/reviews/ReviewCard";
import { mockReviews } from "@/mocks/data/mockReviews";

import { mockUsers } from "@/mocks/data/mockUsers";
import { mockGames } from "@/mocks/data/mockGames";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const PopularReviews = () => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between py-1">
        <h2 className="text-lg">Popular reviews</h2>
        <Button variant={"link"}>
          <Link href="/games" className="text-muted-foreground">
            See more
          </Link>
        </Button>
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
  );
};

export default PopularReviews;
