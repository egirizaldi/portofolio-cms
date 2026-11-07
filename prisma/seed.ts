/**
 * Seed data awal — aman dijalankan berulang (memakai upsert).
 *
 * Pakai: npm run db:seed
 * Kredensial admin diambil dari ADMIN_EMAIL & ADMIN_PASSWORD pada .env,
 * tidak pernah ditulis di source code.
 */
import { PrismaClient, ProjectStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

import { CONTENT_DEFAULTS } from "../src/lib/content";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_EMAIL dan ADMIN_PASSWORD wajib diisi di .env sebelum menjalankan seed.",
    );
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Administrator",
      passwordHash,
    },
  });
  console.log(`✔ Admin siap: ${admin.email}`);

  const profile = await prisma.profile.findFirst();
  if (!profile) {
    await prisma.profile.create({
      data: {
        fullName: "Nama Lengkap",
        headline: "Full-Stack Developer",
        profession: "Web Developer",
        bio: "Perkenalkan diri Anda melalui dashboard CMS.",
        contactEmail: adminEmail,
        location: "Indonesia",
      },
    });
    console.log("✔ Profil awal dibuat");
  }

  const settings: Array<[string, string]> = [
    ...Object.entries(CONTENT_DEFAULTS).map(
      ([key, value]) =>
        [key, key === "contact_email" ? adminEmail : value] as [string, string],
    ),
    ["show_cv_download", "true"],
  ];

  for (const [key, value] of settings) {
    await prisma.setting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }
  console.log(`✔ ${settings.length} pengaturan awal siap`);

  const categories = [
    { name: "Web Development", slug: "web-development", description: "Aplikasi dan website." },
    { name: "Mobile Apps", slug: "mobile-apps", description: "Aplikasi Android/Flutter." },
    { name: "UI/UX Design", slug: "ui-ux-design", description: "Desain antarmuka dan pengalaman pengguna." },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log(`✔ ${categories.length} kategori contoh siap`);

  const skills = [
    { name: "TypeScript", groupName: "Frontend", level: 90, displayOrder: 1 },
    { name: "React / Next.js", groupName: "Frontend", level: 90, displayOrder: 2 },
    { name: "Tailwind CSS", groupName: "Frontend", level: 85, displayOrder: 3 },
    { name: "Node.js", groupName: "Backend", level: 80, displayOrder: 4 },
    { name: "PostgreSQL", groupName: "Backend", level: 75, displayOrder: 5 },
    { name: "Git & GitHub", groupName: "Tools", level: 85, displayOrder: 6 },
  ];

  for (const skill of skills) {
    const existing = await prisma.skill.findFirst({ where: { name: skill.name } });
    if (!existing) {
      await prisma.skill.create({ data: skill });
    }
  }
  console.log(`✔ ${skills.length} skill contoh siap`);

  const webDev = await prisma.category.findUnique({ where: { slug: "web-development" } });
  if (webDev) {
    await prisma.project.upsert({
      where: { slug: "contoh-proyek-pertama" },
      update: {},
      create: {
        title: "Contoh Proyek Pertama",
        slug: "contoh-proyek-pertama",
        shortDescription: "Proyek contoh untuk menguji daftar dan filter kategori.",
        description:
          "Ini adalah data contoh. Silakan ubah atau hapus melalui dashboard CMS.",
        thumbnail: "/uploads/.gitkeep",
        technologies: ["Next.js", "TypeScript", "PostgreSQL"],
        status: ProjectStatus.PUBLISHED,
        isFeatured: true,
        categories: { connect: { id: webDev.id } },
      },
    });
    console.log("✔ Proyek contoh siap");
  }

  console.log("Seed selesai.");
}

main()
  .catch((error) => {
    console.error("Seed gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
