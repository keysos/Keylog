import { profileByName } from "@/lib/data";
import ProfileUserCard from "@/features/profile/components/ProfileUserCard";
import ProfileNavbar from "@/features/profile/components/ProfileNavbar";
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await profileByName(username);
  return (
    <div className="mx-auto my-8 w-full max-w-6xl space-y-6 px-4">
      <div className="space-y-4 border-b border-border">
        <ProfileUserCard user={user} />
        <ProfileNavbar username={user.username} />
      </div>
      {children}
    </div>
  );
}
