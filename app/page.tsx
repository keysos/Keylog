import Home from "@/features/home/Home";
import { currentUser } from "@/lib/data";
import { isConfigured } from "@/lib/supabase/config";
export default async function Page() {
  if (!isConfigured())
    return (
      <div className="mx-auto max-w-xl space-y-4 px-4 py-16">
        <h1 className="text-3xl font-semibold">Set up Keylog</h1>
        <p className="text-muted-foreground">
          Add your Supabase environment variables to .env.local and restart the
          app. The complete instructions are in SETUP.md.
        </p>
      </div>
    );
  return <Home isLoggedIn={Boolean(await currentUser())} />;
}
