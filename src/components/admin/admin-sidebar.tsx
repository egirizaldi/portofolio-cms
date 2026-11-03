"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BriefcaseBusiness,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Mail,
  Menu,
  Settings,
  Sparkles,
  Tags,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profil", icon: UserRound },
  { href: "/admin/projects", label: "Proyek", icon: FolderKanban },
  { href: "/admin/categories", label: "Kategori", icon: Tags },
  { href: "/admin/skills", label: "Keahlian", icon: Sparkles },
  { href: "/admin/experiences", label: "Pengalaman", icon: BriefcaseBusiness },
  { href: "/admin/educations", label: "Pendidikan", icon: GraduationCap },
  { href: "/admin/certificates", label: "Sertifikat", icon: Award },
  { href: "/admin/messages", label: "Pesan", icon: Mail },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

function NavLinks({
  onNavigate,
  unreadCount = 0,
}: {
  onNavigate?: () => void;
  unreadCount?: number;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-3 pb-4">
      {navigation.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              active && "bg-muted text-foreground",
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
            {item.href === "/admin/messages" && unreadCount > 0 ? (
              <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-semibold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/admin/dashboard" className="flex items-center gap-2 px-5 py-5">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
        CMS
      </span>
      <span className="text-sm font-semibold tracking-tight">
        Portfolio Admin
      </span>
    </Link>
  );
}

/** Sidebar tetap untuk layar besar. */
export function AdminSidebar({ unreadCount = 0 }: { unreadCount?: number }) {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background lg:block">
      <Brand />
      <NavLinks unreadCount={unreadCount} />
    </aside>
  );
}

/** Trigger + drawer untuk layar kecil. */
export function AdminMobileNav({ unreadCount = 0 }: { unreadCount?: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Buka menu"
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetTitle className="sr-only">Navigasi admin</SheetTitle>
        <Brand />
        <NavLinks
          unreadCount={unreadCount}
          onNavigate={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
