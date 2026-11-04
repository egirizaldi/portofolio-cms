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
| `npm run db:migrate` | Buat/terapkan migration Prisma (development) |
| `npm run db:deploy` | Terapkan migration ke database produksi (`prisma migrate deploy`) |
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
| 6. Project Management | ✅ Selesai | CRUD Proyek lengkap (thumbnail via URL/path, slug otomatis, toggle publish/featured) |
| 7. Public Portfolio Website | ✅ Selesai | Halaman publik lengkap: Home, Projects, About, Skills, Experience, Education, Certificate, Kontak |
| 8. Content Management | ✅ Selesai | CMS Dashboard untuk Profile, Skills, Experience, Education, dan Sertifikat |
| 9. Contact & Website Settings | ✅ Selesai | Inbox pesan (/admin/messages) dengan filter unread & Settings website umum |
| 10. Testing & Optimization | ✅ Selesai | Validasi form, rate limiting API, SEO (robots.ts & sitemap.ts), typecheck aman |

## Deploy: Website di Vercel + CMS di Laptop

Arsitektur ini memisahkan tempat menjalankan aplikasi, bukan aplikasinya:

- **Website publik** berjalan di Vercel.
- **Dashboard CMS** hanya dijalankan di laptop (`CMS_ENABLED=true`).
- Keduanya memakai **database PostgreSQL hosted yang sama**.
- Di Vercel, `CMS_ENABLED` sengaja **tidak diisi** sehingga `/admin` mati.
- Perubahan dari CMS lokal langsung tampil di website karena halaman publik
  memakai `force-dynamic`.

### 1. Siapkan database hosted

Gunakan Supabase, Neon, atau PostgreSQL terkelola lainnya. Ambil dua connection
string:

- `DATABASE_URL` — koneksi **pooler** (untuk aplikasi/serverless).
- `DIRECT_URL` — koneksi **langsung** (untuk migrasi Prisma).

Contoh Supabase:

```env
DATABASE_URL="postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres"
```

Contoh Neon:

```env
DATABASE_URL="postgresql://<user>:<password>@<project>-pooler.<region>.neon.tech/<db>?sslmode=require"
DIRECT_URL="postgresql://<user>:<password>@<project>.<region>.neon.tech/<db>?sslmode=require"
```

> Jika koneksi langsung Supabase tidak bisa dipakai karena IPv6, gunakan
> **session pooler** (port `5432`) sebagai `DIRECT_URL`.

### 2. Environment di Vercel

Isi di Project Settings → Environment Variables:

```env
DATABASE_URL="..."
DIRECT_URL="..."
AUTH_SECRET="..."          # openssl rand -base64 32
AUTH_TRUST_HOST=true
NEXT_PUBLIC_SITE_URL="https://domain-anda.com"
```

**Jangan isi `CMS_ENABLED` di Vercel.** Tanpa variabel itu, middleware dan
`requireAdmin` menonaktifkan seluruh dashboard admin di hosting.
`ADMIN_EMAIL` dan `ADMIN_PASSWORD` hanya dibutuhkan saat menjalankan seed dari
laptop, jadi tidak perlu ditaruh di Vercel.

### 3. Environment di laptop

Salin `.env.example` lalu isi dengan database hosted yang sama:

```env
DATABASE_URL="..."
DIRECT_URL="..."
AUTH_SECRET="..."
AUTH_TRUST_HOST=true
NEXT_PUBLIC_SITE_URL="https://domain-anda.com"
ADMIN_EMAIL="admin@portofolio.local"
ADMIN_PASSWORD="..."
CMS_ENABLED="true"
```

Lalu jalankan `npm run dev` — **tanpa** `npm run db:start`, karena database
sudah berjalan di hosting.

### 4. Migrasi & seed (sekali saja)

Dari laptop, arahkan ke database hosted:

```bash
npm run db:deploy   # prisma migrate deploy
npm run db:seed
```

Jangan memakai `npm run db:migrate` (`prisma migrate dev`) untuk database
produksi karena perintah itu bisa membuat migration baru dan melakukan reset.

### 5. Verifikasi

1. Buka website Vercel → konten tampil.
2. Buka `http://localhost:3000/admin` di laptop → login berhasil.
3. Ubah konten → refresh website Vercel → perubahan muncul.
4. Buka `https://domain-anda.com/admin` → dialihkan ke homepage (CMS mati).

### Catatan penting

- `NEXT_PUBLIC_SITE_URL` di-inline saat build Vercel. Jika domain berubah,
  lakukan redeploy.
- Ganti `ADMIN_PASSWORD` setelah seed **tidak** mengubah password yang sudah ada;
  seed hanya membuat user baru.
- CMS lokal tetap membutuhkan koneksi internet ke database hosted.
- **Upload gambar dari CMS belum tersedia.** Untuk sementara, isi field gambar
  dengan URL publik dari hosting gambar (mis. Cloudinary/Imgur). Integrasi
  Supabase Storage direncanakan pada fase berikutnya.
- `embedded-postgres` hanya untuk development lokal, bukan untuk produksi.
- Jangan commit `.env` asli. Gunakan `.env.example` sebagai template.
