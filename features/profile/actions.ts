"use server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { ensureGame } from "@/lib/igdb/persist";
import { revalidatePath } from "next/cache";
export async function saveProfile(input: unknown) {
  try {
    const value = z
      .object({
        username: z.string().regex(/^[a-z0-9_]{3,24}$/),
        display_name: z.string().max(80).nullable(),
        bio: z.string().max(1000).nullable(),
        avatar_url: z.url().nullable(),
        favorite_slug: z
          .string()
          .regex(/^[a-zA-Z0-9-]{1,250}$/)
          .nullable(),
      })
      .parse(input);
    const db = await createClient();
    const {
      data: { user },
    } = await db.auth.getUser();
    if (!user) throw new Error("Log in to continue.");
    if (value.avatar_url) {
      const prefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${user.id}/`;
      if (!value.avatar_url.startsWith(prefix))
        throw new Error("Invalid avatar URL.");
    }
    const favorite_game_id = value.favorite_slug
      ? await ensureGame(value.favorite_slug)
      : null;
    const { error } = await db
      .from("profiles")
      .update({
        username: value.username,
        display_name: value.display_name,
        bio: value.bio,
        avatar_url: value.avatar_url,
        favorite_game_id,
      })
      .eq("id", user.id)
      .select("id")
      .single();
    if (error) throw error;
    revalidatePath("/", "layout");
    return { ok: true, error: "" };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unable to update profile.",
    };
  }
}
