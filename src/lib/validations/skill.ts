import { z } from "zod";

export const skillSchema = z.object({
  name: z
    .string({ error: "Nama skill wajib diisi." })
    .trim()
    .min(1, { error: "Nama skill wajib diisi." })
    .max(60, { error: "Nama maksimal 60 karakter." }),
  groupName: z
    .string()
    .trim()
    .max(60, { error: "Group name maksimal 60 karakter." })
    .optional()
    .nullable()
    .or(z.literal("")),
  level: z
    .number()
    .int({ error: "Level harus bilangan bulat." })
    .min(1, { error: "Level minimal 1." })
    .max(10, { error: "Level maksimal 10." })
    .optional()
    .nullable(),
  icon: z
    .string()
    .trim()
    .max(100, { error: "Icon maksimal 100 karakter." })
    .optional()
    .nullable()
    .or(z.literal("")),
  isActive: z.boolean().default(true),
  displayOrder: z
    .number()
    .int({ error: "Display order harus bilangan bulat." })
    .default(0),
});

export type SkillInput = z.infer<typeof skillSchema>;
