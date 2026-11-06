import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdminApi } from "@/lib/auth/guards";
import { certificateSchema } from "@/lib/validations/certificate";

/**
 * GET /api/certificates/:id
 * Ambil satu certificate by id (publik)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const certificate = await prisma.certificate.findUnique({ where: { id } });

  if (!certificate) {
    return NextResponse.json(
      { error: "Certificate tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json(certificate);
}

/**
 * PUT /api/certificates/:id
 * Update certificate (admin only)
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminApi();
  if (authError) return authError;
  const { id } = await params;

  const existing = await prisma.certificate.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json(
      { error: "Certificate tidak ditemukan" },
      { status: 404 }
    );
  }

  const json = await request.json();
  const partialSchema = certificateSchema.partial();
  const result = partialSchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid input", details: result.error.format() },
      { status: 400 }
    );
  }

  const data = result.data;
  const updated = await prisma.certificate.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.issuer !== undefined && { issuer: data.issuer }),
      ...(data.issuedAt !== undefined && {
        issuedAt: data.issuedAt ? new Date(data.issuedAt) : null,
      }),
      ...(data.credentialUrl !== undefined && {
        credentialUrl: data.credentialUrl || null,
      }),
      ...(data.imagePath !== undefined && {
        imagePath: data.imagePath || null,
      }),
      ...(data.displayOrder !== undefined && {
        displayOrder: data.displayOrder,
      }),
    },
  });

  return NextResponse.json(updated);
}

/**
 * DELETE /api/certificates/:id
 * Hapus certificate (admin only)
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminApi();
  if (authError) return authError;
  const { id } = await params;

  const existing = await prisma.certificate.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json(
      { error: "Certificate tidak ditemukan" },
      { status: 404 }
    );
  }

  await prisma.certificate.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
