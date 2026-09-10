import Link from "next/link";
export default function Page() {
  return (
    <div className="mx-auto max-w-lg space-y-4 p-8">
      <h1 className="text-2xl font-semibold">
        This link could not be verified
      </h1>
      <p className="text-muted-foreground">
        It may have expired or already been used.
      </p>
      <Link className="text-primary" href="/forgot-password">
        Request a new password reset link
      </Link>
      <p>
        <Link href="/login">Back to login</Link>
      </p>
    </div>
  );
}
