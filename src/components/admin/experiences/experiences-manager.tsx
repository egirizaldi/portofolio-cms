"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { ExperienceFormDialog } from "@/components/admin/experiences/experience-form-dialog";
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

export type ExperienceRow = {
  id: string;
  position: string;
  organization: string;
  location: string | null;
  description: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  displayOrder: number;
};

export function ExperiencesManager({
  experiences,
}: {
  experiences: ExperienceRow[];
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [formSession, setFormSession] = useState(0);
  const [editing, setEditing] = useState<ExperienceRow | null>(null);
  const [deleting, setDeleting] = useState<ExperienceRow | null>(null);

  function openCreate() {
    setEditing(null);
    setFormSession((session) => session + 1);
    setFormOpen(true);
  }

  function openEdit(experience: ExperienceRow) {
    setEditing(experience);
    setFormSession((session) => session + 1);
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!deleting) return false;

    try {
      const response = await fetch(`/api/experiences/${deleting.id}`, {
        method: "DELETE",
      });
      const payload = await readJson(response);

      if (!response.ok) {
        toast.error("Gagal menghapus pengalaman", {
          description: getApiErrorMessage(payload),
        });
        return false;
      }

      toast.success("Pengalaman dihapus.");
      router.refresh();
      return true;
    } catch (error) {
      toast.error("Gagal menghapus pengalaman", {
        description: getNetworkErrorMessage(error),
      });
      return false;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pengalaman</h1>
          <p className="text-sm text-muted-foreground">
            Kelola riwayat pekerjaan dan organisasi.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Tambah Pengalaman
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengalaman</CardTitle>
          <CardDescription>
            {experiences.length} pengalaman tersimpan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {experiences.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-4 py-12 text-center">
              <BriefcaseBusiness className="size-6 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Belum ada pengalaman</p>
                <p className="text-xs text-muted-foreground">
                  Tambahkan pengalaman kerja atau organisasi pertama.
                </p>
              </div>
              <Button size="sm" onClick={openCreate}>
                <Plus className="size-4" />
                Tambah Pengalaman
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Posisi</TableHead>
                  <TableHead>Organisasi</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                  <TableHead className="w-24 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {experiences.map((experience) => (
                  <TableRow key={experience.id}>
                    <TableCell className="font-medium">
                      {experience.position}
                      {experience.location ? (
                        <span className="block text-xs text-muted-foreground">
                          {experience.location}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {experience.organization}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateRange(
                        experience.startDate,
                        experience.endDate,
                        experience.isCurrent,
                      ) ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          experience.isCurrent ? "secondary" : "outline"
                        }
                      >
                        {experience.isCurrent ? "Berlangsung" : "Selesai"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${experience.position}`}
                          onClick={() => openEdit(experience)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Hapus ${experience.position}`}
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleting(experience)}
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

      <ExperienceFormDialog
        key={`experience-form-${formSession}`}
        open={formOpen}
        onOpenChange={setFormOpen}
        experience={editing}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Hapus pengalaman ini?"
        description={
          <>
            Pengalaman <strong>{deleting?.position}</strong> di{" "}
            <strong>{deleting?.organization}</strong> akan dihapus permanen.
          </>
        }
        onConfirm={handleDelete}
      />
    </div>
  );
}
