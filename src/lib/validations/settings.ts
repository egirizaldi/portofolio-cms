import { z } from "zod";

export const SETTING_KEYS = [
  "site_title",
  "site_description",
  "contact_email",
  "footer_text",
  "show_cv_download",
] as const;

export const settingKeySchema = z.enum(SETTING_KEYS);

export const singleSettingSchema = z.object({
  key: settingKeySchema,
  value: z.string({ error: "Value wajib diisi." }),
});

export const bulkSettingsSchema = z.array(singleSettingSchema);

export type SingleSettingInput = z.infer<typeof singleSettingSchema>;
export type BulkSettingsInput = z.infer<typeof bulkSettingsSchema>;

/** Skema khusus form pengaturan di dashboard admin. */
export const settingsFormSchema = z.object({
  site_title: z
    .string({ error: "Judul website wajib diisi." })
    .trim()
    .min(1, { error: "Judul website wajib diisi." })
    .max(120, { error: "Judul website maksimal 120 karakter." }),
  site_description: z
    .string()
    .trim()
    .max(300, { error: "Deskripsi SEO maksimal 300 karakter." }),
  contact_email: z.union([
    z.email({ error: "Format email tidak valid." }),
    z.literal(""),
  ]),
  footer_text: z
    .string()
    .trim()
    .max(300, { error: "Teks footer maksimal 300 karakter." }),
  show_cv_download: z.boolean(),
});

export type SettingsFormInput = z.infer<typeof settingsFormSchema>;
