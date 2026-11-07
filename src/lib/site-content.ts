import { cache } from "react";

import { prisma } from "@/lib/db";
import {
  CONTENT_DEFAULTS,
  CONTENT_KEYS,
  type SiteContent,
} from "@/lib/content";

/**
 * Ambil seluruh konten situs dari tabel Setting, lalu gabungkan dengan nilai
 * default. Hasil di-cache per request agar beberapa pemanggilan (mis. layout,
 * metadata, dan halaman) hanya menghasilkan satu query.
 */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const content = { ...CONTENT_DEFAULTS } as SiteContent;

  try {
    const settings = await prisma.setting.findMany({
      where: { key: { in: CONTENT_KEYS } },
      select: { key: true, value: true },
    });

    for (const setting of settings) {
      if ((CONTENT_KEYS as string[]).includes(setting.key)) {
        content[setting.key as keyof SiteContent] = setting.value;
      }
    }
  } catch (error) {
    console.error("Gagal membaca konten situs dari database:", error);
  }

  return content;
});

/** Ganti placeholder {nama} pada template konten. */
export function fillTemplate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
