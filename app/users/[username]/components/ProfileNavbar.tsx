"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ProfileNavbar = () => {
  const pathname = usePathname();

  const username = "keysos";

  const tabs = [
    { label: "Profile", href: `/users/${username}` },
    { label: "Games", href: `/users/${username}/games` },
    { label: "Lists", href: `/users/${username}/lists` },
    { label: "Reviews", href: `/users/${username}/reviews` },
  ];

  return (
    <div className="text-muted-foreground flex gap-2 text-center">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`hover:text-foreground relative w-full p-2 ${
              isActive ? "text-foreground" : ""
            }`}
          >
            {tab.label}

            {isActive && (
              <div className="bg-primary absolute bottom-0 left-1/4 h-0.5 w-1/2" />
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default ProfileNavbar;
