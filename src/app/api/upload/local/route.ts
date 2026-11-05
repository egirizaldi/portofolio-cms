import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import {
  getMaxUploadSize,
  isUploadType,
  type UploadType,
} from "@/lib/validations/upload";

/**
 * Mendeteksi ekstensi file berdasarkan magic bytes (header file).
 * Mencegah spoofing Content-Type dari client.
 */
function detectFileType(
  buffer: Buffer,
): { ext: string; isImage: boolean; isPdf: boolean } | null {
  // JPEG: FF D8 FF
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return { ext: ".jpg", isImage: true, isPdf: false };
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { ext: ".png", isImage: true, isPdf: false };
  }
  // GIF: GIF87a atau GIF89a
  if (buffer.length >= 6 && buffer.toString("ascii", 0, 6).startsWith("GIF8")) {
    return { ext: ".gif", isImage: true, isPdf: false };
  }
  // WebP: RIFF .... WEBP
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return { ext: ".webp", isImage: true, isPdf: false };
  }
  // PDF: %PDF-
  if (buffer.length >= 5 && buffer.toString("ascii", 0, 5) === "%PDF-") {
    return { ext: ".pdf", isImage: false, isPdf: true };
  }

  return null;
}

function typeErrorMessage(type: UploadType) {
  return type === "cv"
    ? "File CV harus berupa dokumen PDF yang valid."
    : "File harus berupa gambar yang valid (JPEG, PNG, WebP, GIF).";
}

/**
 * POST /api/upload/local
 * Fallback penyimpanan lokal saat Supabase Storage belum dikonfigurasi.
 * Menerima multipart/form-data dengan field `file` dan `type`.
 * Hanya untuk development/CMS lokal; file disimpan di `public/uploads/`.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (process.env.CMS_ENABLED !== "true" || !session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Permintaan harus berupa multipart/form-data." },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  const type = formData.get("type");

  if (typeof type !== "string" || !isUploadType(type)) {
    return NextResponse.json(
      {
        error:
          "Tipe upload tidak valid. Pilihan: profile, thumbnail, gallery, certificate, cv.",
      },
      { status: 400 },
    );
  }

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "File wajib disertakan dalam permintaan." },
      { status: 400 },
    );
  }

  if (file.size === 0) {
    return NextResponse.json(
      { error: "Ukuran file tidak boleh kosong." },
      { status: 400 },
    );
  }

  const maxSize = getMaxUploadSize(type);
  if (file.size > maxSize) {
    const label = type === "cv" ? "10 MB" : "5 MB";
    return NextResponse.json(
      { error: `Ukuran file melebihi batas maksimum ${label}.` },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = detectFileType(buffer);

  if (!detected) {
    return NextResponse.json(
      { error: typeErrorMessage(type) },
      { status: 400 },
    );
  }

  if (type === "cv" && !detected.isPdf) {
    return NextResponse.json(
      { error: typeErrorMessage(type) },
      { status: 400 },
    );
  }

  if (type !== "cv" && !detected.isImage) {
    return NextResponse.json(
      { error: typeErrorMessage(type) },
      { status: 400 },
    );
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", type);
  await fs.mkdir(uploadDir, { recursive: true });

  const filename = `${crypto.randomUUID()}${detected.ext}`;
  await fs.writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json(
    { publicUrl: `/api/uploads/${type}/${filename}` },
    { status: 201 },
  );
}
