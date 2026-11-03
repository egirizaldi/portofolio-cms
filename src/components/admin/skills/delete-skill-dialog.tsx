"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import type { SkillRow } from "@/components/admin/skills/skills-manager";
import {
  getApiErrorMessage,
  getNetworkErrorMessage,
  readJson,
} from "@/lib/api";

type DeleteSkillDialogProps = {
  skill: SkillRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteSkillDialog({
  skill,
  open,
  onOpenChange,
}: DeleteSkillDialogProps) {
  const router = useRouter();

  async function handleDelete() {
    if (!skill) return false;

    try {
      const response = await fetch(`/api/skills/${skill.id}`, {
        method: "DELETE",
      });
      const payload = await readJson(response);

      if (!response.ok) {
        toast.error("Gagal menghapus skill", {
          description: getApiErrorMessage(payload),
        });
        return false;
      }

      toast.success("Skill dihapus.");
      router.refresh();
      return true;
    } catch (error) {
      toast.error("Gagal menghapus skill", {
        description: getNetworkErrorMessage(error),
      });
      return false;
    }
  }

  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Hapus skill ini?"
      description={
        <>
          Skill <strong>{skill?.name}</strong> akan dihapus permanen dari daftar
          keahlian.
        </>
      }
      onConfirm={handleDelete}
    />
  );
}
