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
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const getPages = (currentPage: number, totalPages: number) => {
    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));

    return Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i);
  };

  const pages = getPages(currentPage, totalPages);

  function goToPage(page: string) {
    const params = new URLSearchParams(searchParams);
    if (page) {
      params.set("page", page);
    } else {
      params.delete("page");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }

  console.log(pages);

  return (
    <div className="flex items-center justify-between gap-2">
      <Button
        onClick={() => goToPage(String(currentPage - 1))}
        disabled={currentPage === 1}
        variant={"secondary"}
        size={"icon-sm"}
        className={"sm:size-10 sm:px-3 sm:text-sm"}
      >
        <ChevronLeft />
      </Button>

      <div className="space-x-1">
        {!pages.includes(1) && (
          <>
            <Button
              variant={currentPage === 1 ? "default" : "secondary"}
              onClick={() => goToPage("1")}
              size="sm"
              className={"sm:size-10 sm:px-3 sm:text-sm"}
            >
              1
            </Button>
            <span>...</span>
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "secondary"}
            onClick={() => goToPage(String(page))}
            size={"icon-sm"}
            className={"sm:size-10 sm:px-3 sm:text-sm"}
          >
            {page}
          </Button>
        ))}
        {!pages.includes(totalPages) && (
          <>
            <span>...</span>
            <Button
              variant={currentPage === totalPages ? "default" : "secondary"}
              onClick={() => goToPage(String(totalPages))}
              size={"sm"}
              className={"sm:h-10 sm:w-14 sm:px-3 sm:text-sm"}
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      <Button
        onClick={() => goToPage(String(currentPage + 1))}
        disabled={currentPage === totalPages}
        variant={"secondary"}
        size={"icon-sm"}
        className={"sm:size-10 sm:px-3 sm:text-sm"}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
