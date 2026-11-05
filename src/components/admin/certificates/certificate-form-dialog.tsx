"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/components/admin/upload-button";
import type { CertificateRow } from "@/components/admin/certificates/certificates-manager";
import {
  getApiErrorMessage,
  getNetworkErrorMessage,
  readJson,
} from "@/lib/api";
import { resolveImageSrc } from "@/lib/media";
import { certificateSchema } from "@/lib/validations/certificate";

type CertificateFormValues = z.input<typeof certificateSchema>;

type CertificateFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate?: CertificateRow | null;
};

function toDateInput(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function CertificateFormDialog({
  open,
  onOpenChange,
  certificate,
}: CertificateFormDialogProps) {
  const router = useRouter();
  const isEdit = Boolean(certificate);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<
    CertificateFormValues,
    unknown,
    z.output<typeof certificateSchema>
  >({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      name: certificate?.name ?? "",
      issuer: certificate?.issuer ?? "",
      issuedAt: toDateInput(certificate?.issuedAt),
      credentialUrl: certificate?.credentialUrl ?? "",
      imagePath: certificate?.imagePath ?? "",
      displayOrder: certificate?.displayOrder ?? 0,
    },
  });

  const imagePreview = resolveImageSrc(watch("imagePath"));

  async function onSubmit(values: z.output<typeof certificateSchema>) {
    const payload = {
      ...values,
      issuedAt: values.issuedAt ?? "",
      credentialUrl: values.credentialUrl ?? "",
      imagePath: values.imagePath ?? "",
    };

    try {
      const response = await fetch(
        isEdit
          ? `/api/certificates/${certificate?.id}`
          : "/api/certificates",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await readJson(response);

      if (!response.ok) {
        toast.error("Gagal menyimpan sertifikat", {
          description: getApiErrorMessage(data),
        });
        return;
      }

      toast.success(
        isEdit ? "Sertifikat diperbarui." : "Sertifikat ditambahkan.",
      );
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error("Gagal menyimpan sertifikat", {
        description: getNetworkErrorMessage(error),
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Sertifikat" : "Tambah Sertifikat"}
          </DialogTitle>
          <DialogDescription>
            Sertifikat akan tampil pada halaman sertifikat publik.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="certificate-name">Nama</Label>
            <Input
              id="certificate-name"
              {...register("name")}
              placeholder="Belajar Dasar Pemrograman Web"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificate-issuer">Penerbit</Label>
            <Input
              id="certificate-issuer"
              {...register("issuer")}
              placeholder="Dicoding Indonesia"
              aria-invalid={Boolean(errors.issuer)}
            />
            {errors.issuer ? (
              <p className="text-xs text-destructive">
                {errors.issuer.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificate-issued">Tanggal Terbit (opsional)</Label>
            <Input
              id="certificate-issued"
              type="date"
              {...register("issuedAt")}
              aria-invalid={Boolean(errors.issuedAt)}
            />
            {errors.issuedAt ? (
              <p className="text-xs text-destructive">
                {errors.issuedAt.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificate-credential">
              URL Verifikasi (opsional)
            </Label>
            <Input
              id="certificate-credential"
              type="url"
              {...register("credentialUrl")}
              placeholder="https://..."
              aria-invalid={Boolean(errors.credentialUrl)}
            />
            {errors.credentialUrl ? (
              <p className="text-xs text-destructive">
                {errors.credentialUrl.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificate-image">
              Path Gambar (opsional)
            </Label>
            <div className="flex gap-2">
              <Input
                id="certificate-image"
                {...register("imagePath")}
                placeholder="/uploads/certificate.jpg"
                aria-invalid={Boolean(errors.imagePath)}
              />
              <UploadButton
                type="certificate"
                onUploaded={(url) =>
                  setValue("imagePath", url, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Unggah gambar atau isi path/URL secara manual.
            </p>
            {errors.imagePath ? (
              <p className="text-xs text-destructive">
                {errors.imagePath.message}
              </p>
            ) : null}

            {imagePreview ? (
              <div className="mt-2 flex h-24 w-full items-center justify-center overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={imagePreview}
                  alt="Preview sertifikat"
                  width={320}
                  height={96}
                  unoptimized
                  className="h-full w-auto object-contain"
                />
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificate-order">Urutan tampilan</Label>
            <Input
              id="certificate-order"
              type="number"
              min={0}
              {...register("displayOrder", {
                setValueAs: (value) => (value === "" ? 0 : Number(value)),
              })}
              aria-invalid={Boolean(errors.displayOrder)}
            />
            {errors.displayOrder ? (
              <p className="text-xs text-destructive">
                {errors.displayOrder.message}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Batal
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
