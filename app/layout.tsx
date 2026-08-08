import "./globals.css";

import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { cn } from "@/lib/utils";

import Navbar from "@/components/layout/Navbar";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Keylog",
  description: "Track your gaming journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", figtree.variable)}>
      <body>
        <Navbar />

        <main>{children}</main>
      </body>
    </html>
  );
}
