// API routes untuk Category (admin CRUD)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { categorySchema } from "@/lib/validations/category";
import { requireAdmin } from "@/lib/auth/guards";

/** GET /api/categories */
export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: [{ name: "asc" }],
  });
  return NextResponse.json(categories);
}

/** POST /api/categories - buat kategori baru (admin only) */
export async function POST(request: Request) {
  await requireAdmin();
  const json = await request.json();
  const result = categorySchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
  }
  const data = result.data;
  const created = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || undefined,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
