import ReviewFeed from "@/features/reviews/components/ReviewFeed";
export default function PopularReviews() {
  return (
    <section>
      <h2 className="text-lg">Recent reviews</h2>
      <ReviewFeed limit={4} />
    </section>
  );
}
