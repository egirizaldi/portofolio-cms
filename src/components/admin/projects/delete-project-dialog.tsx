"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import type { ProjectRow } from "@/components/admin/projects/projects-table";
import {
  getApiErrorMessage,
  getNetworkErrorMessage,
  readJson,
} from "@/lib/api";

type DeleteProjectDialogProps = {
  project: ProjectRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteProjectDialog({
  project,
  open,
  onOpenChange,
}: DeleteProjectDialogProps) {
  const router = useRouter();

  async function handleDelete() {
    if (!project) return false;

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });
      const payload = await readJson(response);

      if (!response.ok) {
        toast.error("Gagal menghapus proyek", {
          description: getApiErrorMessage(payload),
        });
        return false;
      }

      toast.success("Proyek dihapus.");
      router.refresh();
      return true;
    } catch (error) {
      toast.error("Gagal menghapus proyek", {
        description: getNetworkErrorMessage(error),
      });
      return false;
    }
  }

  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Hapus proyek ini?"
      description={
        <>
          Proyek <strong>{project?.title}</strong> beserta gambar galerinya akan
          dihapus permanen. Tindakan ini tidak dapat dibatalkan.
        </>
      }
      onConfirm={handleDelete}
    />
  );
}
