"use client";
import { RatingStars } from "./RatingStars";
export default function StarRatingInput({
  value,
  onChange,
  label = "Rating",
}: {
  value: number | null;
  onChange: (value: number | null) => void;
  label?: string;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-sm">{label}</legend>
      <div className="relative w-fit">
        <RatingStars rating={value ?? 0} className="gap-1 text-3xl" />
        <div className="absolute inset-0 flex">
          {Array.from({ length: 10 }, (_, i) => {
            const n = (i + 1) / 2;
            return (
              <label key={n} className="relative h-full flex-1 cursor-pointer">
                <input
                  className="absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
                  type="radio"
                  name={label}
                  value={n}
                  checked={value === n}
                  onChange={() => onChange(n)}
                  aria-label={`${n} out of 5 stars`}
                />
              </label>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        className="text-xs text-muted-foreground hover:text-foreground"
        onClick={() => onChange(null)}
      >
        Clear rating
      </button>
    </fieldset>
  );
}
