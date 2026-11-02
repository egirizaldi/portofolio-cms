import { z } from "zod";

const optionalUrl = z
  .union([z.url({ error: "Format URL tidak valid." }), z.literal("")])
  .optional()
  .nullable();

export const certificateSchema = z.object({
  name: z
    .string({ error: "Nama sertifikat wajib diisi." })
    .trim()
    .min(1, { error: "Nama sertifikat wajib diisi." })
    .max(120, { error: "Nama maksimal 120 karakter." }),
  issuer: z
    .string({ error: "Penerbit sertifikat wajib diisi." })
    .trim()
    .min(1, { error: "Penerbit sertifikat wajib diisi." })
    .max(100, { error: "Penerbit maksimal 100 karakter." }),
  issuedAt: z
    .union([z.iso.date(), z.iso.datetime(), z.literal("")])
    .optional()
    .nullable(),
  credentialUrl: optionalUrl,
  imagePath: z
    .string()
    .trim()
    .optional()
    .nullable()
    .or(z.literal("")),
  displayOrder: z
    .number()
    .int({ error: "Display order harus bilangan bulat." })
    .default(0),
});

export type CertificateInput = z.infer<typeof certificateSchema>;
