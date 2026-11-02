import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const VALID_TYPES = ["profile", "thumbnail", "gallery", "certificate", "cv"] as const;
type UploadType = (typeof VALID_TYPES)[number];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Mendeteksi ekstensi file berdasarkan magic bytes (header file).
 * Mencegah spoofing Content-Type dari client.
 */
function detectFileType(buffer: Buffer): { ext: string; isImage: boolean; isPdf: boolean } | null {
  // JPEG: FF D8 FF
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { ext: ".jpg", isImage: true, isPdf: false };
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buffer.length >= 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
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

/**
 * POST /api/upload
 * Menerima multipart/form-data, field `file` dan `type` (profile|thumbnail|gallery|certificate|cv)
 */
export async function POST(request: Request) {
  await requireAdmin();

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Permintaan harus berupa multipart/form-data" },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  const type = formData.get("type") as UploadType | null;

  if (!type || !VALID_TYPES.includes(type)) {
    return NextResponse.json(
      {
        error: "Tipe upload tidak valid. Pilihan: profile, thumbnail, gallery, certificate, cv",
      },
      { status: 400 }
    );
  }

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "File wajib disertakan dalam permintaan" },
      { status: 400 }
    );
  }

  if (file.size === 0) {
    return NextResponse.json(
      { error: "Ukuran file tidak boleh kosong" },
      { status: 400 }
    );
  }

  const isCv = type === "cv";
  const maxSize = isCv ? MAX_PDF_SIZE : MAX_IMAGE_SIZE;

  if (file.size > maxSize) {
    return NextResponse.json(
      {
        error: `Ukuran file melebihi batas maksimum (${isCv ? "10MB untuk PDF" : "5MB untuk gambar"})`,
      },
      { status: 400 }
    );
  }

  // Baca buffer dan verifikasi magic bytes di sisi server
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const detected = detectFileType(buffer);

  if (!detected) {
    return NextResponse.json(
      {
        error: "Format file tidak didukung. Format yang diizinkan: JPEG, PNG, WebP, GIF, atau PDF",
      },
      { status: 400 }
    );
  }

  if (isCv && !detected.isPdf) {
    return NextResponse.json(
      { error: "File CV harus berupa dokumen PDF yang valid" },
      { status: 400 }
    );
  }

  if (!isCv && !detected.isImage) {
    return NextResponse.json(
      { error: "File harus berupa gambar yang valid (JPEG, PNG, WebP, GIF)" },
      { status: 400 }
    );
  }

  // Simpan file ke direktori public/uploads/{type}/
  const uploadDir = path.join(process.cwd(), "public", "uploads", type);
  await fs.mkdir(uploadDir, { recursive: true });

  const filename = `${crypto.randomUUID()}${detected.ext}`;
  const filePath = path.join(uploadDir, filename);

  await fs.writeFile(filePath, buffer);

  const url = `/uploads/${type}/${filename}`;
  return NextResponse.json({ url }, { status: 201 });
}
