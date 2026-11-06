import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdminApi } from "@/lib/auth/guards";
import { experienceSchema } from "@/lib/validations/experience";

/**
 * GET /api/experiences
 * Ambil semua experience, urutkan displayOrder asc, startDate desc (publik)
 */
export async function GET() {
  const experiences = await prisma.experience.findMany({
    orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
  });

  return NextResponse.json({ data: experiences });
}

/**
 * POST /api/experiences
 * Buat experience baru (admin only)
 */
export async function POST(request: Request) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  const json = await request.json();
  const result = experienceSchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid input", details: result.error.format() },
      { status: 400 }
    );
  }

  const data = result.data;
  const isCurrent = data.isCurrent ?? false;
  const endDate = isCurrent || !data.endDate ? null : new Date(data.endDate);

  const created = await prisma.experience.create({
    data: {
      position: data.position,
      organization: data.organization,
      location: data.location || null,
      description: data.description || null,
      startDate: new Date(data.startDate),
      endDate,
      isCurrent,
      displayOrder: data.displayOrder,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
