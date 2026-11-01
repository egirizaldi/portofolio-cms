import { PrismaClient } from "@prisma/client";

/**
 * Satu instance PrismaClient per proses.
 * Saat development, instance disimpan di globalThis agar hot-reload
 * tidak membuat koneksi baru setiap kali modul dimuat ulang.
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "production" ? ["error"] : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
