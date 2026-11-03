import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";

import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdminMobileNav } from "@/components/admin/admin-sidebar";

type AdminHeaderProps = {
  name: string;
  email: string;
  unreadCount?: number;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AdminHeader({ name, email, unreadCount = 0 }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-6">
      <AdminMobileNav unreadCount={unreadCount} />

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex"
          render={<Link href="/" target="_blank" rel="noreferrer" />}
        >
          <ExternalLink className="size-4" />
          Lihat Website
        </Button>

        <div className="flex items-center gap-2 border-l pl-2 md:pl-3">
          <Avatar className="size-7">
            <AvatarFallback className="text-xs">
              {initials(name) || "AD"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden leading-tight md:block">
            <p className="max-w-32 truncate text-sm font-medium">{name}</p>
            <p className="max-w-32 truncate text-xs text-muted-foreground">
              {email}
            </p>
          </div>
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              size="icon-sm"
              aria-label="Keluar"
              title="Keluar"
            >
              <LogOut className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
