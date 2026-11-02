// API routes untuk Project (detail, update, delete)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { projectSchema } from "@/lib/validations/project";
import { requireAdmin } from "@/lib/auth/guards";

/**
 * GET /api/projects/:id
 * - Mengembalikan data project beserta relasi (categories, images).
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { categories: true, images: true },
  });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  return NextResponse.json(project);
}

/**
 * PUT /api/projects/:id
 * - Hanya admin yang dapat mengupdate.
 * - Validasi menggunakan `projectSchema` (semua field optional kecuali yang ingin diubah).
 */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const json = await request.json();
  const partialSchema = projectSchema.partial();
  const result = partialSchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
  }
  const data = result.data;
  const { categoryIds, ...projectData } = data;

  const updated = await prisma.project.update({
    where: { id },
    data: {
      ...projectData,
      ...(categoryIds && {
        categories: {
          set: categoryIds.map((cid) => ({ id: cid })),
        },
      }),
    },
    include: { categories: true },
  });
  return NextResponse.json(updated);
}

/**
 * DELETE /api/projects/:id
 * - Hanya admin yang dapat menghapus.
 * - Menggunakan cascade delete (Prisma menghapus gambar terkait secara otomatis).
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  // Pastikan ada project
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
