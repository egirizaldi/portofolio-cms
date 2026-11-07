/**
 * Registri konten situs.
 *
 * Semua teks yang tampil di halaman publik didefinisikan di sini beserta nilai
 * default-nya. Nilai aktual disimpan di tabel `Setting` (key/value) sehingga
 * dapat diubah dari dashboard CMS tanpa mengubah kode.
 *
 * File ini murni (tanpa akses database) agar aman diimpor dari komponen
 * client maupun server.
 */

export type ContentFieldType = "text" | "textarea" | "email";

export type ContentField = {
  key: ContentKey;
  label: string;
  hint?: string;
  type?: ContentFieldType;
  maxLength?: number;
};

export type ContentSection = {
  id: string;
  title: string;
  description?: string;
  fields: ContentField[];
};

export const CONTENT_DEFAULTS = {
  // Identitas & SEO
  site_title: "Personal Portfolio",
  site_description: "Portofolio pribadi dan proyek pilihan.",
  site_keywords: "portofolio, web developer, proyek",
  brand_name: "Portfolio",
  contact_email: "",

  // Navigasi & footer
  header_cta_label: "Hubungi Saya",
  nav_about: "About",
  nav_projects: "Projects",
  nav_skills: "Skills",
  nav_experience: "Experience",
  nav_education: "Education",
  nav_certificates: "Certificates",
  nav_contact: "Contact",
  footer_text: "© 2026 Personal Portfolio. All rights reserved.",
  footer_note: "Dibangun dengan Next.js & PostgreSQL.",

  // Beranda
  home_cta_primary: "Lihat Proyek",
  home_cta_secondary: "Hubungi Saya",
  home_projects_heading: "Proyek Pilihan",
  home_projects_link: "Semua proyek",
  home_projects_empty: "Belum ada proyek yang dipublikasikan.",

  // Tentang
  about_meta_title: "Tentang",
  about_meta_description:
    "Profil singkat, keahlian, pengalaman, dan latar belakang pendidikan saya.",
  about_skills_heading: "Keahlian",
  about_experience_heading: "Pengalaman",
  about_education_heading: "Pendidikan",
  about_cta_projects: "Lihat proyek",
  about_cta_cv: "Unduh CV",
  about_link_all: "Lihat semua",

  // Proyek
  projects_meta_title: "Proyek",
  projects_meta_description:
    "Kumpulan proyek yang telah saya kerjakan, lengkap dengan teknologi dan studi kasusnya.",
  projects_eyebrow: "Portofolio",
  projects_heading: "Proyek yang pernah saya bangun",
  projects_description:
    "Jelajahi karya pilihan saya, mulai dari aplikasi web, mobile, hingga eksplorasi desain antarmuka.",
  projects_search_placeholder: "Cari judul atau deskripsi proyek...",
  projects_search_button: "Cari",
  projects_reset_button: "Reset",
  projects_all_label: "Semua",
  projects_empty_filter: "Tidak ada proyek yang cocok",
  projects_count_template: "Menampilkan {shown} dari {total} proyek",
  projects_category_prefix: "dalam kategori",
  projects_search_prefix: "Pencarian:",
  projects_empty_title: "Proyek tidak ditemukan",
  projects_empty_description:
    "Coba kata kunci lain atau hapus filter kategori untuk melihat semua proyek.",
  projects_empty_cta: "Lihat semua proyek",

  // Detail proyek
  project_back_label: "Semua proyek",
  project_about_heading: "Tentang proyek",
  project_gallery_heading: "Galeri",
  project_tech_heading: "Teknologi",
  project_links_heading: "Tautan",
  project_demo_label: "Live demo",
  project_repo_label: "Repository",
  project_detail_heading: "Detail",
  project_date_label: "Tanggal",
  project_category_label: "Kategori",
  project_no_date: "Tanpa tanggal",
  project_no_category: "Tanpa kategori",
  project_featured_label: "Featured",
  project_related_heading: "Proyek lainnya",
  project_related_description: "Karya lain dengan kategori serupa.",
  project_related_link: "Lihat semua",
  project_not_found_title: "Proyek tidak ditemukan",
  project_card_detail: "Lihat detail",

  // Keahlian
  skills_meta_title: "Skills",
  skills_meta_description: "Daftar keahlian teknis dan non-teknis",
  skills_eyebrow: "Keahlian",
  skills_heading: "Skills & kemampuan",
  skills_description:
    "Kumpulan keahlian yang saya gunakan untuk merancang, membangun, dan merawat produk digital.",
  skills_empty_title: "Belum ada skill",
  skills_empty_description:
    "Keahlian yang ditambahkan melalui dashboard akan muncul di sini.",
  skills_count_suffix: "skill",
  skills_cta_heading: "Lihat penerapannya",
  skills_cta_description:
    "Keahlian ini saya pakai untuk membangun proyek nyata. Jelajahi portofolio untuk melihat hasilnya.",
  skills_cta_button: "Lihat proyek",

  // Pengalaman
  experience_meta_title: "Pengalaman",
  experience_meta_description:
    "Riwayat pengalaman kerja, organisasi, dan pendidikan saya.",
  experience_eyebrow: "Perjalanan",
  experience_heading: "Pengalaman & pendidikan",
  experience_description:
    "Rekam jejak profesional dan latar belakang akademik yang membentuk cara saya membangun produk.",
  experience_section_heading: "Pengalaman",
  experience_empty: "Belum ada pengalaman yang ditambahkan.",
  experience_education_heading: "Pendidikan",
  experience_education_empty:
    "Belum ada riwayat pendidikan yang ditambahkan.",
  experience_cta_heading: "Ingin melihat hasil kerjanya?",
  experience_cta_description:
    "Beberapa proyek pilihan sudah saya dokumentasikan lengkap dengan teknologi dan tautannya.",
  experience_cta_button: "Jelajahi proyek",
  timeline_current: "Sekarang",

  // Pendidikan
  education_meta_title: "Pendidikan",
  education_meta_description: "Riwayat pendidikan",
  education_eyebrow: "Akademik",
  education_heading: "Riwayat pendidikan",
  education_description:
    "Latar belakang akademik yang menjadi fondasi cara saya belajar dan membangun produk.",
  education_section_heading: "Pendidikan",
  education_empty_title: "Belum ada riwayat pendidikan",
  education_empty_description:
    "Riwayat pendidikan yang ditambahkan melalui dashboard akan muncul di sini.",
  education_cta_heading: "Ingin melihat pengalaman kerja?",
  education_cta_description:
    "Selain pendidikan, saya juga punya rekam jejak profesional yang bisa Anda telusuri.",
  education_cta_experience: "Lihat pengalaman",
  education_cta_skills: "Lihat skills",

  // Sertifikat
  certificates_meta_title: "Sertifikat",
  certificates_meta_description:
    "Sertifikat dan kredensial profesional yang telah saya peroleh.",
  certificates_eyebrow: "Kredensial",
  certificates_heading: "Sertifikat",
  certificates_description:
    "Kumpulan sertifikat, pelatihan, dan kredensial yang mendukung keahlian saya.",
  certificates_empty_title: "Belum ada sertifikat",
  certificates_empty_description:
    "Sertifikat yang ditambahkan melalui dashboard akan muncul di sini.",
  certificates_cta_heading: "Tertarik bekerja sama?",
  certificates_cta_description:
    "Lihat proyek yang sudah saya kerjakan atau hubungi saya untuk berdiskusi.",
  certificates_cta_projects: "Lihat proyek",
  certificates_cta_contact: "Hubungi saya",
  certificate_card_credential: "Lihat kredensial",

  // Kontak
  contact_meta_title: "Kontak",
  contact_meta_description:
    "Hubungi saya untuk diskusi proyek, kolaborasi, atau peluang kerja.",
  contact_eyebrow: "Kontak",
  contact_heading: "Mari berdiskusi",
  contact_description:
    "Punya ide proyek, ingin berkolaborasi, atau sekadar ingin menyapa? Kirim pesan melalui formulir berikut.",
  contact_info_heading: "Informasi kontak",
  contact_response_time: "Biasanya membalas dalam 1–2 hari kerja.",
  contact_social_heading: "Temukan saya",
  contact_hire_heading: "Sedang mencari developer?",
  contact_hire_description:
    "Lihat dulu proyek dan pengalaman saya. Jika cocok, ceritakan kebutuhan Anda melalui formulir.",
  contact_hire_cta: "Lihat proyek",
  contact_form_name_label: "Nama",
  contact_form_name_placeholder: "Nama Anda",
  contact_form_email_label: "Email",
  contact_form_email_placeholder: "nama@email.com",
  contact_form_subject_label: "Subjek",
  contact_form_subject_placeholder: "Ada yang bisa saya bantu?",
  contact_form_message_label: "Pesan",
  contact_form_message_placeholder:
    "Ceritakan proyek atau ide yang ingin Anda diskusikan...",
  contact_form_submit: "Kirim pesan",
  contact_form_submitting: "Mengirim...",
  contact_form_success_title: "Pesan terkirim",
  contact_form_success_message:
    "Pesan berhasil dikirim. Terima kasih, saya akan membalas secepatnya.",
  contact_form_send_another: "Kirim pesan lain",
  contact_form_error_fallback:
    "Pesan gagal dikirim. Silakan coba lagi beberapa saat lagi.",
  contact_form_network_error:
    "Tidak dapat menghubungi server. Periksa koneksi Anda lalu coba lagi.",

  // Halaman 404
  not_found_title: "Halaman tidak ditemukan",
  not_found_description:
    "Tautan yang Anda buka mungkin sudah dipindahkan atau tidak pernah ada.",
  not_found_home: "Kembali ke beranda",
  not_found_projects: "Lihat proyek",
} as const;

export type ContentKey = keyof typeof CONTENT_DEFAULTS;
export type SiteContent = Record<ContentKey, string>;

export const CONTENT_KEYS = Object.keys(CONTENT_DEFAULTS) as ContentKey[];

export const CONTENT_SECTIONS: ContentSection[] = [
  {
    id: "identitas",
    title: "Identitas & SEO",
    description:
      "Dipakai sebagai judul, deskripsi, dan kata kunci situs di mesin pencari.",
    fields: [
      {
        key: "site_title",
        label: "Judul Website",
        hint: "Tampil di tab browser dan hasil pencarian.",
        maxLength: 120,
      },
      {
        key: "site_description",
        label: "Deskripsi SEO",
        type: "textarea",
        hint: "Ringkasan situs untuk mesin pencari.",
        maxLength: 300,
      },
      {
        key: "site_keywords",
        label: "Kata Kunci SEO",
        hint: "Pisahkan dengan koma, contoh: portofolio, web developer.",
        maxLength: 300,
      },
      {
        key: "brand_name",
        label: "Nama Brand di Header",
        hint: "Teks logo pada bagian kiri atas website.",
        maxLength: 60,
      },
      {
        key: "contact_email",
        label: "Email Kontak",
        type: "email",
        hint: "Email publik yang ditampilkan di halaman kontak.",
        maxLength: 160,
      },
    ],
  },
  {
    id: "navigasi",
    title: "Navigasi & Footer",
    description: "Label menu, tombol header, dan teks bagian bawah website.",
    fields: [
      {
        key: "header_cta_label",
        label: "Label Tombol Header",
        maxLength: 40,
      },
      { key: "nav_about", label: "Menu: Tentang", maxLength: 40 },
      { key: "nav_projects", label: "Menu: Proyek", maxLength: 40 },
      { key: "nav_skills", label: "Menu: Keahlian", maxLength: 40 },
      { key: "nav_experience", label: "Menu: Pengalaman", maxLength: 40 },
      { key: "nav_education", label: "Menu: Pendidikan", maxLength: 40 },
      { key: "nav_certificates", label: "Menu: Sertifikat", maxLength: 40 },
      { key: "nav_contact", label: "Menu: Kontak", maxLength: 40 },
      {
        key: "footer_text",
        label: "Teks Hak Cipta",
        maxLength: 300,
      },
      {
        key: "footer_note",
        label: "Catatan Footer",
        hint: "Teks kecil di sisi kanan footer.",
        maxLength: 300,
      },
    ],
  },
  {
    id: "beranda",
    title: "Beranda",
    fields: [
      { key: "home_cta_primary", label: "Tombol Utama", maxLength: 40 },
      { key: "home_cta_secondary", label: "Tombol Kedua", maxLength: 40 },
      {
        key: "home_projects_heading",
        label: "Judul Bagian Proyek",
        maxLength: 80,
      },
      { key: "home_projects_link", label: "Tautan Semua Proyek", maxLength: 40 },
      {
        key: "home_projects_empty",
        label: "Teks Saat Belum Ada Proyek",
        maxLength: 200,
      },
    ],
  },
  {
    id: "tentang",
    title: "Halaman Tentang",
    fields: [
      { key: "about_meta_title", label: "Judul Halaman", maxLength: 80 },
      {
        key: "about_meta_description",
        label: "Deskripsi Halaman",
        type: "textarea",
        maxLength: 300,
      },
      {
        key: "about_skills_heading",
        label: "Judul Bagian Keahlian",
        maxLength: 80,
      },
      {
        key: "about_experience_heading",
        label: "Judul Bagian Pengalaman",
        maxLength: 80,
      },
      {
        key: "about_education_heading",
        label: "Judul Bagian Pendidikan",
        maxLength: 80,
      },
      { key: "about_cta_projects", label: "Tombol Lihat Proyek", maxLength: 40 },
      { key: "about_cta_cv", label: "Tombol Unduh CV", maxLength: 40 },
      { key: "about_link_all", label: "Tautan Lihat Semua", maxLength: 40 },
    ],
  },
  {
    id: "proyek",
    title: "Halaman Proyek",
    fields: [
      { key: "projects_meta_title", label: "Judul Halaman", maxLength: 80 },
      {
        key: "projects_meta_description",
        label: "Deskripsi Halaman",
        type: "textarea",
        maxLength: 300,
      },
      { key: "projects_eyebrow", label: "Label Kecil di Atas Judul", maxLength: 60 },
      { key: "projects_heading", label: "Judul Halaman", maxLength: 120 },
      {
        key: "projects_description",
        label: "Deskripsi Halaman",
        type: "textarea",
        maxLength: 400,
      },
      {
        key: "projects_search_placeholder",
        label: "Placeholder Pencarian",
        maxLength: 120,
      },
      { key: "projects_search_button", label: "Tombol Cari", maxLength: 40 },
      { key: "projects_reset_button", label: "Tombol Reset", maxLength: 40 },
      { key: "projects_all_label", label: "Label Semua Kategori", maxLength: 40 },
      {
        key: "projects_empty_filter",
        label: "Teks Tidak Ada Hasil",
        maxLength: 120,
      },
      {
        key: "projects_count_template",
        label: "Format Jumlah Proyek",
        hint: "Gunakan {shown} dan {total} sebagai placeholder.",
        maxLength: 160,
      },
      {
        key: "projects_category_prefix",
        label: "Awalan Kategori",
        maxLength: 60,
      },
      { key: "projects_search_prefix", label: "Awalan Pencarian", maxLength: 60 },
      {
        key: "projects_empty_title",
        label: "Judul Saat Kosong",
        maxLength: 80,
      },
      {
        key: "projects_empty_description",
        label: "Deskripsi Saat Kosong",
        type: "textarea",
        maxLength: 300,
      },
      { key: "projects_empty_cta", label: "Tombol Saat Kosong", maxLength: 60 },
    ],
  },
  {
    id: "detail-proyek",
    title: "Detail Proyek",
    fields: [
      { key: "project_back_label", label: "Tautan Kembali", maxLength: 60 },
      {
        key: "project_about_heading",
        label: "Judul Bagian Tentang",
        maxLength: 80,
      },
      { key: "project_gallery_heading", label: "Judul Galeri", maxLength: 80 },
      { key: "project_tech_heading", label: "Judul Teknologi", maxLength: 80 },
      { key: "project_links_heading", label: "Judul Tautan", maxLength: 80 },
      { key: "project_demo_label", label: "Label Live Demo", maxLength: 60 },
      { key: "project_repo_label", label: "Label Repository", maxLength: 60 },
      { key: "project_detail_heading", label: "Judul Detail", maxLength: 80 },
      { key: "project_date_label", label: "Label Tanggal", maxLength: 40 },
      { key: "project_category_label", label: "Label Kategori", maxLength: 40 },
      { key: "project_no_date", label: "Teks Tanpa Tanggal", maxLength: 60 },
      {
        key: "project_no_category",
        label: "Teks Tanpa Kategori",
        maxLength: 60,
      },
      { key: "project_featured_label", label: "Label Featured", maxLength: 40 },
      {
        key: "project_related_heading",
        label: "Judul Proyek Lainnya",
        maxLength: 80,
      },
      {
        key: "project_related_description",
        label: "Deskripsi Proyek Lainnya",
        maxLength: 200,
      },
      {
        key: "project_related_link",
        label: "Tautan Lihat Semua",
        maxLength: 60,
      },
      {
        key: "project_not_found_title",
        label: "Judul Proyek Tidak Ditemukan",
        maxLength: 100,
      },
      {
        key: "project_card_detail",
        label: "Label Kartu Proyek",
        hint: "Teks tautan pada kartu proyek.",
        maxLength: 60,
      },
    ],
  },
  {
    id: "keahlian",
    title: "Halaman Keahlian",
    fields: [
      { key: "skills_meta_title", label: "Judul Halaman", maxLength: 80 },
      {
        key: "skills_meta_description",
        label: "Deskripsi Halaman",
        type: "textarea",
        maxLength: 300,
      },
      { key: "skills_eyebrow", label: "Label Kecil di Atas Judul", maxLength: 60 },
      { key: "skills_heading", label: "Judul Halaman", maxLength: 120 },
      {
        key: "skills_description",
        label: "Deskripsi Halaman",
        type: "textarea",
        maxLength: 400,
      },
      {
        key: "skills_empty_title",
        label: "Judul Saat Kosong",
        maxLength: 80,
      },
      {
        key: "skills_empty_description",
        label: "Deskripsi Saat Kosong",
        type: "textarea",
        maxLength: 300,
      },
      {
        key: "skills_count_suffix",
        label: "Satuan Jumlah Skill",
        maxLength: 40,
      },
      {
        key: "skills_cta_heading",
        label: "Judul Ajakan",
        maxLength: 100,
      },
      {
        key: "skills_cta_description",
        label: "Deskripsi Ajakan",
        type: "textarea",
        maxLength: 300,
      },
      { key: "skills_cta_button", label: "Tombol Ajakan", maxLength: 60 },
    ],
  },
  {
    id: "pengalaman",
    title: "Halaman Pengalaman",
    fields: [
      { key: "experience_meta_title", label: "Judul Halaman", maxLength: 80 },
      {
        key: "experience_meta_description",
        label: "Deskripsi Halaman",
        type: "textarea",
        maxLength: 300,
      },
      {
        key: "experience_eyebrow",
        label: "Label Kecil di Atas Judul",
        maxLength: 60,
      },
      { key: "experience_heading", label: "Judul Halaman", maxLength: 120 },
      {
        key: "experience_description",
        label: "Deskripsi Halaman",
        type: "textarea",
        maxLength: 400,
      },
      {
        key: "experience_section_heading",
        label: "Judul Bagian Pengalaman",
        maxLength: 80,
      },
      { key: "experience_empty", label: "Teks Saat Kosong", maxLength: 200 },
      {
        key: "experience_education_heading",
        label: "Judul Bagian Pendidikan",
        maxLength: 80,
      },
      {
        key: "experience_education_empty",
        label: "Teks Pendidikan Saat Kosong",
        maxLength: 200,
      },
      {
        key: "experience_cta_heading",
        label: "Judul Ajakan",
        maxLength: 100,
      },
      {
        key: "experience_cta_description",
        label: "Deskripsi Ajakan",
        type: "textarea",
        maxLength: 300,
      },
      { key: "experience_cta_button", label: "Tombol Ajakan", maxLength: 60 },
      {
        key: "timeline_current",
        label: "Label Status Sekarang",
        hint: "Badge pada pengalaman yang masih berlangsung.",
        maxLength: 40,
      },
    ],
  },
  {
    id: "pendidikan",
    title: "Halaman Pendidikan",
    fields: [
      { key: "education_meta_title", label: "Judul Halaman", maxLength: 80 },
      {
        key: "education_meta_description",
        label: "Deskripsi Halaman",
        type: "textarea",
        maxLength: 300,
      },
      {
        key: "education_eyebrow",
        label: "Label Kecil di Atas Judul",
        maxLength: 60,
      },
      { key: "education_heading", label: "Judul Halaman", maxLength: 120 },
      {
        key: "education_description",
        label: "Deskripsi Halaman",
        type: "textarea",
        maxLength: 400,
      },
      {
        key: "education_section_heading",
        label: "Judul Bagian Pendidikan",
        maxLength: 80,
      },
      {
        key: "education_empty_title",
        label: "Judul Saat Kosong",
        maxLength: 100,
      },
      {
        key: "education_empty_description",
        label: "Deskripsi Saat Kosong",
        type: "textarea",
        maxLength: 300,
      },
      {
        key: "education_cta_heading",
        label: "Judul Ajakan",
        maxLength: 100,
      },
      {
        key: "education_cta_description",
        label: "Deskripsi Ajakan",
        type: "textarea",
        maxLength: 300,
      },
      {
        key: "education_cta_experience",
        label: "Tombol Lihat Pengalaman",
        maxLength: 60,
      },
      { key: "education_cta_skills", label: "Tombol Lihat Skills", maxLength: 60 },
    ],
  },
  {
    id: "sertifikat",
    title: "Halaman Sertifikat",
    fields: [
      { key: "certificates_meta_title", label: "Judul Halaman", maxLength: 80 },
      {
        key: "certificates_meta_description",
        label: "Deskripsi Halaman",
        type: "textarea",
        maxLength: 300,
      },
      {
        key: "certificates_eyebrow",
        label: "Label Kecil di Atas Judul",
        maxLength: 60,
      },
      { key: "certificates_heading", label: "Judul Halaman", maxLength: 120 },
      {
        key: "certificates_description",
        label: "Deskripsi Halaman",
        type: "textarea",
        maxLength: 400,
      },
      {
        key: "certificates_empty_title",
        label: "Judul Saat Kosong",
        maxLength: 100,
      },
      {
        key: "certificates_empty_description",
        label: "Deskripsi Saat Kosong",
        type: "textarea",
        maxLength: 300,
      },
      {
        key: "certificates_cta_heading",
        label: "Judul Ajakan",
        maxLength: 100,
      },
      {
        key: "certificates_cta_description",
        label: "Deskripsi Ajakan",
        type: "textarea",
        maxLength: 300,
      },
      {
        key: "certificates_cta_projects",
        label: "Tombol Lihat Proyek",
        maxLength: 60,
      },
      {
        key: "certificates_cta_contact",
        label: "Tombol Hubungi Saya",
        maxLength: 60,
      },
      {
        key: "certificate_card_credential",
        label: "Label Tautan Kredensial",
        maxLength: 60,
      },
    ],
  },
  {
    id: "kontak",
    title: "Halaman Kontak",
    fields: [
      { key: "contact_meta_title", label: "Judul Halaman", maxLength: 80 },
      {
        key: "contact_meta_description",
        label: "Deskripsi Halaman",
        type: "textarea",
        maxLength: 300,
      },
      { key: "contact_eyebrow", label: "Label Kecil di Atas Judul", maxLength: 60 },
      { key: "contact_heading", label: "Judul Halaman", maxLength: 120 },
      {
        key: "contact_description",
        label: "Deskripsi Halaman",
        type: "textarea",
        maxLength: 400,
      },
      {
        key: "contact_info_heading",
        label: "Judul Informasi Kontak",
        maxLength: 80,
      },
      {
        key: "contact_response_time",
        label: "Teks Waktu Balasan",
        maxLength: 200,
      },
      {
        key: "contact_social_heading",
        label: "Judul Media Sosial",
        maxLength: 80,
      },
      {
        key: "contact_hire_heading",
        label: "Judul Ajakan",
        maxLength: 100,
      },
      {
        key: "contact_hire_description",
        label: "Deskripsi Ajakan",
        type: "textarea",
        maxLength: 300,
      },
      { key: "contact_hire_cta", label: "Tombol Ajakan", maxLength: 60 },
      {
        key: "contact_form_name_label",
        label: "Form: Label Nama",
        maxLength: 40,
      },
      {
        key: "contact_form_name_placeholder",
        label: "Form: Placeholder Nama",
        maxLength: 80,
      },
      {
        key: "contact_form_email_label",
        label: "Form: Label Email",
        maxLength: 40,
      },
      {
        key: "contact_form_email_placeholder",
        label: "Form: Placeholder Email",
        maxLength: 80,
      },
      {
        key: "contact_form_subject_label",
        label: "Form: Label Subjek",
        maxLength: 40,
      },
      {
        key: "contact_form_subject_placeholder",
        label: "Form: Placeholder Subjek",
        maxLength: 120,
      },
      {
        key: "contact_form_message_label",
        label: "Form: Label Pesan",
        maxLength: 40,
      },
      {
        key: "contact_form_message_placeholder",
        label: "Form: Placeholder Pesan",
        maxLength: 160,
      },
      {
        key: "contact_form_submit",
        label: "Form: Tombol Kirim",
        maxLength: 60,
      },
      {
        key: "contact_form_submitting",
        label: "Form: Tombol Saat Mengirim",
        maxLength: 60,
      },
      {
        key: "contact_form_success_title",
        label: "Form: Judul Sukses",
        maxLength: 80,
      },
      {
        key: "contact_form_success_message",
        label: "Form: Pesan Sukses",
        type: "textarea",
        maxLength: 300,
      },
      {
        key: "contact_form_send_another",
        label: "Form: Tombol Kirim Lagi",
        maxLength: 60,
      },
      {
        key: "contact_form_error_fallback",
        label: "Form: Pesan Gagal",
        maxLength: 300,
      },
      {
        key: "contact_form_network_error",
        label: "Form: Pesan Error Jaringan",
        maxLength: 300,
      },
    ],
  },
  {
    id: "halaman-404",
    title: "Halaman 404",
    fields: [
      { key: "not_found_title", label: "Judul", maxLength: 100 },
      {
        key: "not_found_description",
        label: "Deskripsi",
        type: "textarea",
        maxLength: 300,
      },
      { key: "not_found_home", label: "Tombol Beranda", maxLength: 60 },
      { key: "not_found_projects", label: "Tombol Lihat Proyek", maxLength: 60 },
    ],
  },
];

export function contentFieldLabel(key: ContentKey): string {
  for (const section of CONTENT_SECTIONS) {
    const field = section.fields.find((item) => item.key === key);
    if (field) return field.label;
  }
  return key;
}
