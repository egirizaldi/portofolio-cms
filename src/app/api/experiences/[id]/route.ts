import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { experienceSchema } from "@/lib/validations/experience";

/**
 * GET /api/experiences/:id
 * Ambil satu experience by id (publik)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const experience = await prisma.experience.findUnique({ where: { id } });

  if (!experience) {
    return NextResponse.json(
      { error: "Experience tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json(experience);
}

/**
 * PUT /api/experiences/:id
 * Update experience (admin only)
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const { id } = await params;

  const existing = await prisma.experience.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json(
      { error: "Experience tidak ditemukan" },
      { status: 404 }
    );
  }

  const json = await request.json();
  const partialSchema = experienceSchema.partial();
  const result = partialSchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid input", details: result.error.format() },
      { status: 400 }
    );
  }

  const data = result.data;
  const isCurrent = data.isCurrent !== undefined ? data.isCurrent : existing.isCurrent;
  let endDate = existing.endDate;

  if (isCurrent) {
    endDate = null;
  } else if (data.endDate !== undefined) {
    endDate = data.endDate ? new Date(data.endDate) : null;
  }

  const updated = await prisma.experience.update({
    where: { id },
    data: {
      ...(data.position !== undefined && { position: data.position }),
      ...(data.organization !== undefined && { organization: data.organization }),
      ...(data.location !== undefined && { location: data.location || null }),
      ...(data.description !== undefined && { description: data.description || null }),
      ...(data.startDate !== undefined && { startDate: new Date(data.startDate) }),
      endDate,
      ...(data.isCurrent !== undefined && { isCurrent: data.isCurrent }),
      ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
    },
  });

  return NextResponse.json(updated);
}

/**
 * DELETE /api/experiences/:id
 * Hapus experience (admin only)
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const { id } = await params;

  const existing = await prisma.experience.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json(
      { error: "Experience tidak ditemukan" },
      { status: 404 }
    );
  }

  await prisma.experience.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
