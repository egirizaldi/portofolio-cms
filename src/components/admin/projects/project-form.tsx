"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Check,
  ImageIcon,
  Loader2,
  Plus,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  getApiErrorMessage,
  getNetworkErrorMessage,
  readJson,
} from "@/lib/api";
import { resolveImageSrc } from "@/lib/media";
import { cn } from "@/lib/utils";
import { slugify } from "@/lib/validations/category";
import { projectSchema } from "@/lib/validations/project";

type CategoryOption = { id: string; name: string };

export type ProjectFormInitial = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  technologies: string[];
  demoUrl: string | null;
  githubUrl: string | null;
  projectDate: string;
  isFeatured: boolean;
  status: "DRAFT" | "PUBLISHED";
  categoryIds: string[];
};

type ProjectFormValues = z.input<typeof projectSchema>;

type ProjectFormProps = {
  categories: CategoryOption[];
  project?: ProjectFormInitial | null;
};

const statusOptions = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
];

export function ProjectForm({ categories, project }: ProjectFormProps) {
  const router = useRouter();
  const isEdit = Boolean(project);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [technologyInput, setTechnologyInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues, unknown, z.output<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title ?? "",
      slug: project?.slug ?? "",
      shortDescription: project?.shortDescription ?? "",
      description: project?.description ?? "",
      thumbnail: project?.thumbnail ?? "",
      technologies: project?.technologies ?? [],
      demoUrl: project?.demoUrl ?? "",
      githubUrl: project?.githubUrl ?? "",
      projectDate: project?.projectDate ?? "",
      isFeatured: project?.isFeatured ?? false,
      status: project?.status ?? "DRAFT",
      categoryIds: project?.categoryIds ?? [],
    },
  });

  const title = watch("title") ?? "";
  const slug = watch("slug") ?? "";
  const shortDescription = watch("shortDescription") ?? "";
  const thumbnail = watch("thumbnail") ?? "";
  const technologies = watch("technologies") ?? [];
  const categoryIds = watch("categoryIds") ?? [];

  const thumbnailPreview = resolveImageSrc(thumbnail);

  useEffect(() => {
    if (!slugTouched) {
      setValue("slug", slugify(title), { shouldDirty: true });
    }
  }, [title, slugTouched, setValue]);

  function addTechnology(rawValue: string) {
    const value = rawValue.trim().replace(/,$/, "").trim();
    if (!value) return;

    if (technologies.length >= 20) {
      toast.error("Maksimal 20 teknologi per proyek.");
      return;
    }

    if (
      technologies.some(
        (technology) => technology.toLowerCase() === value.toLowerCase(),
      )
    ) {
      setTechnologyInput("");
      return;
    }

    setValue("technologies", [...technologies, value], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setTechnologyInput("");
  }

  function removeTechnology(value: string) {
    setValue(
      "technologies",
      technologies.filter((technology) => technology !== value),
      { shouldDirty: true, shouldValidate: true },
    );
  }

  function toggleCategory(id: string) {
    const next = categoryIds.includes(id)
      ? categoryIds.filter((categoryId) => categoryId !== id)
      : [...categoryIds, id];

    setValue("categoryIds", next, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  async function onSubmit(values: z.output<typeof projectSchema>) {
    const payload = {
      ...values,
      demoUrl: values.demoUrl ?? "",
      githubUrl: values.githubUrl ?? "",
      projectDate: values.projectDate ?? "",
      technologies: values.technologies ?? [],
      categoryIds: values.categoryIds ?? [],
    };

    try {
      const response = await fetch(
        isEdit ? `/api/projects/${project?.id}` : "/api/projects",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await readJson(response);

      if (!response.ok) {
        toast.error("Gagal menyimpan proyek", {
          description: getApiErrorMessage(data),
        });
        return;
      }

      toast.success(isEdit ? "Proyek diperbarui." : "Proyek ditambahkan.");
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      toast.error("Gagal menyimpan proyek", {
        description: getNetworkErrorMessage(error),
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 mb-1"
            render={<Link href="/admin/projects" />}
          >
            <ArrowLeft className="size-4" />
            Kembali
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isEdit ? "Edit Proyek" : "Tambah Proyek"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Lengkapi informasi proyek yang akan tampil di website publik.
          </p>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {isSubmitting ? "Menyimpan..." : "Simpan Proyek"}
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
              <CardDescription>
                Judul, slug, dan deskripsi proyek.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="project-title">Judul</Label>
                <Input
                  id="project-title"
                  {...register("title")}
                  placeholder="Aplikasi Manajemen Tugas"
                  aria-invalid={Boolean(errors.title)}
                />
                {errors.title ? (
                  <p className="text-xs text-destructive">
                    {errors.title.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-slug">Slug</Label>
                <Controller
                  control={control}
                  name="slug"
                  render={({ field }) => (
                    <Input
                      id="project-slug"
                      value={field.value ?? ""}
                      onBlur={field.onBlur}
                      onChange={(event) => {
                        setSlugTouched(true);
                        field.onChange(
                          event.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, "-"),
                        );
                      }}
                      placeholder="aplikasi-manajemen-tugas"
                      aria-invalid={Boolean(errors.slug)}
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  URL publik:{" "}
                  <span className="font-mono text-foreground">
                    /projects/{slug || "slug-proyek"}
                  </span>
                </p>
                {errors.slug ? (
                  <p className="text-xs text-destructive">
                    {errors.slug.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="project-short">Deskripsi Singkat</Label>
                  <span
                    className={cn(
                      "text-xs tabular-nums",
                      shortDescription.length > 200
                        ? "text-destructive"
                        : "text-muted-foreground",
                    )}
                  >
                    {shortDescription.length}/200
                  </span>
                </div>
                <Textarea
                  id="project-short"
                  rows={3}
                  maxLength={200}
                  {...register("shortDescription")}
                  placeholder="Ringkasan singkat proyek untuk kartu portofolio..."
                  aria-invalid={Boolean(errors.shortDescription)}
                />
                {errors.shortDescription ? (
                  <p className="text-xs text-destructive">
                    {errors.shortDescription.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-description">Deskripsi Lengkap</Label>
                <Textarea
                  id="project-description"
                  rows={10}
                  {...register("description")}
                  placeholder="Ceritakan latar belakang, tantangan, solusi, dan hasil proyek..."
                  aria-invalid={Boolean(errors.description)}
                />
                {errors.description ? (
                  <p className="text-xs text-destructive">
                    {errors.description.message}
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media &amp; Teknologi</CardTitle>
              <CardDescription>
                Thumbnail proyek dan teknologi yang digunakan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="project-thumbnail">Thumbnail (URL/path)</Label>
                <Input
                  id="project-thumbnail"
                  {...register("thumbnail")}
                  placeholder="/uploads/project.jpg"
                  aria-invalid={Boolean(errors.thumbnail)}
                />
                <p className="text-xs text-muted-foreground">
                  Integrasi upload menyusul. Isi path atau URL gambar.
                </p>
                {errors.thumbnail ? (
                  <p className="text-xs text-destructive">
                    {errors.thumbnail.message}
                  </p>
                ) : null}

                <div className="mt-2 overflow-hidden rounded-xl border bg-muted">
                  {thumbnailPreview ? (
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={thumbnailPreview}
                        alt="Preview thumbnail"
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 640px, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/9] items-center justify-center gap-2 text-xs text-muted-foreground">
                      <ImageIcon className="size-4" />
                      Preview thumbnail
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-technologies">Teknologi</Label>
                <div className="flex gap-2">
                  <Input
                    id="project-technologies"
                    value={technologyInput}
                    onChange={(event) =>
                      setTechnologyInput(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === ",") {
                        event.preventDefault();
                        addTechnology(technologyInput);
                      }
                    }}
                    placeholder="Ketik teknologi lalu Enter"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addTechnology(technologyInput)}
                  >
                    <Plus className="size-4" />
                    Tambah
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tekan Enter atau koma untuk menambahkan. Maksimal 20 teknologi.
                </p>

                {technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {technologies.map((technology) => (
                      <Badge key={technology} variant="secondary">
                        {technology}
                        <button
                          type="button"
                          onClick={() => removeTechnology(technology)}
                          aria-label={`Hapus ${technology}`}
                          className="ml-0.5 rounded-full opacity-70 transition-opacity hover:opacity-100"
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : null}

                {errors.technologies ? (
                  <p className="text-xs text-destructive">
                    {errors.technologies.message}
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tautan &amp; Tanggal</CardTitle>
              <CardDescription>
                Tautan demo, repositori, dan tanggal proyek (opsional).
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="project-demo">Demo URL</Label>
                <Input
                  id="project-demo"
                  type="url"
                  {...register("demoUrl")}
                  placeholder="https://demo.example.com"
                  aria-invalid={Boolean(errors.demoUrl)}
                />
                {errors.demoUrl ? (
                  <p className="text-xs text-destructive">
                    {errors.demoUrl.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-github">GitHub URL</Label>
                <Input
                  id="project-github"
                  type="url"
                  {...register("githubUrl")}
                  placeholder="https://github.com/username/repo"
                  aria-invalid={Boolean(errors.githubUrl)}
                />
                {errors.githubUrl ? (
                  <p className="text-xs text-destructive">
                    {errors.githubUrl.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-date">Tanggal Proyek</Label>
                <Input
                  id="project-date"
                  type="date"
                  {...register("projectDate")}
                  aria-invalid={Boolean(errors.projectDate)}
                />
                {errors.projectDate ? (
                  <p className="text-xs text-destructive">
                    {errors.projectDate.message}
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Publikasi</CardTitle>
              <CardDescription>
                Atur status dan sorotan proyek.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="project-status">Status</Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? "DRAFT"}
                      onValueChange={(value) => field.onChange(value)}
                      items={statusOptions}
                    >
                      <SelectTrigger
                        id="project-status"
                        className="w-full"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status ? (
                  <p className="text-xs text-destructive">
                    {errors.status.message}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
                <div>
                  <Label htmlFor="project-featured">Featured</Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Tampilkan di beranda sebagai proyek pilihan.
                  </p>
                </div>
                <Controller
                  control={control}
                  name="isFeatured"
                  render={({ field }) => (
                    <Switch
                      id="project-featured"
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kategori</CardTitle>
              <CardDescription>
                Pilih satu atau lebih kategori untuk proyek ini.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <p className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
                  Belum ada kategori.{" "}
                  <Link
                    href="/admin/categories"
                    className="underline underline-offset-3 hover:text-foreground"
                  >
                    Tambah kategori
                  </Link>
                  .
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((category) => {
                    const active = categoryIds.includes(category.id);
                    return (
                      <Button
                        key={category.id}
                        type="button"
                        size="sm"
                        variant={active ? "default" : "outline"}
                        aria-pressed={active}
                        onClick={() => toggleCategory(category.id)}
                      >
                        {active ? <Check className="size-3.5" /> : null}
                        {category.name}
                      </Button>
                    );
                  })}
                </div>
              )}
              {errors.categoryIds ? (
                <p className="mt-2 text-xs text-destructive">
                  {errors.categoryIds.message}
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {isSubmitting ? "Menyimpan..." : "Simpan Proyek"}
        </Button>
      </div>
    </form>
  );
}
