"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  getApiErrorMessage,
  getNetworkErrorMessage,
  readJson,
} from "@/lib/api";
import {
  CONTENT_KEYS,
  CONTENT_SECTIONS,
  type SiteContent,
} from "@/lib/content";

export type SettingsFormValues = SiteContent & {
  show_cv_download: boolean;
};

type SettingsFormProps = {
  settings: SettingsFormValues;
};

export function SettingsForm({ settings }: SettingsFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const key of CONTENT_KEYS) initial[key] = settings[key] ?? "";
    return initial;
  });
  const [showCvDownload, setShowCvDownload] = useState(
    settings.show_cv_download,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(key: string, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!values.site_title?.trim()) {
      toast.error("Judul website wajib diisi.");
      return;
    }

    const email = values.contact_email?.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Format email kontak tidak valid.");
      return;
    }

    setIsSubmitting(true);

    const payload = [
      ...CONTENT_KEYS.map((key) => ({ key, value: values[key] ?? "" })),
      { key: "show_cv_download", value: String(showCvDownload) },
    ];

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await readJson(response);

      if (!response.ok) {
        toast.error("Gagal menyimpan pengaturan", {
          description: getApiErrorMessage(data),
        });
        return;
      }

      toast.success("Pengaturan disimpan.");
    } catch (error) {
      toast.error("Gagal menyimpan pengaturan", {
        description: getNetworkErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pengaturan</h1>
          <p className="text-sm text-muted-foreground">
            Semua teks yang tampil di website publik dapat diubah di sini.
          </p>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {isSubmitting ? "Menyimpan..." : "Simpan Pengaturan"}
        </Button>
      </div>

      {CONTENT_SECTIONS.map((section) => (
        <Card key={section.id}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
            {section.description ? (
              <CardDescription>{section.description}</CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            {section.fields.map((field) => {
              const id = `content-${field.key}`;
              const value = values[field.key] ?? "";
              const isWide = field.type === "textarea";

              return (
                <div
                  key={field.key}
                  className={isWide ? "space-y-2 sm:col-span-2" : "space-y-2"}
                >
                  <Label htmlFor={id}>{field.label}</Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={id}
                      rows={3}
                      value={value}
                      maxLength={field.maxLength}
                      onChange={(event) => update(field.key, event.target.value)}
                    />
                  ) : (
                    <Input
                      id={id}
                      type={field.type === "email" ? "email" : "text"}
                      value={value}
                      maxLength={field.maxLength}
                      onChange={(event) => update(field.key, event.target.value)}
                    />
                  )}
                  {field.hint ? (
                    <p className="text-xs text-muted-foreground">{field.hint}</p>
                  ) : null}
                </div>
              );
            })}

            {section.id === "identitas" ? (
              <div className="flex items-center justify-between gap-4 rounded-lg border p-4 sm:col-span-2">
                <div>
                  <Label htmlFor="show_cv_download">Tombol unduh CV</Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Tampilkan tombol unduh CV pada halaman publik.
                  </p>
                </div>
                <Switch
                  id="show_cv_download"
                  checked={showCvDownload}
                  onCheckedChange={setShowCvDownload}
                />
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {isSubmitting ? "Menyimpan..." : "Simpan Pengaturan"}
        </Button>
      </div>
    </form>
  );
}
