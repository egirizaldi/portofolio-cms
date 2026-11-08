# Panduan CMS & Troubleshooting

Dokumen ini menjelaskan cara memakai CMS, cara melaporkan masalah ke AI agent, dan langkah cepat untuk mengecek sendiri saat ada fitur yang tidak berjalan.

---

## 1. Ringkasan sistem

| Bagian | Lokasi | Keterangan |
|---|---|---|
| Website publik | https://portofolio-cms-five.vercel.app | Hosted di Vercel, selalu online |
| CMS / admin | `http://localhost:3000/admin` | Hanya jalan di laptop |
| Database | Supabase (project `gxxukgpvclgcytsovkam`) | Dipakai bersama oleh hosted & CMS |
| Storage | Supabase Storage, bucket `portofolio` | Untuk foto, thumbnail, sertifikat, CV |
| Folder proyek | `/home/egi-rizaldi/Ngodingku/project-website-portofolio` | Semua perintah dijalankan dari sini |

Karena hosted dan CMS memakai database yang sama, perubahan yang **benar-benar tersimpan** di CMS akan langsung terlihat di website hosted.

---

## 2. Cara menjalankan CMS

```bash
cd /home/egi-rizaldi/Ngodingku/project-website-portofolio
npm run dev
```

Lalu buka:

```
http://localhost:3000/admin
```

Kredensial admin ada di file `.env`:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Jangan menempel password atau token ke chat publik. Jika `.env` berubah, user admin yang sudah ada di database **tidak otomatis berubah**.

---

## 3. Alur kerja yang benar

1. Jalankan `npm run dev`.
2. Buka `http://localhost:3000/admin`.
3. Login.
4. Edit konten di menu yang sesuai:
   - **Profil** → nama, headline, bio, foto, CV, sosial media
   - **Proyek** → proyek, thumbnail, galeri, teknologi, publikasi
   - **Kategori** → kategori proyek
   - **Keahlian** → skill, level, grup
   - **Pengalaman** → riwayat kerja/organisasi
   - **Pendidikan** → riwayat pendidikan
   - **Sertifikat** → sertifikat dan link kredensial
   - **Pesan** → pesan dari form kontak
   - **Pengaturan** → judul situs, navigasi, footer, judul section, tombol, teks form, halaman 404
5. Klik tombol **Simpan**.
6. Refresh website hosted.

Jika muncul pesan error, jangan abaikan. Screenshot atau salin pesannya.

---

## 4. Template prompt untuk AI agent

Copy-paste template ini saat ada masalah:

```text
Cek fitur: [nama fitur]
Lokasi: [localhost / hosted Vercel / keduanya]
Yang saya lakukan: [langkah singkat]
Yang saya harapkan: [hasil yang diinginkan]
Yang terjadi: [hasil sebenarnya]
Pesan error: [tempel teks error atau screenshot]
Sudah dicoba: [refresh / logout-login / restart npm run dev]
```

Contoh:

```text
Cek fitur: simpan profil
Lokasi: localhost
Yang saya lakukan: ganti nama jadi "Egi", klik Simpan Profil
Yang saya harapkan: nama berubah di website hosted
Yang terjadi: di CMS muncul "berhasil", tapi hosted tetap nama lama
Pesan error: tidak ada
Sudah dicoba: refresh dan logout-login
```

### Contoh prompt singkat

| Situasi | Prompt |
|---|---|
| CMS tidak menyimpan | `Cek simpan data CMS, perubahan tidak muncul di hosted.` |
| Hosted tidak berubah | `Cek kenapa hosted belum update setelah saya simpan di CMS.` |
| Upload gagal | `Cek upload gambar, muncul error [tempel error].` |
| Tidak bisa login | `Cek login admin, email/password benar tapi kembali ke halaman login.` |
| Halaman error | `Cek halaman /projects, muncul error 500.` |
| Ingin tambah fitur | `Saya ingin menambah fitur [deskripsi]. Cek struktur yang ada, lalu buatkan.` |
| Ingin audit | `Audit semua fitur CMS dan halaman publik, cari yang masih hardcoded atau tidak jalan.` |

Cukup 4 informasi utama:

1. Fitur apa yang bermasalah.
2. Di mana (localhost atau hosted).
3. Apa yang terjadi vs yang diharapkan.
4. Pesan error (kalau ada).

---

## 5. Checklist uji fitur

Urutan yang disarankan:

- [ ] **Profil** — nama, headline, bio, foto, CV, sosial media
- [ ] **Proyek** — tambah, edit, upload thumbnail, galeri, publikasi
- [ ] **Kategori** — tambah dan hubungkan ke proyek
- [ ] **Keahlian** — tambah, level, grup
- [ ] **Pengalaman** — tambah riwayat kerja
- [ ] **Pendidikan** — tambah riwayat pendidikan
- [ ] **Sertifikat** — upload gambar dan link kredensial
- [ ] **Pesan** — kirim dari halaman kontak, cek masuk di CMS
- [ ] **Pengaturan** — ubah judul situs, footer, teks tombol
- [ ] **Hosted** — refresh https://portofolio-cms-five.vercel.app

---

## 6. Diagnosis cepat

| Gejala | Kemungkinan penyebab | Yang bisa dicek |
|---|---|---|
| CMS bilang “berhasil” tapi data tidak berubah | Sesi login kedaluwarsa, atau request diarahkan ke halaman login | Logout lalu login ulang, coba simpan lagi |
| Hosted tidak berubah | Data belum tersimpan, atau deployment lama | Cek data di CMS, refresh hosted, cek deployment Vercel |
| Upload gagal | File terlalu besar, format tidak didukung, atau storage bermasalah | Maksimal 10 MB; format JPG, PNG, WEBP, GIF, PDF |
| Halaman 500 | Database tidak terjangkau atau env salah | Cek koneksi Supabase dan environment Vercel |
| Login gagal | Password berbeda dengan yang ada di database | Cek `ADMIN_EMAIL` / `ADMIN_PASSWORD` di `.env` |
| Perubahan hanya muncul di localhost | Deployment hosted belum selesai | Tunggu deploy Vercel selesai, lalu refresh |
| Halaman admin terbuka di hosted | `CMS_ENABLED` terpasang di Vercel | `CMS_ENABLED` tidak boleh ada di Vercel |

---

## 7. Perintah bantu

```bash
# jalankan CMS
npm run dev

# cek tipe TypeScript
npm run typecheck

# cek lint
npm run lint

# build production
npm run build

# isi/refresh data awal (aman dijalankan berulang)
npm run db:seed
```

Catatan:

- Jangan menjalankan `npm run db:start` lagi; database lokal sudah tidak dipakai.
- `.env` tidak boleh di-commit ke Git.
- `CMS_ENABLED` hanya untuk laptop, jangan dipasang di Vercel.

---

## 8. Deployment

- Repo: `egirizaldi/portofolio-cms`
- Branch produksi: `main`
- Vercel project: `portofolio-cms`
- Domain: https://portofolio-cms-five.vercel.app

Setiap push ke `main` akan memicu deploy otomatis di Vercel. Setelah deploy selesai, perubahan kode akan aktif di hosted.

---

## 9. Keamanan

- Jangan menempel token Vercel, service role key Supabase, atau password database ke chat.
- Jika terlanjur, segera rotate:
  - Vercel → Account Settings → Tokens
  - Supabase → Project Settings → API
  - Supabase → Project Settings → Database → Reset database password
- Setelah rotate, perbarui `.env` di laptop dan environment di Vercel, lalu redeploy.

---

## 10. Lokasi dokumen ini

```
/home/egi-rizaldi/Ngodingku/project-website-portofolio/TROUBLESHOOTING.md
```
