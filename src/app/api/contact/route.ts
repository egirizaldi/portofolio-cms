// API route untuk menerima pesan kontak dari pengunjung
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { messageSchema } from "@/lib/validations/message";

// In-memory rate limiting: 3 requests per minute per IP
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 3;

  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function POST(request: Request) {
  // 1. IP Rate Limiting
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : (request.headers.get("x-real-ip") || "127.0.0.1");

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too Many Requests", details: "Maksimal 3 request per menit. Silakan coba lagi nanti." },
      { status: 429 }
    );
  }

  const json = await request.json();

  // 2. Honeypot check
  if (json.honeypot && typeof json.honeypot === "string" && json.honeypot.trim().length > 0) {
    // Honeypot terisi: kembalikan 200 OK palsu tanpa menyimpan ke database
    return NextResponse.json({ message: "Pesan berhasil dikirim." }, { status: 200 });
  }

  // 3. Validasi form
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
