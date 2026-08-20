import { mockUsers } from "@/mocks/data/mockUsers";

import ProfileUserCard from "@/features/profile/components/ProfileUserCard";
import ProfileNavbar from "@/features/profile/components/ProfileNavbar";

type UserLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    username: string;
  }>;
};

const UserLayout = async ({ children, params }: UserLayoutProps) => {
  const { username } = await params;

  const user = mockUsers.find((user) => user.username === username);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-6xl p-2">
      <div className="space-y-4">
        {/* PROFILE HEADER */}
        <div className="flex flex-col gap-2 border-b border-border">
          <ProfileUserCard user={user} />

          <ProfileNavbar />
        </div>

        {/* PAGE CONTENT */}
        {children}
      </div>
    </div>
  );
};

export default UserLayout;
