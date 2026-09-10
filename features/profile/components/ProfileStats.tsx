import { createClient } from "@/lib/supabase/server";
export default async function ProfileStats({ userId }: { userId: string }) {
  const db = await createClient();
  const statuses = ["completed", "playing", "backlog", "dropped"] as const;
  const counts = await Promise.all(
    statuses.map(async (status) => {
      const { count, error } = await db
        .from("user_games")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", status);
      if (error) throw error;
      return count ?? 0;
    }),
  );
  return (
    <div className="grid grid-cols-2 gap-5 border-b border-border py-6 sm:grid-cols-4">
      {statuses.map((status, i) => (
        <div key={status} className="text-center">
          <p className="text-3xl font-bold sm:text-4xl">
            {String(counts[i]).padStart(3, "0")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground capitalize">
            {status}
          </p>
        </div>
      ))}
    </div>
  );
}
