import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string({ error: "Nama kategori wajib diisi." })
    .trim()
    .min(2, { error: "Nama minimal 2 karakter." })
    .max(60, { error: "Nama maksimal 60 karakter." }),
  slug: z
    .string({ error: "Slug wajib diisi." })
    .trim()
    .min(2, { error: "Slug minimal 2 karakter." })
    .max(80, { error: "Slug maksimal 80 karakter." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      error: "Slug hanya boleh huruf kecil, angka, dan tanda hubung.",
    }),
  description: z
    .string()
    .trim()
    .max(300, { error: "Deskripsi maksimal 300 karakter." })
    .optional()
    .or(z.literal("")),
});

export type CategoryInput = z.infer<typeof categorySchema>;

/** Membuat slug dari judul (dipakai sebagai default di form). */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
