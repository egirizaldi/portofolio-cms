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
import {
  getApiErrorMessage,
  getNetworkErrorMessage,
  readJson,
} from "@/lib/api";
import { skillSchema } from "@/lib/validations/skill";
import type { SkillRow } from "@/components/admin/skills/skills-manager";

type SkillFormValues = z.input<typeof skillSchema>;

type SkillFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill?: SkillRow | null;
  groups: string[];
};

export function SkillFormDialog({
  open,
  onOpenChange,
  skill,
  groups,
}: SkillFormDialogProps) {
  const router = useRouter();
  const isEdit = Boolean(skill);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormValues, unknown, z.output<typeof skillSchema>>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: skill?.name ?? "",
      groupName: skill?.groupName ?? "",
      level: skill?.level ?? null,
      icon: skill?.icon ?? "",
      isActive: skill?.isActive ?? true,
      displayOrder: skill?.displayOrder ?? 0,
    },
  });

  const level = watch("level");

  async function onSubmit(values: z.output<typeof skillSchema>) {
    const payload = {
      ...values,
      groupName: values.groupName ?? "",
      icon: values.icon ?? "",
      level: values.level ?? null,
    };

    try {
      const response = await fetch(
        isEdit ? `/api/skills/${skill?.id}` : "/api/skills",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await readJson(response);

      if (!response.ok) {
        toast.error("Gagal menyimpan skill", {
          description: getApiErrorMessage(data),
        });
        return;
      }

      toast.success(isEdit ? "Skill diperbarui." : "Skill ditambahkan.");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error("Gagal menyimpan skill", {
        description: getNetworkErrorMessage(error),
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Skill" : "Tambah Skill"}</DialogTitle>
          <DialogDescription>
            Skill aktif akan tampil di halaman publik, dikelompokkan berdasarkan
            grup.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="skill-name">Nama</Label>
            <Input
              id="skill-name"
              {...register("name")}
              placeholder="TypeScript"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill-group">Grup</Label>
            <Input
              id="skill-group"
              list="skill-group-options"
              {...register("groupName")}
              placeholder="Frontend"
              aria-invalid={Boolean(errors.groupName)}
            />
            <datalist id="skill-group-options">
              {groups.map((group) => (
                <option key={group} value={group} />
              ))}
            </datalist>
            <p className="text-xs text-muted-foreground">
              Kosongkan untuk memakai grup “Lainnya”.
            </p>
            {errors.groupName ? (
              <p className="text-xs text-destructive">
                {errors.groupName.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="skill-level">Level (1–10)</Label>
              <Input
                id="skill-level"
                type="number"
                min={1}
                max={10}
                value={level ?? ""}
                onChange={(event) =>
                  setValue(
                    "level",
                    event.target.value === "" ? null : Number(event.target.value),
                    { shouldValidate: true },
                  )
                }
                placeholder="8"
                aria-invalid={Boolean(errors.level)}
              />
              {errors.level ? (
                <p className="text-xs text-destructive">
                  {errors.level.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill-order">Urutan tampilan</Label>
              <Input
                id="skill-order"
                type="number"
                min={0}
                {...register("displayOrder", {
                  setValueAs: (value) =>
                    value === "" ? 0 : Number(value),
                })}
                placeholder="0"
                aria-invalid={Boolean(errors.displayOrder)}
              />
              {errors.displayOrder ? (
                <p className="text-xs text-destructive">
                  {errors.displayOrder.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill-icon">Ikon (opsional)</Label>
            <Input
              id="skill-icon"
              {...register("icon")}
              placeholder="⚡ atau nama ikon"
              aria-invalid={Boolean(errors.icon)}
            />
            {errors.icon ? (
              <p className="text-xs text-destructive">{errors.icon.message}</p>
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
