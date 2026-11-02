import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FooterYear } from "@/components/public/footer-year";
import { PublicNav } from "@/components/public/public-nav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Portfolio
          </Link>
          <PublicNav />
          <Button size="sm" className="hidden sm:inline-flex" render={<Link href="/contact" />}>
            Hubungi Saya
          </Button>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-6">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-2 px-4 text-xs text-muted-foreground sm:flex-row">
          <p>© <FooterYear /> Personal Portfolio.</p>
          <p>Dibangun dengan Next.js &amp; PostgreSQL.</p>
        </div>
      </footer>
    </div>
  );
}
