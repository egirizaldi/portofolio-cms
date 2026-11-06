// API route untuk mengubah status (draft/published) sebuah project
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdminApi } from "@/lib/auth/guards";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminApi();
  if (authError) return authError;
  const { id } = await params;
  const json = await request.json();
  const result = statusSchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid input", details: result.error.format() },
      { status: 400 }
    );
  }

  const updated = await prisma.project.update({
    where: { id },
    data: { status: result.data.status },
  });
  return NextResponse.json(updated);
}
