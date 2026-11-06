import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdminApi } from "@/lib/auth/guards";
import { skillSchema } from "@/lib/validations/skill";

/**
 * GET /api/skills/:id
 * Ambil satu skill by id (publik)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const skill = await prisma.skill.findUnique({ where: { id } });

  if (!skill) {
    return NextResponse.json({ error: "Skill tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(skill);
}

/**
 * PUT /api/skills/:id
 * Update skill by id (admin only)
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminApi();
  if (authError) return authError;
  const { id } = await params;

  const existing = await prisma.skill.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Skill tidak ditemukan" }, { status: 404 });
  }

  const json = await request.json();
  const partialSchema = skillSchema.partial();
  const result = partialSchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid input", details: result.error.format() },
      { status: 400 }
    );
  }

  const data = result.data;
  const updated = await prisma.skill.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.groupName !== undefined && { groupName: data.groupName || null }),
      ...(data.level !== undefined && { level: data.level ?? null }),
      ...(data.icon !== undefined && { icon: data.icon || null }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
    },
  });

  return NextResponse.json(updated);
}

/**
 * DELETE /api/skills/:id
 * Hapus skill by id (admin only)
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminApi();
  if (authError) return authError;
  const { id } = await params;

  const existing = await prisma.skill.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Skill tidak ditemukan" }, { status: 404 });
  }

  await prisma.skill.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
