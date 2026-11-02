import Link from "next/link";
import type { Metadata } from "next";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center px-4">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Portfolio
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="flex w-full max-w-2xl flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-xl border bg-muted">
            <Compass aria-hidden className="size-5 text-muted-foreground" />
          </span>
          <p className="mt-6 text-sm font-medium text-muted-foreground">404</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            Halaman tidak ditemukan
          </h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Tautan yang Anda buka mungkin sudah dipindahkan atau tidak pernah
            ada.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <Button render={<Link href="/" />}>Kembali ke beranda</Button>
            <Button variant="outline" render={<Link href="/projects" />}>
              Lihat proyek
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
