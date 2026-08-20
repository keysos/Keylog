import { mockUsers } from "@/mocks/data/mockUsers";
import { notFound } from "next/navigation";

import ProfileNavbar from "@/features/profile/components/ProfileNavbar";
import ProfileUserCard from "@/features/profile/components/ProfileUserCard";
import FavoriteGames from "@/features/profile/components/FavoriteGames";
import ProfileStats from "@/features/profile/components/ProfileStats";
import ProfileContent from "@/features/profile/components/ProfileContent";

type ProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { username } = await params;

  const user = mockUsers.find((user) => user.username === username);

  if (!user) {
    notFound();
  }

  return (
    <div className="flex flex-col px-2 sm:flex-row sm:justify-between sm:gap-4 sm:px-0">
      <div className="w-full sm:w-1/3 md:w-1/4">
        <h2 className="border-b border-border text-lg text-muted-foreground">
          Bio
        </h2>

        <p className="py-2 text-muted-foreground">{user.bio}</p>
      </div>

      {/* RIGHT PANEL */}
      <div>
        <FavoriteGames userId={user.id} />

        {/* STATS */}

        <ProfileStats userId={user.id} />

        <ProfileContent user={user} />
      </div>
    </div>
  );
};

export default ProfilePage;
