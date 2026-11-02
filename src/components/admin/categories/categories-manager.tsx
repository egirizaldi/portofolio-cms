"use client";

import { useState } from "react";
import { Pencil, Plus, Tags, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryFormDialog } from "@/components/admin/categories/category-form-dialog";
import { DeleteCategoryDialog } from "@/components/admin/categories/delete-category-dialog";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  projectCount: number;
};

export function CategoriesManager({ categories }: { categories: CategoryRow[] }) {
  const [formOpen, setFormOpen] = useState(false);
  const [formSession, setFormSession] = useState(0);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [deleting, setDeleting] = useState<CategoryRow | null>(null);

  // Session baru setiap kali dialog dibuka agar isi form selalu ter-reset.
  function openCreate() {
    setEditing(null);
    setFormSession((session) => session + 1);
    setFormOpen(true);
  }

  function openEdit(category: CategoryRow) {
    setEditing(category);
    setFormSession((session) => session + 1);
    setFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Kategori</h1>
          <p className="text-sm text-muted-foreground">
            Kelola kategori untuk mengelompokkan proyek.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Tambah Kategori
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kategori</CardTitle>
          <CardDescription>
            {categories.length} kategori tersimpan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-4 py-12 text-center">
              <Tags className="size-6 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Belum ada kategori</p>
                <p className="text-xs text-muted-foreground">
                  Tambahkan kategori pertama untuk mulai mengelompokkan proyek.
                </p>
              </div>
              <Button size="sm" onClick={openCreate}>
                <Plus className="size-4" />
                Tambah Kategori
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead className="hidden md:table-cell">Slug</TableHead>
                  <TableHead className="hidden lg:table-cell">Deskripsi</TableHead>
                  <TableHead className="w-24 text-center">Proyek</TableHead>
                  <TableHead className="w-24 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                      <span className="block text-xs text-muted-foreground md:hidden">
                        {category.slug}
                      </span>
                    </TableCell>
                    <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                      {category.slug}
                    </TableCell>
                    <TableCell className="hidden max-w-xs truncate text-sm text-muted-foreground lg:table-cell">
                      {category.description || "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={category.projectCount > 0 ? "secondary" : "outline"}>
                        {category.projectCount}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${category.name}`}
                          onClick={() => openEdit(category)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Hapus ${category.name}`}
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleting(category)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CategoryFormDialog
        key={`category-form-${formSession}`}
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editing}
      />

      <DeleteCategoryDialog
        category={deleting}
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      />
    </div>
  );
}
