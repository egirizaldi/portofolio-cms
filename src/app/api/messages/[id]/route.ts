import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdminApi } from "@/lib/auth/guards";
import { z } from "zod";
import { MessageStatus } from "@prisma/client";

const patchStatusSchema = z.object({
  status: z.enum([MessageStatus.UNREAD, MessageStatus.READ, MessageStatus.ARCHIVED], {
    error: "Status harus salah satu dari: UNREAD, READ, ARCHIVED",
  }),
});

/**
 * GET /api/messages/:id
 * Ambil satu pesan by id (admin only)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminApi();
  if (authError) return authError;
  const { id } = await params;

  const message = await prisma.message.findUnique({ where: { id } });
  if (!message) {
    return NextResponse.json({ error: "Pesan tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(message);
}

/**
 * PATCH /api/messages/:id
 * Update status pesan: UNREAD | READ | ARCHIVED (admin only)
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminApi();
  if (authError) return authError;
  const { id } = await params;

  const existing = await prisma.message.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Pesan tidak ditemukan" }, { status: 404 });
  }

  const json = await request.json();
  const result = patchStatusSchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid input", details: result.error.format() },
      { status: 400 }
    );
  }

  const updated = await prisma.message.update({
    where: { id },
    data: { status: result.data.status },
  });

  return NextResponse.json(updated);
}

/**
 * DELETE /api/messages/:id
 * Hapus pesan (admin only)
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminApi();
  if (authError) return authError;
  const { id } = await params;

  const existing = await prisma.message.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Pesan tidak ditemukan" }, { status: 404 });
  }

  await prisma.message.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
