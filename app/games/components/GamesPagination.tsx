"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

interface GamesPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function GamesPagination({
  currentPage,
  totalPages,
}: GamesPaginationProps) {
  return <div></div>;
}
