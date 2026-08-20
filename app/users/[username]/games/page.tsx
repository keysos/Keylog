import { GamesPagination } from "@/features/games/components/GamesPagination";
import ProfileGamesGrid from "@/features/profile/components/ProfileGamesGrid";
import { mockUserGames } from "@/mocks/data/mockUserGames";
import { mockUsers } from "@/mocks/data/mockUsers";
import { notFound } from "next/navigation";

type ProfileGamesProps = {
  params: Promise<{
    username: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
};

const GAMES_PER_PAGE = 40;

const ProfileGames = async ({ params, searchParams }: ProfileGamesProps) => {
  const { username } = await params;
  const { page } = await searchParams;

  const user = mockUsers.find((user) => user.username === username);

  if (!user) {
    notFound();
  }

  const userGames = mockUserGames.filter(
    (userGame) => userGame.user_id === user.id,
  );

  const currentPage = Math.max(1, Number(page) || 1);

  const totalPages = Math.ceil(userGames.length / GAMES_PER_PAGE);

  const start = (currentPage - 1) * GAMES_PER_PAGE;
  const end = start + GAMES_PER_PAGE;

  const paginatedGames = userGames.slice(start, end);

  return (
    <div className="space-y-4">
      <ProfileGamesGrid games={paginatedGames} />

      {totalPages > 1 && (
        <GamesPagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
};

export default ProfileGames;
