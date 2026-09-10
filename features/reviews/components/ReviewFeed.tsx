import { reviews } from "@/lib/data";
import ReviewCard from "./ReviewCard";
import { GamesPagination } from "@/features/games/components/GamesPagination";
export default async function ReviewFeed({
  userId,
  gameId,
  limit = 12,
  page = 1,
  paginate = false,
}: {
  userId?: string;
  gameId?: number;
  limit?: number;
  page?: number;
  paginate?: boolean;
}) {
  const { items, count } = await reviews(
    userId,
    limit,
    (page - 1) * limit,
    gameId,
  );
  return (
    <div className="space-y-4">
      {items.length ? (
        items.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            game={review.games}
            user={review.profiles}
            className="border-b border-border py-4"
          />
        ))
      ) : (
        <p className="py-4 text-sm text-muted-foreground">No reviews yet.</p>
      )}
      {paginate && count > limit && (
        <GamesPagination
          currentPage={page}
          totalPages={Math.ceil(count / limit)}
        />
      )}
    </div>
  );
}
