"use client";

import Link from "next/link";
import MobileMenu from "./MobileMenu";
import logo from "@/assets/logo.svg";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import Image from "next/image";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const isLogged = useAuthStore((state) => state.isLogged);

  function handleClick() {
    setIsOpen((prev) => !prev);
  }

  return (
    <div
      className={`bg-background relative ${isOpen ? "" : "border-border border-b"}`}
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-2 text-sm sm:px-0 sm:py-3 sm:text-base">
        {isLogged && (
          <Link href="/">
            <Image src={logo} alt="Keylog" className="h-10 w-18" />
          </Link>
        )}

        {!isLogged && <div></div>}

        <div className="flex items-center gap-4">
          <Link
            href="/games"
            className="text-muted-foreground hover:text-foreground transition-colors duration-300"
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
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
