"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/certificates", label: "Certificates" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PublicNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="hidden items-center gap-1 sm:flex">
        {links.map((link) => (
          <Button
            key={link.href}
            variant="ghost"
            size="sm"
            className={cn(isActive(pathname, link.href) && "bg-muted text-foreground")}
            aria-current={isActive(pathname, link.href) ? "page" : undefined}
            render={<Link href={link.href} />}
          >
            {link.label}
          </Button>
        ))}
      </nav>

      <div className="flex items-center gap-2 sm:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Buka menu navigasi" />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Navigasi</SheetTitle>
            <nav className="mt-10 flex flex-col gap-1 px-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(pathname, link.href) ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    isActive(pathname, link.href) && "bg-muted text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                className="mt-4"
                render={<Link href="/contact" onClick={() => setOpen(false)} />}
              >
                Hubungi saya
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
