import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
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
  if (process.env.CMS_ENABLED !== "true") {
    redirect("/");
  }
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  return session;
}

/**
 * Guard untuk Route Handler API. Berbeda dari `requireAdmin` yang melakukan
 * redirect (cocok untuk halaman), fungsi ini mengembalikan respons 401 JSON
 * agar klien tidak salah mengira request berhasil.
 */
export async function requireAdminApi(): Promise<NextResponse | null> {
  if (process.env.CMS_ENABLED !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
