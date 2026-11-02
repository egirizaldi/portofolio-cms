import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { certificateSchema } from "@/lib/validations/certificate";

/**
 * GET /api/certificates
 * Ambil semua certificate, urutkan displayOrder asc (publik)
 */
export async function GET() {
  const certificates = await prisma.certificate.findMany({
    orderBy: [{ displayOrder: "asc" }],
  });

  return NextResponse.json({ data: certificates });
}

/**
 * POST /api/certificates
 * Buat certificate baru (admin only)
 */
export async function POST(request: Request) {
  await requireAdmin();

  const json = await request.json();
  const result = certificateSchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid input", details: result.error.format() },
      { status: 400 }
    );
  }

  const data = result.data;
  const created = await prisma.certificate.create({
    data: {
      name: data.name,
      issuer: data.issuer,
      issuedAt: data.issuedAt ? new Date(data.issuedAt) : null,
      credentialUrl: data.credentialUrl || null,
      imagePath: data.imagePath || null,
      displayOrder: data.displayOrder,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
