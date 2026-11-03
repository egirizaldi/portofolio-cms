import { z } from "zod";

export const experienceBaseSchema = z.object({
  position: z
    .string({ error: "Posisi wajib diisi." })
    .trim()
    .min(1, { error: "Posisi wajib diisi." })
    .max(100, { error: "Posisi maksimal 100 karakter." }),
  organization: z
    .string({ error: "Organisasi wajib diisi." })
    .trim()
    .min(1, { error: "Organisasi wajib diisi." })
    .max(100, { error: "Organisasi maksimal 100 karakter." }),
  location: z
    .string()
    .trim()
    .max(100, { error: "Lokasi maksimal 100 karakter." })
    .optional()
    .nullable()
    .or(z.literal("")),
  description: z
    .string()
    .trim()
    .optional()
    .nullable()
    .or(z.literal("")),
  startDate: z.union([z.iso.date(), z.iso.datetime()], {
    error: "Tanggal mulai wajib berupa format ISO date.",
  }),
  endDate: z
    .union([z.iso.date(), z.iso.datetime(), z.literal("")])
    .optional()
    .nullable(),
  isCurrent: z.boolean().default(false),
  displayOrder: z
    .number()
    .int({ error: "Display order harus bilangan bulat." })
    .default(0),
});

export const experienceSchema = experienceBaseSchema.refine(
  (data) => {
    if (data.isCurrent && data.endDate && data.endDate !== "") {
      return false;
    }
    return true;
  },
  {
    message:
      "Jika masih berlangsung (isCurrent true), endDate harus kosong/null.",
    path: ["endDate"],
  },
);

export type ExperienceInput = z.infer<typeof experienceSchema>;
