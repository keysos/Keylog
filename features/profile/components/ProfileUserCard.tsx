import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaSteam } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiEdit2 } from "react-icons/fi";
import Image from "next/image";
import type { User } from "@/types";

type ProfileUserCardProps = {
  user: User;
};

const ProfileUserCard = ({ user }: ProfileUserCardProps) => {
  return (
    <div className="flex gap-6">
      <Image
        src={user.avatar_url ?? ""}
        alt={user.display_name ?? "username profile pictures"}
        width={80}
        height={80}
        className="h-24 w-24 rounded-sm"
      />

      <div className="flex w-full flex-col justify-center gap-2">
        <h1 className="text-xl font-semibold">{user.display_name}</h1>

        <div className="text-muted-foreground flex items-center justify-between gap-2">
          {/* Social Networks */}
          <div className="flex gap-4">
            <Link href="/" className="hover:text-foreground">
              <FaSteam />
            </Link>

            <Link href="/" className="hover:text-foreground">
              <FaXTwitter />
            </Link>
          </div>

          <Button variant={"ghost"} size={"icon"} className={"p-0"}>
            <FiEdit2 />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileUserCard;
