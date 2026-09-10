import { requireUser, myProfile } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import ProfileEditor from "@/features/profile/components/ProfileEditor";
export default async function Page() {
  await requireUser();
  const profile = await myProfile();
  const db = await createClient();
  let favorite = null;
  if (profile!.favorite_game_id) {
    const { data, error } = await db
      .from("games")
      .select("title,slug")
      .eq("id", profile!.favorite_game_id)
      .single();
    if (error) throw error;
    favorite = data as { title: string; slug: string };
  }
  return <ProfileEditor profile={profile!} favorite={favorite} />;
}
