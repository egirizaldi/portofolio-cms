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
