"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import placeholder from "@/assets/placeholder.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { searchGames } from "@/features/search/actions";
import { addToList } from "@/features/games/actions";
import type { ListWithGames } from "@/types/list";
import type { IGDBGame } from "@/lib/igdb/types";
export default function ListDetail({
  list,
  isOwner,
  username,
}: {
  list: ListWithGames;
  isOwner: boolean;
  username: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(list.title),
    [description, setDescription] = useState(list.description ?? ""),
    [privateList, setPrivate] = useState(list.is_private),
    [editing, setEditing] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [query, setQuery] = useState(""),
    [results, setResults] = useState<IGDBGame[]>([]),
    [searched, setSearched] = useState(false);
  async function run(action: () => Promise<void>, success: string) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await action();
      setMessage(success);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save changes.");
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    const { error } = await createClient()
      .from("lists")
      .update({
        title: title.trim(),
        description: description.trim() || null,
        is_private: privateList,
      })
      .eq("id", list.id)
      .select("id")
      .single();
    if (error) throw error;
    setEditing(false);
  }
  async function remove() {
    const { error } = await createClient()
      .from("lists")
      .delete()
      .eq("id", list.id)
      .select("id")
      .single();
    if (error) throw error;
    router.replace(`/users/${username}/lists`);
  }
  return (
    <div className="mx-auto my-8 w-full max-w-6xl space-y-6 px-4">
      <Link
        href={`/users/${username}/lists`}
        className="text-sm text-muted-foreground"
      >
        ← {username}&apos;s lists
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold break-words">{list.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {list.is_private ? "Private list" : "Public list"}
          </p>
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => setEditing(!editing)}
            >
              Edit list
            </Button>
            <Button
              variant="ghost"
              disabled={busy}
              onClick={() => {
                if (confirm("Delete this list and all its entries?"))
                  void run(remove, "List deleted.");
              }}
            >
              Delete list
            </Button>
          </div>
        )}
      </div>
      <p className="break-words whitespace-pre-wrap text-muted-foreground">
        {list.description}
      </p>
      {editing && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void run(save, "List saved.");
          }}
          className="max-w-xl rounded-md border border-border bg-card p-4"
        >
          <fieldset disabled={busy} className="space-y-4">
            <label className="block space-y-2 text-sm">
              <span>Title</span>
              <Input
                required
                value={title}
                maxLength={100}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className="block space-y-2 text-sm">
              <span>Description</span>
              <textarea
                className="keylog-input"
                maxLength={2000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <label className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={privateList}
                onChange={(e) => setPrivate(e.target.checked)}
              />
              Private list
            </label>
            <Button type="submit" disabled={!title.trim()}>
              Save changes
            </Button>
          </fieldset>
        </form>
      )}
      {isOwner && (
        <section className="space-y-3 rounded-md border border-border p-4">
          <h2 className="font-medium">Add games</h2>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void run(async () => {
                setResults(await searchGames(query, 12, 0));
                setSearched(true);
              }, "Search complete.");
            }}
          >
            <Input
              aria-label="Search games to add"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search games"
              minLength={2}
              maxLength={100}
            />
            <Button disabled={busy || query.trim().length < 2}>Search</Button>
          </form>
          {searched && !results.length && (
            <p className="text-sm text-muted-foreground">No games found.</p>
          )}
          <div className="grid gap-2 sm:grid-cols-2">
            {results.map((game) => (
              <div
                key={game.id}
                className="flex items-center justify-between gap-3 rounded bg-secondary p-2"
              >
                <Link href={`/games/${game.slug}`} className="text-sm">
                  {game.name}
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={
                    busy || list.list_games.some((x) => x.game_id === game.id)
                  }
                  onClick={() =>
                    run(async () => {
                      const result = await addToList(game.slug, list.id);
                      if (!result.ok) throw new Error(result.error);
                    }, "Game added.")
                  }
                >
                  {list.list_games.some((x) => x.game_id === game.id)
                    ? "Added"
                    : "Add"}
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="text-sm text-primary">
          {message}
        </p>
      )}
      {busy && (
        <p role="status" className="text-sm text-muted-foreground">
          Please wait…
        </p>
      )}
      {!list.list_games.length && (
        <p className="rounded-md border border-dashed border-border p-8 text-center text-muted-foreground">
          {isOwner
            ? "No games in this list yet."
            : "No visible games in this list."}
        </p>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {list.list_games.map((item) => (
          <article key={item.id} className="min-w-0 space-y-2">
            <Link href={`/games/${item.games.slug}`}>
              <Image
                src={item.games.cover_url ?? placeholder}
                alt={item.games.title}
                width={180}
                height={240}
                className={`aspect-3/4 w-full rounded border border-border object-cover ${item.is_hidden ? "opacity-50" : ""}`}
              />
              <h3 className="mt-2 text-sm">{item.games.title}</h3>
            </Link>
            {isOwner && (
              <div className="space-y-1">
                {item.is_hidden && (
                  <p className="text-xs text-muted-foreground">
                    Hidden from visitors
                  </p>
                )}
                <div className="flex flex-wrap gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={() =>
                      run(
                        async () => {
                          const { error } = await createClient()
                            .from("list_games")
                            .update({ is_hidden: !item.is_hidden })
                            .eq("id", item.id)
                            .select("id")
                            .single();
                          if (error) throw error;
                        },
                        item.is_hidden ? "Game revealed." : "Game hidden.",
                      )
                    }
                  >
                    {item.is_hidden ? "Reveal" : "Hide"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={busy}
                    onClick={() =>
                      run(async () => {
                        const { error } = await createClient()
                          .from("list_games")
                          .delete()
                          .eq("id", item.id)
                          .select("id")
                          .single();
                        if (error) throw error;
                      }, "Game removed.")
                    }
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
