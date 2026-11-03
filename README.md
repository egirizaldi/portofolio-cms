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

Kredensial admin awal disetel via `ADMIN_EMAIL` dan `ADMIN_PASSWORD` di `.env`
(default pada `.env.example`: `admin@portofolio.local` / `Admin#12345`).

## Scripts

| Script | Fungsi |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Prisma generate + build produksi |
| `npm run start` | Menjalankan build produksi |
| `npm run typecheck` | Cek tipe TypeScript |
| `npm run lint` | ESLint |
| `npm run db:start` | Jalankan PostgreSQL embedded (port 54329) |
| `npm run db:migrate` | Buat/terapkan migration Prisma |
| `npm run db:push` | Push schema langsung ke database tanpa migration |
| `npm run db:seed` | Isi data awal (idempotent) |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:studio` | Buka Prisma Studio |

## Struktur Folder

```
src/
├── actions/                # Server Actions (Auth, dll.)
├── app/
│   ├── (public)/           # Halaman publik (Home, Projects, About, Skills, Experience, Education, Certificate, Contact)
│   ├── admin/              # Dashboard CMS privat (login di /admin/login)
│   ├── api/                # Route Handlers REST API (CRUD konten, pesan, upload, stats)
│   ├── layout.tsx          # Root layout & providers
│   ├── robots.ts           # SEO Robots konfigurasi
│   └── sitemap.ts          # SEO Sitemap dinamis
├── components/
│   ├── admin/              # Komponen dashboard & dialog form CRUD
│   ├── auth/               # Komponen otentikasi & login form
│   ├── public/             # Komponen khusus halaman publik
│   └── ui/                 # Komponen UI dasar shadcn/ui
├── lib/
│   ├── auth/               # Konfigurasi NextAuth / Auth.js
│   ├── db/                 # Prisma client instance
│   ├── validations/        # Schema validasi Zod
│   └── utils.ts            # Helper umum (cn, image src resolver, dll.)
└── types/                  # Definisi TypeScript bersama
prisma/
├── schema.prisma           # Skema database Prisma
├── migrations/             # Riwayat migrasi database
└── seed.ts                 # Script seeding data awal
scripts/
└── db.ts                   # Runner embedded PostgreSQL
```

## Model Data

`User`, `Profile`, `Project`, `Category`, `ProjectImage`, `Skill`, `Experience`,
`Education`, `Certificate`, `Message`, `Setting`.

- Project ↔ Category: many-to-many
- Project → ProjectImage: one-to-many (cascade delete)
- Semua primary key memakai UUID

## Status Pengerjaan

| Fase | Status | Keterangan |
| --- | --- | --- |
| 1. Project Initialization | ✅ Selesai | Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui |
| 2. Database & ORM Setup | ✅ Selesai | Embedded PostgreSQL & Prisma ORM lengkap dengan relasi dan seed |
| 3. Authentication & Authorization | ✅ Selesai | Auth.js v5 credentials flow, role-based protection, middleware guard |
| 4. Admin Dashboard Layout | ✅ Selesai | Layout responsive, sidebar navigasi, header status, tema dark/light |
| 5. Category Management | ✅ Selesai | CRUD Kategori project dengan modal form Zod & feedback notifikasi |
| 6. Project Management | ✅ Selesai | CRUD Proyek lengkap (upload thumbnail/galeri, slug otomatis, toggle publish/featured) |
| 7. Public Portfolio Website | ✅ Selesai | Halaman publik lengkap: Home, Projects, About, Skills, Experience, Education, Certificate, Kontak |
| 8. Content Management | ✅ Selesai | CMS Dashboard untuk Profile, Skills, Experience, Education, dan Sertifikat |
| 9. Contact & Website Settings | ✅ Selesai | Inbox pesan (/admin/messages) dengan filter unread & Settings website umum |
| 10. Testing & Optimization | ✅ Selesai | Validasi form, rate limiting API, SEO (robots.ts & sitemap.ts), typecheck aman |

## Catatan Produksi

- `embedded-postgres` hanya untuk development. Untuk produksi gunakan PostgreSQL
  terkelola (Neon/Supabase/RDS) dan set `DATABASE_URL` sesuai.
- Upload file di development disimpan di `public/uploads/`; untuk produksi gunakan
  object storage (mis. S3/R2) sesuai PRD bagian 8.
