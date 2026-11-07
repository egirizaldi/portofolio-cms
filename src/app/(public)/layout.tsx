import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PublicNav, type NavItem } from "@/components/public/public-nav";
import { getSiteContent } from "@/lib/site-content";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getSiteContent();

  const navItems: NavItem[] = [
    { href: "/about", label: content.nav_about },
    { href: "/projects", label: content.nav_projects },
    { href: "/skills", label: content.nav_skills },
    { href: "/experience", label: content.nav_experience },
    { href: "/education", label: content.nav_education },
    { href: "/certificates", label: content.nav_certificates },
    { href: "/contact", label: content.nav_contact },
  ];

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            {content.brand_name}
          </Link>
          <PublicNav items={navItems} />
          <Button
            size="sm"
            className="hidden sm:inline-flex"
            render={<Link href="/contact" />}
          >
            {content.header_cta_label}
          </Button>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-6">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-2 px-4 text-xs text-muted-foreground sm:flex-row">
          <p>{content.footer_text}</p>
          <p>{content.footer_note}</p>
        </div>
      </footer>
    </div>
  );
}
