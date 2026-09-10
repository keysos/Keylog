"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
type Mode = "login" | "signup" | "forgot" | "reset";
export default function AuthForm({ mode }: { mode: Mode }) {
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [show, setShow] = useState(false);
  const router = useRouter();
  const titles = {
    login: "Log in",
    signup: "Create your account",
    forgot: "Forgot password",
    reset: "Reset password",
  };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    try {
      const db = createClient();
      if (mode === "login") {
        const { error } = await db.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace("/");
        router.refresh();
      }
      if (mode === "signup") {
        const username = String(form.get("username")).trim().toLowerCase();
        if (!/^[a-z0-9_]{3,24}$/.test(username))
          throw new Error(
            "Use 3–24 letters, numbers or underscores for your username.",
          );
        const { data: existing, error: lookupError } = await db
          .from("profiles")
          .select("id")
          .eq("username", username)
          .maybeSingle();
        if (lookupError) throw lookupError;
        if (existing) throw new Error("This username is already taken.");
        const { data, error } = await db.auth.signUp({
          email,
          password,
          options: {
            data: { username },
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        if (data.session) {
          router.replace("/");
          router.refresh();
        } else
          setMessage(
            "Check your email to confirm your account before logging in.",
          );
      }
      if (mode === "forgot") {
        const { error } = await db.auth.resetPasswordForEmail(email, {
          redirectTo: `${location.origin}/auth/callback?next=/reset-password`,
        });
        if (error) throw error;
        setMessage(
          "If this email has an account, you will receive a password reset link.",
        );
      }
      if (mode === "reset") {
        if (password !== form.get("confirm"))
          throw new Error("Passwords do not match.");
        const { error } = await db.auth.updateUser({ password });
        if (error) throw error;
        await db.auth.signOut();
        router.replace("/login?reset=success");
        router.refresh();
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to complete this request. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-14">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-3xl font-semibold">{titles[mode]}</h1>
        {mode === "forgot" && (
          <p className="text-muted-foreground">
            Enter the email used for your account.
          </p>
        )}
        <form onSubmit={submit} className="space-y-5">
          <fieldset disabled={busy} className="space-y-5">
            {mode === "signup" && (
              <label className="block space-y-2">
                <span>Username</span>
                <Input
                  name="username"
                  autoComplete="username"
                  required
                  minLength={3}
                  maxLength={24}
                  pattern="[a-zA-Z0-9_]+"
                />
              </label>
            )}
            {mode !== "reset" && (
              <label className="block space-y-2">
                <span>Email</span>
                <Input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </label>
            )}
            {mode !== "forgot" && (
              <label className="block space-y-2">
                <span>Password</span>
                <div className="relative">
                  <Input
                    name="password"
                    className="pr-12"
                    type={show ? "text" : "password"}
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    required
                    minLength={mode === "login" ? 1 : 8}
                    maxLength={128}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0"
                    aria-label={show ? "Hide password" : "Show password"}
                    onClick={() => setShow(!show)}
                  >
                    {show ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </label>
            )}
            {mode === "reset" && (
              <label className="block space-y-2">
                <span>Confirm password</span>
                <Input
                  name="confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
              </label>
            )}
            <Button type="submit" className="w-full">
              {busy
                ? "Please wait…"
                : mode === "forgot"
                  ? "Send reset link"
                  : titles[mode]}
            </Button>
          </fieldset>
        </form>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="text-sm text-primary">
            {message}
          </p>
        )}
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <Link href={mode === "login" ? "/signup" : "/login"}>
            {mode === "login" ? "Create an account" : "Back to login"}
          </Link>
          {mode === "login" && (
            <Link href="/forgot-password">Forgot your password?</Link>
          )}
        </div>
      </div>
    </div>
  );
}
