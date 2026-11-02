// API route untuk meng‑update metadata gambar proyek dan menghapus gambar
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { projectImageSchema } from "@/lib/validations/projectImage";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const { id } = await params;

  const json = await request.json();
  // Hanya allow fields yang ada di schema (partial)
  const partialSchema = projectImageSchema.partial();
  const result = partialSchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid input", details: result.error.format() },
      { status: 400 }
    );
  }
  const data = result.data;

  const updated = await prisma.projectImage.update({
    where: { id },
    data: {
      altText: data.altText,
      displayOrder: data.displayOrder,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const { id } = await params;

  const existing = await prisma.projectImage.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  await prisma.projectImage.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
