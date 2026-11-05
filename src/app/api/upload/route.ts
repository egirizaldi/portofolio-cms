import crypto from "crypto";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import {
  getPublicStorageUrl,
  getStorageBucket,
  getSupabaseAdmin,
  isStorageConfigured,
} from "@/lib/storage/supabase";
import {
  getExtensionForMime,
  uploadRequestSchema,
  validateUploadMetadata,
} from "@/lib/validations/upload";

/**
 * GET /api/upload
 * Memberi tahu klien mode penyimpanan yang aktif:
 * - "supabase" jika env Supabase lengkap.
 * - "local"    jika belum (fallback ke `public/uploads/`).
 */
export async function GET() {
  const session = await auth();
  if (process.env.CMS_ENABLED !== "true" || !session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    mode: isStorageConfigured() ? "supabase" : "local",
  });
}

/**
 * POST /api/upload
 * Membuat signed upload URL Supabase agar browser bisa mengunggah file
 * langsung ke Storage (melewati batas body 4.5 MB Vercel).
 *
 * Body JSON: { type, filename, mimeType, size }
 * Respons:   { path, token, signedUrl, publicUrl, bucket }
 */
export async function POST(request: Request) {
  const session = await auth();
  if (process.env.CMS_ENABLED !== "true" || !session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isStorageConfigured()) {
    return NextResponse.json(
      {
        error:
          "Supabase Storage belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, dan SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Permintaan harus berupa JSON." },
      { status: 400 },
    );
  }

  const parsed = uploadRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data upload tidak valid.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { type, mimeType, size } = parsed.data;

  const validationError = validateUploadMetadata({ type, mimeType, size });
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const extension = getExtensionForMime(mimeType);
  if (!extension) {
    return NextResponse.json(
      { error: "Format file tidak didukung." },
      { status: 400 },
    );
  }

  const bucket = getStorageBucket();
  const objectPath = `${type}/${crypto.randomUUID()}.${extension}`;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(objectPath, { upsert: false });

  if (error || !data) {
    return NextResponse.json(
      {
        error: `Gagal membuat URL upload: ${error?.message ?? "kesalahan tidak diketahui"}`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json(
    {
      path: data.path,
      token: data.token,
      signedUrl: data.signedUrl,
      publicUrl: getPublicStorageUrl(data.path),
      bucket,
    },
    { status: 201 },
  );
}
