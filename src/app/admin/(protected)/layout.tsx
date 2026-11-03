import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

// Layout admin bergantung pada session (cookies).
export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  const unreadCount = await prisma.message.count({
    where: { status: "UNREAD" },
  });
  const name = session.user.name ?? "Administrator";
  const email = session.user.email ?? "";

  return (
    <div className="flex min-h-svh bg-muted/20">
      <AdminSidebar unreadCount={unreadCount} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader name={name} email={email} unreadCount={unreadCount} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
