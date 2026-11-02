import { redirect } from "next/navigation";
import type { Session } from "next-auth";

import { auth } from "./auth";

/** Session aktif atau null. */
export async function getSession(): Promise<Session | null> {
  return auth();
}

/**
 * Dipakai di layout/halaman admin dan di setiap Server Action yang mengubah data.
 * Server tetap jadi sumber kebenaran — menyembunyikan tombol di UI bukan pengamanan.
 */
export async function requireAdmin(): Promise<Session> {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  return session;
}

export async function requireAdminApi(): Promise<Session> {
  return requireAdmin();
}
