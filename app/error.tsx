"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div role="alert" className="mx-auto max-w-lg space-y-4 p-8">
      <h1 className="text-2xl font-semibold">Unable to load this page</h1>
      <p className="text-muted-foreground">
        Check your connection and try again. If you are setting up Keylog, check
        the configuration steps in SETUP.md.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
