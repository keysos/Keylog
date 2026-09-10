"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StarRatingInput from "@/components/shared/StarRatingInput";
import {
  saveEntry,
  removeEntry,
  saveReview,
  removeReview,
  addToList,
  setFavorite,
} from "../actions";
import type { UserGame, Review, List, GameStatus } from "@/types";
export default function GameActions({
  slug,
  entry,
  review,
  lists,
  favoritePosition,
}: {
  slug: string;
  entry: UserGame | null;
  review: Review | null;
  lists: List[];
  favoritePosition: number | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<GameStatus>(entry?.status ?? "backlog"),
    [rating, setRating] = useState<number | null>(entry?.rating ?? null),
    [reviewRating, setReviewRating] = useState<number | null>(
      review?.rating ?? null,
    ),
    [content, setContent] = useState(review?.content ?? ""),
    [start, setStart] = useState(entry?.started_at ?? ""),
    [end, setEnd] = useState(entry?.completed_at ?? ""),
    [list, setList] = useState(lists[0]?.id ?? ""),
    [slot, setSlot] = useState(favoritePosition ?? 1),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  async function perform(
    action: () => Promise<{ ok: boolean; error: string }>,
    success: string,
  ) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await action();
      if (!result.ok) setError(result.error);
      else {
        setMessage(success);
        router.refresh();
      }
    } catch {
      setError("Connection failed. Try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="space-y-6 rounded-md border border-border bg-card p-4 sm:p-6">
      <h2 className="text-xl font-semibold">Your activity</h2>
      <fieldset disabled={busy} className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="font-medium">Game log</h3>
          <label className="block space-y-2">
            <span className="text-sm">Status</span>
            <select
              className="keylog-input"
              value={status}
              onChange={(e) => setStatus(e.target.value as GameStatus)}
            >
              {["backlog", "playing", "completed", "dropped"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <StarRatingInput
            value={rating}
            onChange={setRating}
            label="Your rating"
          />
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-2 text-sm">
              Started
              <Input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </label>
            <label className="space-y-2 text-sm">
              Completed
              <Input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                perform(
                  () =>
                    saveEntry(slug, {
                      status,
                      rating,
                      started_at: start || null,
                      completed_at: end || null,
                    }),
                  "Game log saved.",
                )
              }
            >
              Save game log
            </Button>
            {entry && (
              <Button
                variant="outline"
                onClick={() => {
                  if (
                    confirm(
                      "Remove this game from your log? Your review is kept.",
                    )
                  )
                    void perform(
                      () => removeEntry(slug),
                      "Game removed from your log.",
                    );
                }}
              >
                Remove log
              </Button>
            )}
          </div>
          <div className="space-y-3 border-t border-border pt-4">
            <h3 className="text-sm">Favorite games</h3>
            <label className="block text-sm">
              Profile position
              <select
                className="keylog-input mt-2"
                value={slot}
                onChange={(e) => setSlot(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    Position {n}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-xs text-muted-foreground">
              Saving replaces the game in this position.
            </p>
            <Button
              variant="outline"
              onClick={() =>
                perform(() => setFavorite(slug, slot), "Favorite saved.")
              }
            >
              Save favorite
            </Button>
            {favoritePosition && (
              <Button
                variant="ghost"
                onClick={() =>
                  perform(() => setFavorite(slug, null), "Favorite removed.")
                }
              >
                Remove favorite
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-medium">Your review</h3>
          <StarRatingInput
            label="Review rating"
            value={reviewRating}
            onChange={setReviewRating}
          />
          <label className="block space-y-2 text-sm">
            <span>Review</span>
            <textarea
              className="keylog-input min-h-36"
              value={content}
              maxLength={10000}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your review"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={!content.trim() || !reviewRating}
              onClick={() =>
                perform(
                  () => saveReview(slug, { content, rating: reviewRating }),
                  "Review saved.",
                )
              }
            >
              {review ? "Update review" : "Publish review"}
            </Button>
            {review && (
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm("Delete your review?"))
                    void perform(() => removeReview(slug), "Review deleted.");
                }}
              >
                Delete review
              </Button>
            )}
          </div>
          <div className="space-y-3 border-t border-border pt-4">
            <h3 className="text-sm">Add to a list</h3>
            {lists.length ? (
              <>
                <select
                  aria-label="Choose a list"
                  className="keylog-input"
                  value={list}
                  onChange={(e) => setList(e.target.value)}
                >
                  {lists.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title}
                    </option>
                  ))}
                </select>
                <Button
                  variant="outline"
                  onClick={() =>
                    perform(() => addToList(slug, list), "Game added to list.")
                  }
                >
                  Add game
                </Button>
              </>
            ) : (
              <Link className="text-sm text-primary" href="/account">
                Create a list from your profile
              </Link>
            )}
          </div>
        </div>
      </fieldset>
      {busy && (
        <p role="status" className="text-sm text-muted-foreground">
          Saving…
        </p>
      )}
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
    </section>
  );
}
