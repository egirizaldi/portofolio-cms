"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { EducationFormDialog } from "@/components/admin/educations/education-form-dialog";
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
import {
  getApiErrorMessage,
  getNetworkErrorMessage,
  readJson,
} from "@/lib/api";
import { formatDateRange } from "@/lib/format";

export type EducationRow = {
  id: string;
  institution: string;
  program: string;
  level: string | null;
  description: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  displayOrder: number;
};

export function EducationsManager({
  educations,
}: {
  educations: EducationRow[];
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [formSession, setFormSession] = useState(0);
  const [editing, setEditing] = useState<EducationRow | null>(null);
  const [deleting, setDeleting] = useState<EducationRow | null>(null);

  function openCreate() {
    setEditing(null);
    setFormSession((session) => session + 1);
    setFormOpen(true);
  }

  function openEdit(education: EducationRow) {
    setEditing(education);
    setFormSession((session) => session + 1);
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!deleting) return false;

    try {
      const response = await fetch(`/api/educations/${deleting.id}`, {
        method: "DELETE",
      });
      const payload = await readJson(response);

      if (!response.ok) {
        toast.error("Gagal menghapus pendidikan", {
          description: getApiErrorMessage(payload),
        });
        return false;
      }

      toast.success("Pendidikan dihapus.");
      router.refresh();
      return true;
    } catch (error) {
      toast.error("Gagal menghapus pendidikan", {
        description: getNetworkErrorMessage(error),
      });
      return false;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pendidikan</h1>
          <p className="text-sm text-muted-foreground">
            Kelola riwayat pendidikan yang tampil di website publik.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Tambah Pendidikan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pendidikan</CardTitle>
          <CardDescription>
            {educations.length} riwayat pendidikan tersimpan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {educations.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-4 py-12 text-center">
              <GraduationCap className="size-6 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Belum ada pendidikan</p>
                <p className="text-xs text-muted-foreground">
                  Tambahkan riwayat pendidikan pertama.
                </p>
              </div>
              <Button size="sm" onClick={openCreate}>
                <Plus className="size-4" />
                Tambah Pendidikan
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>Institusi</TableHead>
                  <TableHead className="hidden md:table-cell">Jenjang</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                  <TableHead className="w-24 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {educations.map((education) => (
                  <TableRow key={education.id}>
                    <TableCell className="font-medium">
                      {education.program}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {education.institution}
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {education.level || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateRange(
                        education.startDate,
                        education.endDate,
                        education.isCurrent,
                      ) ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          education.isCurrent ? "secondary" : "outline"
                        }
                      >
                        {education.isCurrent ? "Berlangsung" : "Selesai"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${education.program}`}
                          onClick={() => openEdit(education)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Hapus ${education.program}`}
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleting(education)}
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

      <EducationFormDialog
        key={`education-form-${formSession}`}
        open={formOpen}
        onOpenChange={setFormOpen}
        education={editing}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Hapus pendidikan ini?"
        description={
          <>
            Riwayat <strong>{deleting?.program}</strong> di{" "}
            <strong>{deleting?.institution}</strong> akan dihapus permanen.
          </>
        }
        onConfirm={handleDelete}
      />
    </div>
  );
}
