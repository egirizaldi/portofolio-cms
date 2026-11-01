/**
 * Menjalankan PostgreSQL lokal tanpa sudo (embedded-postgres).
 * Cluster disimpan di ./.pgdata dan tetap ada setelah proses berhenti.
 *
 * Pakai: npm run db:start
 * Stop: Ctrl+C
 */
import { existsSync } from "node:fs";
import path from "node:path";
import EmbeddedPostgres from "embedded-postgres";

const PORTOFOLIO_DB = {
  databaseDir: path.resolve(process.cwd(), ".pgdata"),
  port: Number(process.env.PG_PORT ?? 54329),
  user: process.env.PG_USER ?? "portfolio",
  password: process.env.PG_PASSWORD ?? "portfolio",
  database: process.env.PG_DATABASE ?? "portfolio_cms",
};

async function main() {
  const pg = new EmbeddedPostgres({
    databaseDir: PORTOFOLIO_DB.databaseDir,
    port: PORTOFOLIO_DB.port,
    user: PORTOFOLIO_DB.user,
    password: PORTOFOLIO_DB.password,
    persistent: true,
    onLog: () => {},
    onError: (msg) => console.error("[postgres]", msg),
  });

  if (!existsSync(path.join(PORTOFOLIO_DB.databaseDir, "PG_VERSION"))) {
    console.log("• Menginisialisasi cluster PostgreSQL baru di .pgdata ...");
    await pg.initialise();
  }

  console.log("• Menjalankan PostgreSQL ...");
  await pg.start();

  try {
    await pg.createDatabase(PORTOFOLIO_DB.database);
    console.log(`• Database "${PORTOFOLIO_DB.database}" dibuat.`);
  } catch {
    // Database sudah ada — aman diabaikan.
  }

  const url = `postgresql://${PORTOFOLIO_DB.user}:${PORTOFOLIO_DB.password}@localhost:${PORTOFOLIO_DB.port}/${PORTOFOLIO_DB.database}?schema=public`;
  console.log(`✔ PostgreSQL siap: ${url}`);
  console.log("  Tekan Ctrl+C untuk menghentikan.");

  const shutdown = async () => {
    console.log("\n• Menghentikan PostgreSQL ...");
    try {
      await pg.stop();
    } finally {
      process.exit(0);
    }
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  // Jaga proses tetap hidup selama server database berjalan.
  setInterval(() => {}, 2 ** 30);
}

main().catch((err) => {
  console.error("Gagal menjalankan PostgreSQL:", err);
  process.exit(1);
});
