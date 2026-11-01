// API route untuk statistik dashboard admin
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";

export async function GET() {
  // Pastikan hanya admin yang dapat mengakses
  await requireAdmin();

  const [projectTotal, projectPublished, projectDraft] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "PUBLISHED" as const } }),
    prisma.project.count({ where: { status: "DRAFT" as const } }),
  ]);

  const [categoryCount, skillCount, messageUnread] = await Promise.all([
    prisma.category.count(),
    prisma.skill.count(),
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
    messages: {
      unread: messageUnread,
    },
  };

  return NextResponse.json(data);
}
