"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import {
  getApiErrorMessage,
  getNetworkErrorMessage,
  readJson,
} from "@/lib/api";
import { resolveImageSrc } from "@/lib/media";
import { profileSchema } from "@/lib/validations/profile";

type ProfileFormValues = z.input<typeof profileSchema>;
type ProfileFormOutput = z.output<typeof profileSchema>;

type ProfileInitial = {
  fullName: string;
  headline: string;
  profession: string;
  bio: string;
  profileImage: string;
  cvFile: string;
  contactEmail: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  websiteUrl: string;
};

type ProfileFormProps = {
  profile: ProfileInitial;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues, unknown, ProfileFormOutput>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });

  const profileImage = watch("profileImage");
  const cvFile = watch("cvFile");
  const imagePreview = resolveImageSrc(profileImage);

  async function onSubmit(values: ProfileFormOutput) {
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await readJson(response);

      if (!response.ok) {
        toast.error("Gagal menyimpan profil", {
          description: getApiErrorMessage(payload),
        });
        return;
      }

      toast.success("Profil disimpan.");
    } catch (error) {
      toast.error("Gagal menyimpan profil", {
        description: getNetworkErrorMessage(error),
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profil</h1>
          <p className="text-sm text-muted-foreground">
            Informasi ini tampil di halaman beranda, tentang, dan kontak.
          </p>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {isSubmitting ? "Menyimpan..." : "Simpan Profil"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Utama</CardTitle>
          <CardDescription>
            Nama, headline, dan deskripsi singkat tentang Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input
              id="fullName"
              {...register("fullName")}
              placeholder="Nama Lengkap"
              aria-invalid={Boolean(errors.fullName)}
            />
            {errors.fullName ? (
              <p className="text-xs text-destructive">
                {errors.fullName.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">Profesi</Label>
            <Input
              id="profession"
              {...register("profession")}
              placeholder="Web Developer"
              aria-invalid={Boolean(errors.profession)}
            />
            {errors.profession ? (
              <p className="text-xs text-destructive">
                {errors.profession.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="headline">Headline</Label>
            <Input
              id="headline"
              {...register("headline")}
              placeholder="Full-Stack Developer yang fokus pada produk yang rapi."
              aria-invalid={Boolean(errors.headline)}
            />
            {errors.headline ? (
              <p className="text-xs text-destructive">
                {errors.headline.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={6}
              {...register("bio")}
              placeholder="Ceritakan latar belakang, fokus, dan cara Anda bekerja..."
              aria-invalid={Boolean(errors.bio)}
            />
            {errors.bio ? (
              <p className="text-xs text-destructive">{errors.bio.message}</p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Foto &amp; CV</CardTitle>
          <CardDescription>
            Upload berkas akan tersedia menyusul. Untuk sekarang isi path atau URL
            berkas.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profileImage">Foto Profil</Label>
            <Input
              id="profileImage"
              {...register("profileImage")}
              placeholder="/uploads/profile.jpg"
              aria-invalid={Boolean(errors.profileImage)}
            />
            {errors.profileImage ? (
              <p className="text-xs text-destructive">
                {errors.profileImage.message}
              </p>
            ) : null}

            <div className="mt-2 flex size-24 items-center justify-center overflow-hidden rounded-xl border bg-muted">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview foto profil"
                  width={96}
                  height={96}
                  unoptimized
                  className="size-full object-cover"
                />
              ) : (
                <span className="text-xs text-muted-foreground">Belum ada</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cvFile">Berkas CV</Label>
            <Input
              id="cvFile"
              {...register("cvFile")}
              placeholder="/uploads/cv.pdf"
              aria-invalid={Boolean(errors.cvFile)}
            />
            {errors.cvFile ? (
              <p className="text-xs text-destructive">
                {errors.cvFile.message}
              </p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              {(cvFile ?? "").trim()
                ? `File: ${(cvFile ?? "").trim().split("/").pop()}`
                : "Belum ada CV yang diunggah."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kontak &amp; Media Sosial</CardTitle>
          <CardDescription>
            Tautan ini ditampilkan pada halaman kontak dan profil publik.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email Kontak</Label>
            <Input
              id="contactEmail"
              type="email"
              {...register("contactEmail")}
              placeholder="nama@email.com"
              aria-invalid={Boolean(errors.contactEmail)}
            />
            {errors.contactEmail ? (
              <p className="text-xs text-destructive">
                {errors.contactEmail.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="Bandung, Indonesia"
              aria-invalid={Boolean(errors.location)}
            />
            {errors.location ? (
              <p className="text-xs text-destructive">
                {errors.location.message}
              </p>
            ) : null}
          </div>

          {(
            [
              ["githubUrl", "GitHub URL", "https://github.com/username"],
              ["linkedinUrl", "LinkedIn URL", "https://linkedin.com/in/username"],
              ["instagramUrl", "Instagram URL", "https://instagram.com/username"],
              ["twitterUrl", "Twitter / X URL", "https://x.com/username"],
              ["websiteUrl", "Website URL", "https://example.com"],
            ] as const
          ).map(([name, label, placeholder]) => (
            <div key={name} className="space-y-2">
              <Label htmlFor={name}>{label}</Label>
              <Input
                id={name}
                type="url"
                {...register(name)}
                placeholder={placeholder}
                aria-invalid={Boolean(errors[name])}
              />
              {errors[name] ? (
                <p className="text-xs text-destructive">
                  {errors[name]?.message}
                </p>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {isSubmitting ? "Menyimpan..." : "Simpan Profil"}
        </Button>
      </div>
    </form>
  );
}
