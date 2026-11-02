import { z } from "zod";

export const educationSchema = z.object({
  institution: z
    .string({ error: "Institusi wajib diisi." })
    .trim()
    .min(1, { error: "Institusi wajib diisi." })
    .max(100, { error: "Institusi maksimal 100 karakter." }),
  program: z
    .string({ error: "Program studi wajib diisi." })
    .trim()
    .min(1, { error: "Program studi wajib diisi." })
    .max(100, { error: "Program studi maksimal 100 karakter." }),
  level: z
    .string()
    .trim()
    .max(60, { error: "Jenjang maksimal 60 karakter." })
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

export type EducationInput = z.infer<typeof educationSchema>;
