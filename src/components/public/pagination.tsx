import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
};

function pageItems(current: number, total: number): Array<number | "ellipsis"> {
  const visible = new Set([1, total, current - 1, current, current + 1]);
  const pages = [...visible]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const items: Array<number | "ellipsis"> = [];
  let previous = 0;

  for (const page of pages) {
    if (previous && page - previous > 1) {
      items.push("ellipsis");
    }
    items.push(page);
    previous = page;
  }

  return items;
}

export function Pagination({ page, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Navigasi halaman proyek"
      className="flex flex-wrap items-center justify-center gap-1.5"
    >
      {page > 1 ? (
        <Button
          variant="outline"
          size="icon"
          render={
            <Link href={buildHref(page - 1)} aria-label="Halaman sebelumnya" />
          }
        >
          <ChevronLeft aria-hidden />
        </Button>
      ) : (
        <Button variant="outline" size="icon" disabled aria-label="Halaman sebelumnya">
          <ChevronLeft aria-hidden />
        </Button>
      )}

      {pageItems(page, totalPages).map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1 text-sm text-muted-foreground"
            aria-hidden
          >
            …
          </span>
        ) : (
          <Button
            key={item}
            variant={item === page ? "default" : "ghost"}
            size="icon"
            aria-current={item === page ? "page" : undefined}
            render={<Link href={buildHref(item)} />}
          >
            {item}
          </Button>
        ),
      )}

      {page < totalPages ? (
        <Button
          variant="outline"
          size="icon"
          render={<Link href={buildHref(page + 1)} aria-label="Halaman berikutnya" />}
        >
          <ChevronRight aria-hidden />
        </Button>
      ) : (
        <Button variant="outline" size="icon" disabled aria-label="Halaman berikutnya">
          <ChevronRight aria-hidden />
        </Button>
      )}
    </nav>
  );
}
