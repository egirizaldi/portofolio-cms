"use client";

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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { ExperienceRow } from "@/components/admin/experiences/experiences-manager";
import {
  getApiErrorMessage,
  getNetworkErrorMessage,
  readJson,
} from "@/lib/api";
import { experienceSchema } from "@/lib/validations/experience";

type ExperienceFormValues = z.input<typeof experienceSchema>;

type ExperienceFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience?: ExperienceRow | null;
};

function toDateInput(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function ExperienceFormDialog({
  open,
  onOpenChange,
  experience,
}: ExperienceFormDialogProps) {
  const router = useRouter();
  const isEdit = Boolean(experience);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<
    ExperienceFormValues,
    unknown,
    z.output<typeof experienceSchema>
  >({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      position: experience?.position ?? "",
      organization: experience?.organization ?? "",
      location: experience?.location ?? "",
      description: experience?.description ?? "",
      startDate: toDateInput(experience?.startDate),
      endDate: toDateInput(experience?.endDate),
      isCurrent: experience?.isCurrent ?? false,
      displayOrder: experience?.displayOrder ?? 0,
    },
  });

  const isCurrent = watch("isCurrent");

  async function onSubmit(values: z.output<typeof experienceSchema>) {
    const payload = {
      ...values,
      location: values.location ?? "",
      description: values.description ?? "",
      endDate: values.isCurrent ? "" : values.endDate ?? "",
    };

    try {
      const response = await fetch(
        isEdit ? `/api/experiences/${experience?.id}` : "/api/experiences",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await readJson(response);

      if (!response.ok) {
        toast.error("Gagal menyimpan pengalaman", {
          description: getApiErrorMessage(data),
        });
        return;
      }

      toast.success(
        isEdit ? "Pengalaman diperbarui." : "Pengalaman ditambahkan.",
      );
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error("Gagal menyimpan pengalaman", {
        description: getNetworkErrorMessage(error),
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Pengalaman" : "Tambah Pengalaman"}
          </DialogTitle>
          <DialogDescription>
            Riwayat ini tampil pada halaman pengalaman publik.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="experience-position">Posisi</Label>
            <Input
              id="experience-position"
              {...register("position")}
              placeholder="Frontend Developer"
              aria-invalid={Boolean(errors.position)}
            />
            {errors.position ? (
              <p className="text-xs text-destructive">
                {errors.position.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience-organization">Organisasi</Label>
            <Input
              id="experience-organization"
              {...register("organization")}
              placeholder="PT Contoh Indonesia"
              aria-invalid={Boolean(errors.organization)}
            />
            {errors.organization ? (
              <p className="text-xs text-destructive">
                {errors.organization.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience-location">Lokasi (opsional)</Label>
            <Input
              id="experience-location"
              {...register("location")}
              placeholder="Jakarta, Indonesia"
              aria-invalid={Boolean(errors.location)}
            />
            {errors.location ? (
              <p className="text-xs text-destructive">
                {errors.location.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience-description">
              Deskripsi (opsional)
            </Label>
            <Textarea
              id="experience-description"
              rows={4}
              {...register("description")}
              placeholder="Tanggung jawab dan pencapaian..."
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description ? (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="experience-start">Tanggal Mulai</Label>
              <Input
                id="experience-start"
                type="date"
                {...register("startDate")}
                aria-invalid={Boolean(errors.startDate)}
              />
              {errors.startDate ? (
                <p className="text-xs text-destructive">
                  {errors.startDate.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience-end">Tanggal Selesai</Label>
              <Input
                id="experience-end"
                type="date"
                disabled={isCurrent}
                {...register("endDate")}
                aria-invalid={Boolean(errors.endDate)}
              />
              {errors.endDate ? (
                <p className="text-xs text-destructive">
                  {errors.endDate.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div>
              <Label htmlFor="experience-current">Masih berlangsung</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                Tanggal selesai akan dikosongkan otomatis.
              </p>
            </div>
            <Switch
              id="experience-current"
              checked={isCurrent}
              onCheckedChange={(checked) => {
                setValue("isCurrent", checked, { shouldValidate: true });
                if (checked) setValue("endDate", "");
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience-order">Urutan tampilan</Label>
            <Input
              id="experience-order"
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
