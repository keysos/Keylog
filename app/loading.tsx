export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="mx-auto w-full max-w-6xl animate-pulse space-y-6 p-6 motion-reduce:animate-none"
    >
      <div className="h-10 w-48 rounded bg-muted" />
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="aspect-3/4 rounded bg-muted" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
