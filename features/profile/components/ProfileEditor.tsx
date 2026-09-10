"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { searchGames } from "@/features/search/actions";
import { saveProfile } from "@/features/profile/actions";
import type { User } from "@/types";
import type { IGDBGame } from "@/lib/igdb/types";
export default function ProfileEditor({
  profile,
  favorite,
}: {
  profile: User;
  favorite: { title: string; slug: string } | null;
}) {
  const router = useRouter();
  const [username, setUsername] = useState(profile.username),
    [name, setName] = useState(profile.display_name ?? ""),
    [bio, setBio] = useState(profile.bio ?? ""),
    [avatar, setAvatar] = useState(profile.avatar_url),
    [file, setFile] = useState<File | null>(null),
    [favoriteSlug, setFavoriteSlug] = useState<string | null>(
      favorite?.slug ?? null,
    ),
    [favoriteTitle, setFavoriteTitle] = useState(favorite?.title ?? ""),
    [query, setQuery] = useState(""),
    [results, setResults] = useState<IGDBGame[]>([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  async function search() {
    setBusy(true);
    setError("");
    try {
      setResults(await searchGames(query, 8, 0));
    } catch {
      setError("Unable to search games.");
    } finally {
      setBusy(false);
    }
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    let uploadedPath: string | null = null;
    try {
      const db = createClient();
      let avatarUrl = avatar;
      if (file) {
        const mimeToExt: Record<string, string> = {
          "image/jpeg": "jpg",
          "image/png": "png",
          "image/webp": "webp",
        };
        if (!mimeToExt[file.type] || file.size > 2097152)
          throw new Error("Choose a JPG, PNG or WebP image up to 2 MB.");
        uploadedPath = `${profile.id}/${crypto.randomUUID()}.${mimeToExt[file.type]}`;
        const { error } = await db.storage
          .from("avatars")
          .upload(uploadedPath, file, {
            contentType: file.type,
            upsert: false,
          });
        if (error) throw error;
        avatarUrl = db.storage.from("avatars").getPublicUrl(uploadedPath)
          .data.publicUrl;
      }
      const result = await saveProfile({
        username: username.toLowerCase().trim(),
        display_name: name.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatarUrl,
        favorite_slug: favoriteSlug,
      });
      if (!result.ok) {
        if (uploadedPath)
          await db.storage.from("avatars").remove([uploadedPath]);
        throw new Error(result.error);
      }
      const oldPath = profile.avatar_url?.split(
        "/storage/v1/object/public/avatars/",
      )[1];
      if (
        oldPath &&
        oldPath.startsWith(`${profile.id}/`) &&
        profile.avatar_url !== avatarUrl
      )
        await db.storage.from("avatars").remove([decodeURIComponent(oldPath)]);
      setAvatar(avatarUrl);
      setFile(null);
      setMessage("Profile saved.");
      router.replace(`/users/${username.toLowerCase().trim()}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update profile.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="mx-auto my-10 w-full max-w-2xl space-y-6 px-4">
      <h1 className="text-2xl font-semibold">Edit profile</h1>
      <form onSubmit={submit}>
        <fieldset disabled={busy} className="space-y-5">
          <div className="space-y-3">
            {avatar && (
              <Image
                src={avatar}
                alt="Current avatar"
                width={88}
                height={88}
                unoptimized
                className="h-22 w-22 rounded-md object-cover"
              />
            )}
            <label className="block space-y-2 text-sm">
              <span>Profile picture</span>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or WebP, up to 2 MB. Profile pictures are public.
            </p>
            {avatar && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setAvatar(null);
                  setFile(null);
                }}
              >
                Remove picture
              </Button>
            )}
          </div>
          <label className="block space-y-2 text-sm">
            <span>Username</span>
            <Input
              required
              minLength={3}
              maxLength={24}
              pattern="[a-zA-Z0-9_]+"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span>Display name</span>
            <Input
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span>Bio</span>
            <textarea
              className="keylog-input min-h-32"
              maxLength={1000}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </label>
          <section className="space-y-3">
            <h2 className="text-sm">Featured favorite</h2>
            <p className="text-xs text-muted-foreground">
              This game also occupies the first favorite position on your
              profile.
            </p>
            {favoriteSlug && (
              <div className="flex items-center gap-2">
                <span className="text-sm">{favoriteTitle}</span>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setFavoriteSlug(null);
                    setFavoriteTitle("");
                  }}
                >
                  Clear
                </Button>
              </div>
            )}
            <div className="flex gap-2">
              <Input
                aria-label="Find favorite game"
                placeholder="Search for a favorite game"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                maxLength={100}
              />
              <Button
                type="button"
                variant="outline"
                onClick={search}
                disabled={query.trim().length < 2}
              >
                Search
              </Button>
            </div>
            <div className="space-y-1">
              {results.map((game) => (
                <button
                  className="block w-full rounded p-2 text-left text-sm hover:bg-accent"
                  type="button"
                  key={game.id}
                  onClick={() => {
                    setFavoriteSlug(game.slug);
                    setFavoriteTitle(game.name);
                    setResults([]);
                  }}
                >
                  {game.name}
                </button>
              ))}
            </div>
          </section>
          <div className="flex items-center gap-4">
            <Button type="submit">{busy ? "Saving…" : "Save profile"}</Button>
            <Link
              className="text-sm text-muted-foreground"
              href={`/users/${profile.username}`}
            >
              Cancel
            </Link>
          </div>
        </fieldset>
      </form>
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
      {message && <p role="status">{message}</p>}
    </div>
  );
}
