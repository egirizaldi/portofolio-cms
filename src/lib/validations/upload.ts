import { z } from "zod";

/** Jenis upload yang didukung CMS. */
export const UPLOAD_TYPES = [
  "profile",
  "thumbnail",
  "gallery",
  "certificate",
  "cv",
] as const;

export type UploadType = (typeof UPLOAD_TYPES)[number];

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
export const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const PDF_MIME_TYPE = "application/pdf";

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  [PDF_MIME_TYPE]: "pdf",
};

export function isUploadType(value: string): value is UploadType {
  return (UPLOAD_TYPES as readonly string[]).includes(value);
}

/** MIME yang boleh diunggah untuk tipe tertentu. */
export function getAllowedMimeTypes(type: UploadType): string[] {
  return type === "cv" ? [PDF_MIME_TYPE] : [...IMAGE_MIME_TYPES];
}

/** Batas ukuran file (byte) untuk tipe tertentu. */
export function getMaxUploadSize(type: UploadType): number {
  return type === "cv" ? MAX_PDF_SIZE : MAX_IMAGE_SIZE;
}

/** Ekstensi file dari MIME, atau null jika tidak didukung. */
export function getExtensionForMime(mimeType: string): string | null {
  return MIME_EXTENSIONS[mimeType] ?? null;
}

export function formatMaxSize(type: UploadType): string {
  return type === "cv" ? "10 MB" : "5 MB";
}

/**
 * Validasi metadata upload. Isi file sebenarnya tidak diperiksa di sini karena
 * browser mengunggah langsung ke Supabase; bucket Supabase tetap menegakkan
 * batas ukuran dan MIME sebagai lapisan terakhir.
 */
export function validateUploadMetadata(input: {
  type: UploadType;
  mimeType: string;
  size: number;
}): string | null {
  const allowed = getAllowedMimeTypes(input.type);

  if (!allowed.includes(input.mimeType)) {
    return input.type === "cv"
      ? "Berkas CV harus berupa PDF."
      : "Format gambar harus JPEG, PNG, WebP, atau GIF.";
  }

  if (input.size <= 0) {
    return "Ukuran file tidak boleh kosong.";
  }

  const maxSize = getMaxUploadSize(input.type);
  if (input.size > maxSize) {
    return `Ukuran file melebihi batas maksimum ${formatMaxSize(input.type)}.`;
  }

  return null;
}

/** Body JSON yang dikirim klien ke `POST /api/upload`. */
export const uploadRequestSchema = z.object({
  type: z.enum(UPLOAD_TYPES),
  filename: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(100),
  size: z.number().int().positive(),
});

export type UploadRequestInput = z.input<typeof uploadRequestSchema>;
export type UploadRequest = z.output<typeof uploadRequestSchema>;

/** Respons sukses `POST /api/upload`. */
export type SignedUploadResponse = {
  path: string;
  token: string;
  signedUrl: string;
  publicUrl: string;
  bucket: string;
};
