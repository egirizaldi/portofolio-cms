// API route untuk menerima pesan kontak dari pengunjung
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { messageSchema } from "@/lib/validations/message";

export async function POST(request: Request) {
  const json = await request.json();
  const result = messageSchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid input", details: result.error.format() },
      { status: 400 }
    );
  }
  const data = result.data;

  const created = await prisma.message.create({
    data: {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
