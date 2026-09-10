"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.svg";
import SearchBar from "./SearchBar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
export default function Navbar() {
  const [open, setOpen] = useState(false),
    [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  async function logout() {
    try {
      const { error } = await createClient().auth.signOut();
      if (error) throw error;
      setOpen(false);
      router.replace("/");
      router.refresh();
    } catch {
      setError("Unable to log out. Try again.");
    }
  }
  const links = (
    <>
      {user ? (
        <>
          <Link href="/account" onClick={() => setOpen(false)}>
            Profile
          </Link>
          <Button variant="ghost" onClick={logout}>
            Log out
          </Button>
        </>
      ) : (
        <>
          <Link href="/login" onClick={() => setOpen(false)}>
            Log in
          </Link>
          <Link href="/signup" onClick={() => setOpen(false)}>
            Sign up
          </Link>
        </>
      )}
    </>
  );
  return (
    <header className="relative border-b border-border/60 px-4">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 py-3"
      >
        <Link href="/">
          <Image src={logo} alt="Keylog" className="h-8 w-18" priority />
        </Link>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/games">Games</Link>
          <div className="hidden items-center gap-4 sm:flex">
            {links}
            <SearchBar />
          </div>
          <Button
            className="sm:hidden"
            size="icon"
            variant="ghost"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>
      {open && (
        <div className="absolute top-full left-0 z-50 flex w-full flex-col gap-4 border-b border-border bg-background p-4 sm:hidden">
          {links}
          <SearchBar />
        </div>
      )}
      {error && <p role="alert">{error}</p>}
    </header>
  );
}
