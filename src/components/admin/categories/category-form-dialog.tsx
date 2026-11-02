"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { saveCategoryAction } from "@/actions/categories";
import type { CategoryActionState } from "@/actions/categories";
import { slugify } from "@/lib/validations/category";
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
import { Textarea } from "@/components/ui/textarea";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

const initialState: CategoryActionState = { status: "idle" };

type CategoryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
};

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
}: CategoryFormDialogProps) {
  const router = useRouter();
  const isEdit = Boolean(category);

  const [state, formAction, isPending] = useActionState(
    saveCategoryAction,
    initialState,
  );
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message ?? "Kategori disimpan.");
      onOpenChange(false);
      router.refresh();
    } else if (state.status === "error" && !state.fieldErrors) {
      toast.error(state.message ?? "Gagal menyimpan kategori.");
    }
  }, [state, onOpenChange, router]);

  const nameError = state.fieldErrors?.name?.[0];
  const slugError = state.fieldErrors?.slug?.[0];
  const descriptionError = state.fieldErrors?.description?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
          <DialogDescription>
            Kategori dipakai untuk mengelompokkan proyek. Satu proyek boleh punya
            beberapa kategori.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4" noValidate>
          {category ? <input type="hidden" name="id" value={category.id} /> : null}

          <div className="space-y-2">
            <Label htmlFor="category-name">Nama</Label>
            <Input
              id="category-name"
              name="name"
              value={name}
              onChange={(event) => {
                const value = event.target.value;
                setName(value);
                if (!slugTouched) setSlug(slugify(value));
              }}
              placeholder="Web Development"
              maxLength={60}
              required
              aria-invalid={Boolean(nameError)}
            />
            {nameError ? (
              <p className="text-xs text-destructive">{nameError}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-slug">Slug</Label>
            <Input
              id="category-slug"
              name="slug"
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                // Biarkan tanda hubung diketik apa adanya; validasi final di server.
                setSlug(
                  event.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-"),
                );
              }}
              placeholder="web-development"
              maxLength={80}
              required
              aria-invalid={Boolean(slugError)}
            />
            <p className="text-xs text-muted-foreground">
              Dipakai pada URL filter, mis. /projects?category=web-development
            </p>
            {slugError ? (
              <p className="text-xs text-destructive">{slugError}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-description">Deskripsi (opsional)</Label>
            <Textarea
              id="category-description"
              name="description"
              defaultValue={category?.description ?? ""}
              placeholder="Deskripsi singkat kategori..."
              rows={3}
              maxLength={300}
              aria-invalid={Boolean(descriptionError)}
            />
            {descriptionError ? (
              <p className="text-xs text-destructive">{descriptionError}</p>
            ) : null}
          </div>

          {state.status === "error" && state.message && !state.fieldErrors ? (
            <p
              role="alert"
              className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {state.message}
            </p>
          ) : null}

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Batal
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
