import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@/lib/data";
import type { User } from "@/types";
export default async function ProfileUserCard({ user }: { user: User }) {
  const viewer = await currentUser();
  return (
    <div className="flex items-center gap-4 py-3">
      {user.avatar_url ? (
        <Image
          src={user.avatar_url}
          alt={`${user.username}'s avatar`}
          width={88}
          height={88}
          unoptimized
          className="h-20 w-20 rounded-md object-cover"
        />
      ) : (
        <div className="flex h-20 w-20 items-center justify-center rounded-md bg-secondary text-3xl font-semibold">
          {user.username[0].toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-2xl font-semibold">
          {user.display_name || user.username}
        </h1>
        <p className="text-sm text-muted-foreground">@{user.username}</p>
      </div>
      {viewer?.id === user.id && (
        <Link
          className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent"
          href="/settings/profile"
        >
          Edit profile
        </Link>
      )}
    </div>
  );
}
