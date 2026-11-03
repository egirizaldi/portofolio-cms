import { z } from "zod";

const optionalUrl = z
  .union([z.url({ error: "Format URL tidak valid." }), z.literal("")])
  .optional()
  .nullable();

export const profileSchema = z.object({
  fullName: z
    .string({ error: "Nama lengkap wajib diisi." })
    .trim()
    .min(1, { error: "Nama lengkap wajib diisi." })
    .max(80, { error: "Nama lengkap maksimal 80 karakter." }),
  headline: z
    .string()
    .trim()
    .max(120, { error: "Headline maksimal 120 karakter." })
    .optional()
    .nullable()
    .or(z.literal("")),
  profession: z
    .string()
    .trim()
    .max(80, { error: "Profesi maksimal 80 karakter." })
    .optional()
    .nullable()
    .or(z.literal("")),
  bio: z
    .string()
    .trim()
    .optional()
    .nullable()
    .or(z.literal("")),
  profileImage: z
    .string()
    .trim()
    .max(500, { error: "Path foto maksimal 500 karakter." })
    .optional()
    .nullable()
    .or(z.literal("")),
  cvFile: z
    .string()
    .trim()
    .max(500, { error: "Path CV maksimal 500 karakter." })
    .optional()
    .nullable()
    .or(z.literal("")),
  contactEmail: z
    .union([z.string().email({ error: "Format email tidak valid." }), z.literal("")])
    .optional()
    .nullable(),
  location: z
    .string()
    .trim()
    .max(80, { error: "Lokasi maksimal 80 karakter." })
    .optional()
    .nullable()
    .or(z.literal("")),
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  instagramUrl: optionalUrl,
  twitterUrl: optionalUrl,
  websiteUrl: optionalUrl,
});

export type ProfileInput = z.infer<typeof profileSchema>;
