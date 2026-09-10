import Link from "next/link";
export default function NotFound() {
  return (
    <div className="mx-auto space-y-4 p-8">
      <h1 className="text-2xl">Page not found</h1>
      <p>This profile, game or list is unavailable.</p>
      <Link href="/" className="text-primary">
        Back to home
      </Link>
    </div>
  );
}
