import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import SearchBar from "./SearchBar";

import Link from "next/link";

type MobileMenuProps = {
  className: string;
  isOpen: boolean;
  handleClick: () => void;
};

export default function MobileMenu({
  className,
  handleClick,
  isOpen,
}: MobileMenuProps) {
  return (
    <div>
      <Button variant={"ghost"} className={className} onClick={handleClick}>
        <Menu
          className={`h-5 w-5 transition-transform duration-300 ${isOpen ? "-rotate-90" : ""}`}
        />
      </Button>

      <div
        className={`absolute top-full left-0 z-50 flex w-full flex-col transition-all duration-300 sm:hidden ${isOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
      >
        <div className="bg-background flex flex-col gap-2 border-b-2 p-2">
          <Link
            className="bg-primary text-primary-foreground hover:bg-primary/80 rounded-sm p-2 text-center"
            href="/login"
          >
            Log In
          </Link>
          <Link
            className="bg-primary text-primary-foreground hover:bg-primary/80 rounded-sm p-2 text-center"
            href="/signup"
          >
            Sign Up
          </Link>

          <SearchBar />
        </div>
      </div>
    </div>
  );
}
