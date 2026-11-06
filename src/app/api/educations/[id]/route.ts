import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdminApi } from "@/lib/auth/guards";
import { educationSchema } from "@/lib/validations/education";

/**
 * GET /api/educations/:id
 * Ambil satu education by id (publik)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const education = await prisma.education.findUnique({ where: { id } });

  if (!education) {
    return NextResponse.json(
      { error: "Education tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json(education);
}

/**
 * PUT /api/educations/:id
 * Update education (admin only)
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminApi();
  if (authError) return authError;
  const { id } = await params;

  const existing = await prisma.education.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json(
      { error: "Education tidak ditemukan" },
      { status: 404 }
    );
  }

  const json = await request.json();
  const partialSchema = educationSchema.partial();
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

  const updated = await prisma.education.update({
    where: { id },
    data: {
      ...(data.institution !== undefined && { institution: data.institution }),
      ...(data.program !== undefined && { program: data.program }),
      ...(data.level !== undefined && { level: data.level || null }),
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
 * DELETE /api/educations/:id
 * Hapus education (admin only)
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminApi();
  if (authError) return authError;
  const { id } = await params;

  const existing = await prisma.education.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json(
      { error: "Education tidak ditemukan" },
      { status: 404 }
    );
  }

  await prisma.education.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
