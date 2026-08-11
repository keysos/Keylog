"use client";

/* Hooks */

import { useState } from "react";

/* Components */
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/games/RatingStars";
import placeholder from "@/assets/placeholder.png";

/* Types */

import type { Review, Game, User } from "@/mocks/types";

/* Next.js */

import Link from "next/link";
import Image from "next/image";

type ReviewCardProps = {
  review: Review;
  game: Game;
  user: User;
};

const ReviewCard = ({ review, game, user }: ReviewCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      key={review.id}
      className="border-border bg-card flex w-full gap-4 rounded-sm border p-4"
    >
      <div className="flex-1">
        <Link href="/">
          <Image
            src={game?.cover_url ?? placeholder}
            alt={game?.title}
            className="border-border w-full rounded-sm border-2"
            width={60}
            height={80}
          />
        </Link>
      </div>
      <div className="flex w-2/3 flex-col gap-2">
        <p>
          {user.display_name}{" "}
          <span className="text-muted-foreground">reviewed</span> {game.title}
        </p>
        <div>
          <RatingStars rating={review.rating} className="text-lg" />
        </div>
        <div className="text-muted-foreground text-sm">
          <p className={isExpanded ? "" : "line-clamp-3"}>{review.content}</p>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              variant={"ghost"}
            >
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
