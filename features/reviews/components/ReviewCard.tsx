"use client";

/* Hooks */

import { useState } from "react";

/* Components */
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/shared/RatingStars";
import placeholder from "@/assets/placeholder.png";

/* Types */

import type { Review, Game, User } from "@/types";

/* Next.js */

import Link from "next/link";
import Image from "next/image";

type ReviewCardProps = {
  review: Review;
  game: Game;
  user: User;
  className?: string;
};

const ReviewCard = ({ review, game, user, className }: ReviewCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`flex w-full gap-4 ${className}`}>
      <div className="relative aspect-3/4 w-full max-w-20 sm:max-w-30">
        <Link href={`/games/${game.slug}`}>
          <Image
            src={game?.cover_url ?? placeholder}
            alt={game?.title}
            className="h-auto rounded-sm border-2 border-border"
            width={300}
            height={300}
          />
        </Link>
      </div>
      <div className="flex w-2/3 flex-col gap-2">
        <p>
          <Link href={`/users/${user.username}`} className="hover:text-primary">
            {user.display_name || user.username}
          </Link>{" "}
          <span className="text-muted-foreground">reviewed</span> {game.title}
        </p>
        <div>
          <RatingStars rating={review.rating} className="text-lg" />
        </div>
        <div className="text-sm text-muted-foreground">
          <p
            className={`break-words whitespace-pre-wrap ${isExpanded ? "" : "line-clamp-3"}`}
          >
            {review.content}
          </p>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              variant={"ghost"}
              className={"hover:bg-transparent"}
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
