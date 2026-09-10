import { myProfile, requireUser } from "@/lib/data";
import { redirect } from "next/navigation";
export default async function Page() {
  await requireUser();
  const profile = await myProfile();
  redirect(`/users/${profile!.username}`);
}
