import { myProfile } from "@/lib/data";
import ProfileStats from "@/features/profile/components/ProfileStats";
import Link from "next/link";
export default async function UserOverview() {
  const user = await myProfile();
  if (!user) return null;
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">
        Welcome back, {user.display_name || user.username}
      </h1>
      <Link
        href={`/users/${user.username}/games`}
        className="text-sm text-primary"
      >
        View your games
      </Link>
      <ProfileStats userId={user.id} />
    </section>
  );
}
