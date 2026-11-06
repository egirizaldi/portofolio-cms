import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdminApi } from "@/lib/auth/guards";
import { skillSchema } from "@/lib/validations/skill";

/**
 * GET /api/skills
 * Ambil semua skill, urutkan groupName asc, displayOrder asc (publik)
 */
export async function GET() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ groupName: "asc" }, { displayOrder: "asc" }],
  });

  return NextResponse.json({ data: skills });
}

/**
 * POST /api/skills
 * Buat skill baru (admin only)
 */
export async function POST(request: Request) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  const json = await request.json();
  const result = skillSchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid input", details: result.error.format() },
      { status: 400 }
    );
  }

  const data = result.data;
  const created = await prisma.skill.create({
    data: {
      name: data.name,
      groupName: data.groupName || null,
      level: data.level ?? null,
      icon: data.icon || null,
      isActive: data.isActive,
      displayOrder: data.displayOrder,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
