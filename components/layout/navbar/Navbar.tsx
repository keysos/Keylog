"use client";

import Link from "next/link";
import MobileMenu from "./MobileMenu";
import { useState } from "react";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  function handleClick() {
    setIsOpen((prev) => !prev);
  }

  return (
    <div className="bg-background relative">
      <nav
        className={`${isOpen ? "" : "border-border border-b"} flex w-full items-center justify-end gap-4 p-2 text-sm sm:p-3 sm:text-base`}
      >
        <Link
          href="/games"
          className="text-muted-foreground hover:text-foreground hidden transition-colors duration-300 sm:flex"
        >
          Games
        </Link>
        <Link
          className="text-muted-foreground hover:text-foreground hidden transition-colors duration-300 sm:flex"
          href="/login"
        >
          Log In
        </Link>
        <Link
          className="text-muted-foreground hover:text-foreground focus-ring hidden transition-colors duration-300 sm:flex"
          href="/signup"
        >
          Sign Up
        </Link>

        <SearchBar />
        <MobileMenu
          handleClick={handleClick}
          isOpen={isOpen}
          className="text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer sm:hidden"
        />
      </nav>
    </div>
  );
};

export default Navbar;
