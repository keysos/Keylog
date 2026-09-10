import { notFound } from "next/navigation";
import { currentUser } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import ListDetail from "@/features/lists/components/ListDetail";
import { GamesPagination } from "@/features/games/components/GamesPagination";
import type { ListWithGames } from "@/types/list";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const page = Math.max(1, Math.floor(Number((await searchParams).page) || 1));
  const db = await createClient();
  const { data: list, error } = await db
    .from("lists")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!list) notFound();
  const [
    { data: items, error: itemsError, count },
    { data: owner, error: ownerError },
    user,
  ] = await Promise.all([
    db
      .from("list_games")
      .select("*, games(*)", { count: "exact" })
      .eq("list_id", id)
      .order("added_at")
      .range((page - 1) * 48, page * 48 - 1),
    db.from("profiles").select("username").eq("id", list.user_id).single(),
    currentUser(),
  ]);
  if (itemsError) throw itemsError;
  if (ownerError) throw ownerError;
  return (
    <div className="w-full">
      <ListDetail
        list={{ ...list, list_games: items } as unknown as ListWithGames}
        isOwner={user?.id === list.user_id}
        username={owner!.username}
      />
      {(count ?? 0) > 48 && (
        <GamesPagination
          currentPage={page}
          totalPages={Math.ceil(count! / 48)}
        />
      )}
    </div>
  );
}
