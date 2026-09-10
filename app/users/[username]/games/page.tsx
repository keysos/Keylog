import type { GameStatus } from "@/types";
import Link from "next/link";
import { profileByName, type EntryWithGame } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import ProfileGamesGrid from "@/features/profile/components/ProfileGamesGrid";
import { GamesPagination } from "@/features/games/components/GamesPagination";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const user = await profileByName((await params).username);
  const search = await searchParams;
  const statuses = ["completed", "playing", "backlog", "dropped"];
  const status = statuses.includes(search.status ?? "")
    ? (search.status as GameStatus)
    : "completed";
  const page = Math.max(1, Math.floor(Number(search.page) || 1));
  const db = await createClient();
  const { data, error, count } = await db
    .from("user_games")
    .select("*, games(*)", { count: "exact" })
    .eq("user_id", user.id)
    .eq("status", status)
    .order("updated_at", { ascending: false })
    .range((page - 1) * 40, page * 40 - 1);
  if (error) throw error;
  return (
    <div className="space-y-6">
      <nav aria-label="Game status" className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <Link
            key={s}
            aria-current={s === status ? "page" : undefined}
            className={`rounded-md border border-border px-3 py-2 text-sm capitalize ${s === status ? "bg-primary text-white" : "hover:bg-accent"}`}
            href={`?status=${s}`}
          >
            {s}
          </Link>
        ))}
      </nav>
      <ProfileGamesGrid games={data as unknown as EntryWithGame[]} />
      {(count ?? 0) > 40 && (
        <GamesPagination
          currentPage={page}
          totalPages={Math.ceil(count! / 40)}
        />
      )}
    </div>
  );
}
