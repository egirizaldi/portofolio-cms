import { z } from "zod";

export const projectStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);

const optionalUrl = z
  .union([z.url({ error: "Format URL tidak valid." }), z.literal("")])
  .optional();

export const projectSchema = z.object({
  title: z
    .string({ error: "Judul wajib diisi." })
    .trim()
    .min(3, { error: "Judul minimal 3 karakter." })
    .max(120, { error: "Judul maksimal 120 karakter." }),
  slug: z
    .string({ error: "Slug wajib diisi." })
    .trim()
    .min(3, { error: "Slug minimal 3 karakter." })
    .max(120, { error: "Slug maksimal 120 karakter." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      error: "Slug hanya boleh huruf kecil, angka, dan tanda hubung.",
    }),
  shortDescription: z
    .string({ error: "Deskripsi singkat wajib diisi." })
    .trim()
    .min(10, { error: "Deskripsi singkat minimal 10 karakter." })
    .max(200, { error: "Deskripsi singkat maksimal 200 karakter." }),
  description: z
    .string({ error: "Deskripsi wajib diisi." })
    .trim()
    .min(20, { error: "Deskripsi minimal 20 karakter." }),
  thumbnail: z
    .string({ error: "Thumbnail wajib diisi." })
    .trim()
    .min(1, { error: "Thumbnail wajib diisi." }),
  technologies: z
    .array(z.string().trim().min(1).max(40))
    .max(20, { error: "Maksimal 20 teknologi." })
    .default([]),
  demoUrl: optionalUrl,
  githubUrl: optionalUrl,
  projectDate: z
    .union([z.iso.date(), z.literal("")])
    .optional()
    .nullable(),
  isFeatured: z.boolean().default(false),
  status: projectStatusSchema.default("DRAFT"),
  categoryIds: z
    .array(z.uuid({ error: "Kategori tidak valid." }))
    .default([]),
});

export type ProjectInput = z.infer<typeof projectSchema>;
