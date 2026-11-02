import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { educationSchema } from "@/lib/validations/education";

/**
 * GET /api/educations
 * Ambil semua education, urutkan displayOrder asc (publik)
 */
export async function GET() {
  const educations = await prisma.education.findMany({
    orderBy: [{ displayOrder: "asc" }],
  });

  return NextResponse.json({ data: educations });
}

/**
 * POST /api/educations
 * Buat education baru (admin only)
 */
export async function POST(request: Request) {
  await requireAdmin();

  const json = await request.json();
  const result = educationSchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid input", details: result.error.format() },
      { status: 400 }
    );
  }

  const data = result.data;
  const isCurrent = data.isCurrent ?? false;
  const endDate = isCurrent || !data.endDate ? null : new Date(data.endDate);

  const created = await prisma.education.create({
    data: {
      institution: data.institution,
      program: data.program,
      level: data.level || null,
      description: data.description || null,
      startDate: new Date(data.startDate),
      endDate,
      isCurrent,
      displayOrder: data.displayOrder,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
