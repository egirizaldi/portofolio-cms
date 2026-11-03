"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  settingsFormSchema,
  type SettingsFormInput,
} from "@/lib/validations/settings";

type SettingsFormProps = {
  settings: SettingsFormInput;
};

export function SettingsForm({ settings }: SettingsFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormInput, unknown, SettingsFormInput>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: settings,
  });

  const showCvDownload = watch("show_cv_download");

  async function onSubmit(values: SettingsFormInput) {
    const payload = Object.entries(values).map(([key, value]) => ({
      key,
      value: typeof value === "boolean" ? String(value) : value,
    }));

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
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pengaturan</h1>
          <p className="text-sm text-muted-foreground">
            Konfigurasi umum website portofolio.
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

      <Card>
        <CardHeader>
          <CardTitle>SEO &amp; Identitas</CardTitle>
          <CardDescription>
            Dipakai sebagai judul dan deskripsi situs di mesin pencari.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="site_title">Judul Website</Label>
            <Input
              id="site_title"
              {...register("site_title")}
              placeholder="Personal Portfolio"
              aria-invalid={Boolean(errors.site_title)}
            />
            {errors.site_title ? (
              <p className="text-xs text-destructive">
                {errors.site_title.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="site_description">Deskripsi SEO</Label>
            <Textarea
              id="site_description"
              rows={3}
              {...register("site_description")}
              placeholder="Portofolio pribadi dan proyek pilihan."
              aria-invalid={Boolean(errors.site_description)}
            />
            {errors.site_description ? (
              <p className="text-xs text-destructive">
                {errors.site_description.message}
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kontak &amp; Footer</CardTitle>
          <CardDescription>
            Informasi yang tampil pada bagian bawah website.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="contact_email">Email Kontak</Label>
            <Input
              id="contact_email"
              type="email"
              {...register("contact_email")}
              placeholder="nama@email.com"
              aria-invalid={Boolean(errors.contact_email)}
            />
            {errors.contact_email ? (
              <p className="text-xs text-destructive">
                {errors.contact_email.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="footer_text">Teks Footer</Label>
            <Input
              id="footer_text"
              {...register("footer_text")}
              placeholder="© 2026 Personal Portfolio."
              aria-invalid={Boolean(errors.footer_text)}
            />
            {errors.footer_text ? (
              <p className="text-xs text-destructive">
                {errors.footer_text.message}
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div>
              <Label htmlFor="show_cv_download">Tombol unduh CV</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                Tampilkan tombol unduh CV pada halaman publik.
              </p>
            </div>
            <Switch
              id="show_cv_download"
              checked={showCvDownload}
              onCheckedChange={(checked) =>
                setValue("show_cv_download", checked, {
                  shouldDirty: true,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

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
