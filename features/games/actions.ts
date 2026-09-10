"use server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { ensureGame } from "@/lib/igdb/persist";
import { revalidatePath } from "next/cache";
const slugSchema = z.string().regex(/^[a-zA-Z0-9-]{1,250}$/);
const rating = z.number().min(0.5).max(5).multipleOf(0.5);
async function context(slug: string) {
  slugSchema.parse(slug);
  const db = await createClient();
  const {
    data: { user },
    error,
  } = await db.auth.getUser();
  if (error || !user) throw new Error("Log in to continue.");
  return { db, user, gameId: await ensureGame(slug) };
}
async function run(action: () => Promise<void>) {
  try {
    await action();
    revalidatePath("/", "layout");
    return { ok: true, error: "" };
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof Error ? e.message : "Unable to save. Please try again.",
    };
  }
}
export async function saveEntry(slug: string, input: unknown) {
  return run(async () => {
    const value = z
      .object({
        status: z.enum(["backlog", "playing", "completed", "dropped"]),
        rating: rating.nullable(),
        started_at: z.iso.date().nullable(),
        completed_at: z.iso.date().nullable(),
      })
      .parse(input);
    if (
      value.started_at &&
      value.completed_at &&
      value.started_at > value.completed_at
    )
      throw new Error("Completion date must be on or after the start date.");
    const { db, user, gameId } = await context(slug);
    const { error } = await db
      .from("user_games")
      .upsert(
        { ...value, user_id: user.id, game_id: gameId },
        { onConflict: "user_id,game_id" },
      );
    if (error) throw error;
  });
}
export async function removeEntry(slug: string) {
  return run(async () => {
    const { db, user, gameId } = await context(slug);
    const { error } = await db
      .from("user_games")
      .delete()
      .eq("user_id", user.id)
      .eq("game_id", gameId);
    if (error) throw error;
  });
}
export async function saveReview(slug: string, input: unknown) {
  return run(async () => {
    const value = z
      .object({ content: z.string().trim().min(1).max(10000), rating })
      .parse(input);
    const { db, user, gameId } = await context(slug);
    const { error } = await db
      .from("reviews")
      .upsert(
        { ...value, user_id: user.id, game_id: gameId },
        { onConflict: "user_id,game_id" },
      );
    if (error) throw error;
  });
}
export async function removeReview(slug: string) {
  return run(async () => {
    const { db, user, gameId } = await context(slug);
    const { error } = await db
      .from("reviews")
      .delete()
      .eq("user_id", user.id)
      .eq("game_id", gameId);
    if (error) throw error;
  });
}
export async function addToList(slug: string, listId: string) {
  return run(async () => {
    z.uuid().parse(listId);
    const { db, user, gameId } = await context(slug);
    const { data: list, error: readError } = await db
      .from("lists")
      .select("id")
      .eq("id", listId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (readError) throw readError;
    if (!list) throw new Error("List not found.");
    const { error } = await db
      .from("list_games")
      .upsert(
        { list_id: listId, game_id: gameId },
        { onConflict: "list_id,game_id", ignoreDuplicates: true },
      );
    if (error) throw error;
  });
}
export async function setFavorite(slug: string, position: number | null) {
  return run(async () => {
    if (position !== null) z.number().int().min(1).max(5).parse(position);
    const { db, gameId } = await context(slug);
    const { error } = await db.rpc("set_favorite", {
      target_game_id: gameId,
      target_position: position,
    });
    if (error) throw error;
  });
}
