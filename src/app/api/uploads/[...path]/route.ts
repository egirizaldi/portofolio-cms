import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
};

/**
 * GET /api/uploads/[...path]
 * Menyajikan file hasil upload lokal (mode fallback tanpa Supabase).
 * Dibutuhkan karena `next start` tidak menyajikan file `public/` yang
 * ditambahkan setelah build.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const relativePath = segments.join("/");

  const uploadRoot = path.join(process.cwd(), "public", "uploads");
  const resolved = path.resolve(uploadRoot, relativePath);

  // Cegah path traversal keluar dari folder uploads.
  if (
    resolved === uploadRoot ||
    !resolved.startsWith(uploadRoot + path.sep)
  ) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const contentType = CONTENT_TYPES[path.extname(resolved).toLowerCase()];
  if (!contentType) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const file = await fs.readFile(resolved);

    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(file.byteLength),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
