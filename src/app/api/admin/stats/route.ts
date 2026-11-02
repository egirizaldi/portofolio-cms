// API route untuk statistik dashboard admin
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";

export async function GET() {
  // Pastikan hanya admin yang dapat mengakses
  await requireAdmin();

  const [
    projectTotal,
    projectPublished,
    projectDraft,
    categoryCount,
    skillCount,
    experienceCount,
    educationCount,
    certificateCount,
    messageTotal,
    messageUnread,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "PUBLISHED" as const } }),
    prisma.project.count({ where: { status: "DRAFT" as const } }),
    prisma.category.count(),
    prisma.skill.count(),
    prisma.experience.count(),
    prisma.education.count(),
    prisma.certificate.count(),
    prisma.message.count(),
    prisma.message.count({ where: { status: "UNREAD" as const } }),
  ]);

  const data = {
    projects: {
      total: projectTotal,
      published: projectPublished,
      draft: projectDraft,
    },
    categories: categoryCount,
    skills: skillCount,
    experiences: experienceCount,
    educations: educationCount,
    certificates: certificateCount,
    messages: {
      total: messageTotal,
      unread: messageUnread,
    },
  };

  return NextResponse.json(data);
}
