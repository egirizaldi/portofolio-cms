import { z } from "zod";

import { CONTENT_KEYS } from "@/lib/content";

/** Semua key yang boleh disimpan: konten situs + pengaturan khusus. */
export const SETTING_KEYS: readonly string[] = [
  ...CONTENT_KEYS,
  "show_cv_download",
];

export const settingKeySchema = z
  .string({ error: "Key setting wajib diisi." })
  .refine((key) => SETTING_KEYS.includes(key), {
    error: "Key setting tidak dikenal.",
  });

export const singleSettingSchema = z.object({
  key: settingKeySchema,
  value: z
    .string({ error: "Value wajib diisi." })
    .max(5000, { error: "Value maksimal 5000 karakter." }),
});

export const bulkSettingsSchema = z.array(singleSettingSchema);

export type SingleSettingInput = z.infer<typeof singleSettingSchema>;
export type BulkSettingsInput = z.infer<typeof bulkSettingsSchema>;
