import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

import Link from "next/link";
import SearchBar from "./SearchBar";

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
    <div className="sm:hidden">
      <Button variant={"ghost"} className={className} onClick={handleClick}>
        <Menu
          className={`h-5 w-5 transition-transform duration-300 ${isOpen ? "-rotate-90" : ""}`}
        />
      </Button>

      <div
        className={`absolute top-full left-0 z-50 flex w-full flex-col transition-all duration-300 sm:hidden ${isOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
      >
        <div className="flex flex-col gap-2 border-b-2 bg-background p-2">
          <Link
            className="rounded-sm bg-primary p-2 text-center text-primary-foreground hover:bg-primary/80"
            href="/login"
          >
            Log In
          </Link>
          <Link
            className="rounded-sm bg-primary p-2 text-center text-primary-foreground hover:bg-primary/80"
            href="/signup"
          >
            Sign Up
          </Link>

          <div>
            <SearchBar />
          </div>
        </div>
      </div>
    </div>
  );
}
