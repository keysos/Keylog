import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { isConfigured } from "./supabase/config";
import type { User, Game, Review, UserGame } from "@/types";
export const currentUser = cache(async () => {
  if (!isConfigured()) return null;
  const db = await createClient();
  const {
    data: { user },
    error,
  } = await db.auth.getUser();
  if (error && error.name !== "AuthSessionMissingError")
    throw new Error("Unable to verify your session. Please try again.");
  return user;
});
export async function requireUser() {
  const user = await currentUser();
  if (!user) redirect("/login");
  return user;
}
export const profileByName = cache(async (username: string) => {
  const db = await createClient();
  const { data, error } = await db
    .from("profiles")
    .select("*")
    .eq("username", username.toLowerCase())
    .maybeSingle();
  if (error) throw error;
  if (!data) notFound();
  return data;
});
export const myProfile = cache(async () => {
  const user = await currentUser();
  if (!user) return null;
  const db = await createClient();
  const { data, error } = await db
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (error) throw error;
  return data;
});
export type EntryWithGame = UserGame & { games: Game };
export type ReviewWithRelations = Review & { games: Game; profiles: User };
export async function entries(userId: string, limit = 5) {
  const db = await createClient();
  const { data, error } = await db
    .from("user_games")
    .select("*, games(*)")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("Erro ao buscar reviews:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    throw new Error(`Erro ao buscar reviews: ${error.message}`);
  }
  return data as unknown as EntryWithGame[];
}
export async function reviews(
  userId?: string,
  limit = 12,
  offset = 0,
  gameId?: number,
) {
  const db = await createClient();
  let query = db
    .from("reviews")
    .select("*, games(*), profiles(*)", { count: "exact" })
    .order("created_at", { ascending: false });
  if (userId) query = query.eq("user_id", userId);
  if (gameId) query = query.eq("game_id", gameId);
  const { data, error, count } = await query.range(offset, offset + limit - 1);
  if (error) throw error;
  return { items: data as unknown as ReviewWithRelations[], count: count ?? 0 };
}
