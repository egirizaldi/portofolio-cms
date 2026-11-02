# Personal Portfolio CMS

Website portofolio pribadi + dashboard CMS privat, dibangun dengan Next.js App Router full-stack.

- **Referensi**: `PRD_Personal_Portfolio_CMS.pdf`, `Task_Based_Development_Personal_Portfolio_CMS.pdf`, `Task_Breakdown_Personal_Portfolio_CMS.pdf`
- **Stack**: Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · PostgreSQL · Prisma 6 · Auth.js v5 · Zod · React Hook Form · Recharts

---

## Prasyarat

- Node.js 22+
- npm 9+

> Project ini memakai **embedded PostgreSQL** (`embedded-postgres`) sehingga tidak perlu install PostgreSQL global maupun Docker. Data tersimpan di `.pgdata/` (di-ignore Git).

## Setup pertama kali

```bash
# 1. Install dependency
npm install

# 2. Siapkan environment
cp .env.example .env
# lalu ganti AUTH_SECRET: openssl rand -base64 32

# 3. Jalankan database lokal (terminal terpisah, biarkan tetap hidup)
npm run db:start

# 4. Migrasi + data awal
npm run db:migrate
npm run db:seed

# 5. Jalankan aplikasi
npm run dev
```

Buka http://localhost:3000

Kredensial admin awal berasal dari `ADMIN_EMAIL` / `ADMIN_PASSWORD` di `.env`
(default: `admin@portofolio.local` / `Admin#12345`).

## Scripts

| Script | Fungsi |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Prisma generate + build produksi |
| `npm run typecheck` | Cek tipe TypeScript |
| `npm run lint` | ESLint |
| `npm run db:start` | Jalankan PostgreSQL embedded (port 54329) |
| `npm run db:migrate` | Buat/terapkan migration Prisma |
| `npm run db:seed` | Isi data awal (idempotent) |
| `npm run db:studio` | Prisma Studio |

## Struktur Folder

```
src/
├── app/
│   ├── (public)/           # halaman pengunjung
│   ├── admin/              # dashboard CMS (login di /admin/login)
│   └── api/                # route handlers bila diperlukan
├── components/
│   ├── ui/                 # komponen shadcn/ui
│   ├── public/             # komponen khusus halaman publik
│   └── admin/              # komponen khusus dashboard
├── lib/
│   ├── db/                 # Prisma client
│   ├── auth/               # konfigurasi Auth.js
│   ├── validations/        # schema Zod
│   └── utils.ts            # helper umum (cn, dll.)
├── actions/                # Server Actions
├── hooks/                  # custom hooks
└── types/                  # tipe bersama
prisma/
├── schema.prisma
├── migrations/
└── seed.ts
scripts/
└── db.ts                   # runner embedded PostgreSQL
```

## Model Data

`User`, `Profile`, `Project`, `Category`, `ProjectImage`, `Skill`, `Experience`,
`Education`, `Certificate`, `Message`, `Setting`.

- Project ↔ Category: many-to-many
- Project → ProjectImage: one-to-many (cascade delete)
- Semua primary key memakai UUID

## Status Pengerjaan

| Fase | Status |
| --- | --- |
| 1. Project Initialization | ✅ selesai |
| 2. Database & ORM Setup | ✅ selesai |
| 3. Authentication & Authorization | ✅ selesai |
| 4. Admin Dashboard Layout | ✅ selesai |
| 5. Category Management | ✅ selesai |
| 6. Project Management | 🟡 API tersedia (perlu perbaikan), UI admin belum |
| 7. Public Portfolio Website | 🟡 halaman utama selesai; pengiriman kontak menunggu API |
| 8. Content Management | ⬜ |
| 9. Contact & Website Settings | 🟡 UI kontak selesai; inbox & settings belum |
| 10. Testing & Deployment | ⬜ |

## Catatan Produksi

- `embedded-postgres` hanya untuk development. Untuk produksi gunakan PostgreSQL
  terkelola (Neon/Supabase/RDS) dan set `DATABASE_URL` sesuai.
- Upload file di development disimpan di `public/uploads/`; untuk produksi gunakan
  object storage (mis. S3/R2) sesuai PRD bagian 8.
