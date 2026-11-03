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
import type { EducationRow } from "@/components/admin/educations/educations-manager";
import {
  getApiErrorMessage,
  getNetworkErrorMessage,
  readJson,
} from "@/lib/api";
import { educationSchema } from "@/lib/validations/education";

type EducationFormValues = z.input<typeof educationSchema>;

type EducationFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  education?: EducationRow | null;
};

function toDateInput(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function EducationFormDialog({
  open,
  onOpenChange,
  education,
}: EducationFormDialogProps) {
  const router = useRouter();
  const isEdit = Boolean(education);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<
    EducationFormValues,
    unknown,
    z.output<typeof educationSchema>
  >({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: education?.institution ?? "",
      program: education?.program ?? "",
      level: education?.level ?? "",
      description: education?.description ?? "",
      startDate: toDateInput(education?.startDate),
      endDate: toDateInput(education?.endDate),
      isCurrent: education?.isCurrent ?? false,
      displayOrder: education?.displayOrder ?? 0,
    },
  });

  const isCurrent = watch("isCurrent");

  async function onSubmit(values: z.output<typeof educationSchema>) {
    const payload = {
      ...values,
      level: values.level ?? "",
      description: values.description ?? "",
      endDate: values.isCurrent ? "" : values.endDate ?? "",
    };

    try {
      const response = await fetch(
        isEdit ? `/api/educations/${education?.id}` : "/api/educations",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await readJson(response);

      if (!response.ok) {
        toast.error("Gagal menyimpan pendidikan", {
          description: getApiErrorMessage(data),
        });
        return;
      }

      toast.success(
        isEdit ? "Pendidikan diperbarui." : "Pendidikan ditambahkan.",
      );
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error("Gagal menyimpan pendidikan", {
        description: getNetworkErrorMessage(error),
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Pendidikan" : "Tambah Pendidikan"}
          </DialogTitle>
          <DialogDescription>
            Riwayat ini tampil pada halaman pendidikan publik.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="education-institution">Institusi</Label>
            <Input
              id="education-institution"
              {...register("institution")}
              placeholder="Universitas Contoh"
              aria-invalid={Boolean(errors.institution)}
            />
            {errors.institution ? (
              <p className="text-xs text-destructive">
                {errors.institution.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="education-program">Program Studi</Label>
            <Input
              id="education-program"
              {...register("program")}
              placeholder="Teknik Informatika"
              aria-invalid={Boolean(errors.program)}
            />
            {errors.program ? (
              <p className="text-xs text-destructive">
                {errors.program.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="education-level">Jenjang (opsional)</Label>
            <Input
              id="education-level"
              {...register("level")}
              placeholder="S1 / S2 / D3 / SMA"
              aria-invalid={Boolean(errors.level)}
            />
            {errors.level ? (
              <p className="text-xs text-destructive">
                {errors.level.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="education-description">
              Deskripsi (opsional)
            </Label>
            <Textarea
              id="education-description"
              rows={3}
              {...register("description")}
              placeholder="Fokus studi, prestasi, atau kegiatan..."
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
              <Label htmlFor="education-start">Tanggal Mulai</Label>
              <Input
                id="education-start"
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
              <Label htmlFor="education-end">Tanggal Selesai</Label>
              <Input
                id="education-end"
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
              <Label htmlFor="education-current">Masih berlangsung</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                Tanggal selesai akan dikosongkan otomatis.
              </p>
            </div>
            <Switch
              id="education-current"
              checked={isCurrent}
              onCheckedChange={(checked) => {
                setValue("isCurrent", checked, { shouldValidate: true });
                if (checked) setValue("endDate", "");
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education-order">Urutan tampilan</Label>
            <Input
              id="education-order"
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
