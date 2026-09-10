import { profileByName } from "@/lib/data";
import ReviewFeed from "@/features/reviews/components/ReviewFeed";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await profileByName((await params).username);
  const page = Math.max(1, Math.floor(Number((await searchParams).page) || 1));
  return (
    <section>
      <h2 className="text-xl font-semibold">Reviews</h2>
      <ReviewFeed userId={user.id} page={page} paginate />
    </section>
  );
}
