import { MdStar, MdStarHalf, MdStarOutline } from "react-icons/md";

type RatingStarsProps = {
  rating: number;
  className: string;
};

export function RatingStars({ rating, className }: RatingStarsProps) {
  return (
    <div className={`text-primary flex ${className}`}>
      {Array.from({ length: 5 }, (_, index) => {
        const star = index + 1;

        if (rating >= star) {
          return <MdStar key={index} />;
        }

        if (rating >= star - 0.5) {
          return <MdStarHalf key={index} />;
        }

        return <MdStarOutline key={index} />;
      })}
    </div>
  );
}
