"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isConfigured } from "@/lib/supabase/config";
import { useRouter } from "next/navigation";
const AuthContext = createContext<{ user: User | null }>({ user: null });
export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  const [user, setUser] = useState(initialUser);
  const router = useRouter();
  useEffect(() => {
    if (!isConfigured()) return;
    const db = createClient();
    const {
      data: { subscription },
    } = db.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "SIGNED_OUT" || event === "USER_UPDATED") router.refresh();
    });
    return () => subscription.unsubscribe();
  }, [router]);
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
