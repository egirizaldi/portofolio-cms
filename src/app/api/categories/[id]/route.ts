// API routes untuk Category (detail, update, delete)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { categorySchema } from "@/lib/validations/category";
import { requireAdmin } from "@/lib/auth/guards";

/** GET /api/categories/:id */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  return NextResponse.json(category);
}

/** PUT /api/categories/:id */
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  const { id } = params;
  const json = await request.json();
  // Partial schema: semua field optional untuk update
  const partialSchema = categorySchema.partial();
  const result = partialSchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
  }
  const data = result.data;
  const updated = await prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description ?? undefined,
    },
  });
  return NextResponse.json(updated);
}

/** DELETE /api/categories/:id */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  const { id } = params;
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
