import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { MessageStatus, Prisma } from "@prisma/client";

/**
 * GET /api/messages
 * Ambil semua pesan (admin only), support query ?status=UNREAD|READ|ARCHIVED, urutkan createdAt desc
 */
export async function GET(request: Request) {
  await requireAdmin();

  const url = new URL(request.url);
  const statusParam = url.searchParams.get("status")?.toUpperCase();

  const where: Prisma.MessageWhereInput = {};
  if (
    statusParam &&
    Object.values(MessageStatus).includes(statusParam as MessageStatus)
  ) {
    where.status = statusParam as MessageStatus;
  }

  const messages = await prisma.message.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: messages });
}
