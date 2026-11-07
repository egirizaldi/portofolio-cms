import type { Metadata } from "next";

import { SettingsForm } from "@/components/admin/settings/settings-form";
import { prisma } from "@/lib/db";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = { title: "Pengaturan" };

export default async function SettingsPage() {
  const [content, cvSetting] = await Promise.all([
    getSiteContent(),
    prisma.setting.findUnique({ where: { key: "show_cv_download" } }),
  ]);

  return (
    <SettingsForm
      settings={{
        ...content,
        show_cv_download: cvSetting?.value !== "false",
      }}
    />
  );
}
