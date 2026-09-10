"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import placeholder from "@/assets/placeholder.png";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { ListWithGames } from "@/types/list";
export default function ProfileLists({
  lists,
  userId,
  isOwner,
}: {
  lists: ListWithGames[];
  userId: string;
  isOwner: boolean;
}) {
  const [open, setOpen] = useState(false),
    [title, setTitle] = useState(""),
    [description, setDescription] = useState(""),
    [privateList, setPrivate] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const router = useRouter();
  async function create(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data, error } = await createClient()
        .from("lists")
        .insert({
          user_id: userId,
          title: title.trim(),
          description: description.trim() || null,
          is_private: privateList,
        })
        .select("id")
        .single();
      if (error) throw error;
      setOpen(false);
      router.push(`/lists/${data.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to create list.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-6">
      {isOwner && <Button onClick={() => setOpen(true)}>Create list</Button>}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create list</DialogTitle>
            <DialogDescription>
              Choose a name and who can view this list.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={create} className="space-y-4">
            <fieldset disabled={busy} className="space-y-4">
              <label className="block space-y-2 text-sm">
                <span>Title</span>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={100}
                />
              </label>
              <label className="block space-y-2 text-sm">
                <span>Description</span>
                <textarea
                  className="keylog-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={2000}
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={privateList}
                  onChange={(e) => setPrivate(e.target.checked)}
                />
                Private list
              </label>
              <Button type="submit" disabled={!title.trim()}>
                {busy ? "Creating…" : "Create list"}
              </Button>
            </fieldset>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </form>
        </DialogContent>
      </Dialog>
      {!lists.length && (
        <p className="rounded-md border border-dashed border-border p-8 text-center text-muted-foreground">
          {isOwner
            ? "No lists yet. Create your first list."
            : "No public lists yet."}
        </p>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {lists.map((list) => {
          const games = list.list_games.slice(0, 4).map((x) => x.games);
          return (
            <Link
              key={list.id}
              href={`/lists/${list.id}`}
              className="rounded-md border border-border bg-card p-4 transition hover:border-primary"
            >
              <div className="relative h-32 w-full">
                {games.length ? (
                  games.map((game, i) => {
                    const progress =
                      games.length > 1 ? i / (games.length - 1) : 0.5;
                    return (
                      <div
                        key={game.id}
                        className="absolute top-0 aspect-3/4 w-24 overflow-hidden rounded-md"
                        style={{
                          left: `calc(${progress * 100}% - ${progress * 96}px)`,
                          zIndex: games.length - i,
                        }}
                      >
                        <Image
                          src={game.cover_url ?? placeholder}
                          alt={game.title}
                          fill
                          className="border border-border object-cover"
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="flex h-full items-center justify-center rounded bg-muted text-sm text-muted-foreground">
                    No games yet
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-start justify-between gap-2">
                <h2 className="font-medium break-words">{list.title}</h2>
                <span className="text-xs text-muted-foreground">
                  {list.is_private ? "Private" : "Public"}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {list.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
