import { profileByName } from "@/lib/data";
import FavoriteGames from "@/features/profile/components/FavoriteGames";
import ProfileStats from "@/features/profile/components/ProfileStats";
import ProfileContent from "@/features/profile/components/ProfileContent";
export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const user = await profileByName((await params).username);
  return (
    <div className="flex flex-col gap-8 sm:flex-row">
      <aside className="w-full space-y-3 sm:w-1/4">
        <h2 className="border-b border-border pb-2 text-lg">Bio</h2>
        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap text-muted-foreground">
          {user.bio || "No bio yet."}
        </p>
      </aside>
      <div className="min-w-0 flex-1">
        <FavoriteGames userId={user.id} />
        <ProfileStats userId={user.id} />
        <ProfileContent user={user} />
      </div>
    </div>
  );
}
