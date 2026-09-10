import "./globals.css";

import type { Metadata } from "next";
import { AuthProvider } from "@/features/auth/components/AuthProvider";
import { currentUser } from "@/lib/data";
import { cn } from "@/lib/utils";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Keylog",
  description: "Track your gaming journey.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  return (
    <html lang="en" className={cn("font-sans")}>
      <body className="flex min-h-screen flex-col">
        <AuthProvider initialUser={user}>
          <Navbar />

          <main className="flex flex-1">{children}</main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
