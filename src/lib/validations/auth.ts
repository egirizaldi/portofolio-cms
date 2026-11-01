import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Format email tidak valid." }).trim().toLowerCase(),
  password: z
    .string({ error: "Password wajib diisi." })
    .min(8, { error: "Password minimal 8 karakter." })
    .max(72, { error: "Password maksimal 72 karakter." }),
});

export type LoginInput = z.infer<typeof loginSchema>;
