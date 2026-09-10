"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ProfileNavbar = ({ username }: { username: string }) => {
  const pathname = usePathname();

  const tabs = [
    { label: "Profile", href: `/users/${username}` },
    { label: "Games", href: `/users/${username}/games` },
    { label: "Lists", href: `/users/${username}/lists` },
    { label: "Reviews", href: `/users/${username}/reviews` },
  ];

  return (
    <div className="flex gap-2 text-center text-muted-foreground">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`relative w-full p-2 hover:text-foreground ${
              isActive ? "text-foreground" : ""
            }`}
          >
            {tab.label}

            {isActive && (
              <div className="absolute bottom-0 left-1/4 h-0.5 w-1/2 bg-primary" />
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default ProfileNavbar;
