import type { Metadata } from "next";

import { SettingsForm } from "@/components/admin/settings/settings-form";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Pengaturan" };

export default async function SettingsPage() {
  const settings = await prisma.setting.findMany();
  const map = new Map(settings.map((setting) => [setting.key, setting.value]));

  return (
    <SettingsForm
      settings={{
        site_title: map.get("site_title") ?? "Personal Portfolio",
        site_description: map.get("site_description") ?? "",
        contact_email: map.get("contact_email") ?? "",
        footer_text: map.get("footer_text") ?? "",
        show_cv_download: map.get("show_cv_download") === "true",
      }}
    />
  );
}
