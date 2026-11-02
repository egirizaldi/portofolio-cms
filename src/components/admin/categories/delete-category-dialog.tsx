"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { deleteCategoryAction } from "@/actions/categories";
import type { CategoryActionState } from "@/actions/categories";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const initialState: CategoryActionState = { status: "idle" };

type DeleteCategoryDialogProps = {
  category: { id: string; name: string; projectCount: number } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteCategoryDialog({
  category,
  open,
  onOpenChange,
}: DeleteCategoryDialogProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    deleteCategoryAction,
    initialState,
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message ?? "Kategori dihapus.");
      onOpenChange(false);
      router.refresh();
    } else if (state.status === "error") {
      toast.error(state.message ?? "Gagal menghapus kategori.");
    }
  }, [state, onOpenChange, router]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus kategori ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Kategori <strong>{category?.name}</strong> akan dihapus permanen.
            {category && category.projectCount > 0 ? (
              <>
                {" "}
                Kategori ini dipakai oleh {category.projectCount} proyek — relasinya
                dilepas, tetapi proyeknya tetap ada.
              </>
            ) : null}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form action={formAction} id="delete-category-form">
          <input type="hidden" name="id" value={category?.id ?? ""} />
        </form>

        <AlertDialogFooter>
          <AlertDialogCancel render={<Button type="button" variant="outline" />}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            render={
              <Button
                type="submit"
                form="delete-category-form"
                variant="destructive"
                disabled={isPending}
              />
            }
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
