import { profileByName, currentUser } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import ProfileLists from "@/features/profile/components/ProfileLists";
import { GamesPagination } from "@/features/games/components/GamesPagination";
import type { ListWithGames } from "@/types/list";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await profileByName((await params).username);
  const viewer = await currentUser();
  const page = Math.max(1, Math.floor(Number((await searchParams).page) || 1));
  const db = await createClient();
  const { data, error, count } = await db
    .from("lists")
    .select("*, list_games(*, games(*))", { count: "exact" })
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .range((page - 1) * 12, page * 12 - 1)
    .limit(4, { referencedTable: "list_games" });
  if (error) throw error;
  return (
    <div className="space-y-6">
      <ProfileLists
        lists={data as unknown as ListWithGames[]}
        userId={user.id}
        isOwner={viewer?.id === user.id}
      />
      {(count ?? 0) > 12 && (
        <GamesPagination
          currentPage={page}
          totalPages={Math.ceil(count! / 12)}
        />
      )}
    </div>
  );
}
