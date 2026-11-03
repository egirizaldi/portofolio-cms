"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteSkillDialog } from "@/components/admin/skills/delete-skill-dialog";
import { SkillFormDialog } from "@/components/admin/skills/skill-form-dialog";
import {
  getApiErrorMessage,
  getNetworkErrorMessage,
  readJson,
} from "@/lib/api";

export type SkillRow = {
  id: string;
  name: string;
  groupName: string | null;
  level: number | null;
  icon: string | null;
  isActive: boolean;
  displayOrder: number;
};

export function SkillsManager({ skills }: { skills: SkillRow[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [formSession, setFormSession] = useState(0);
  const [editing, setEditing] = useState<SkillRow | null>(null);
  const [deleting, setDeleting] = useState<SkillRow | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const groups = Array.from(
    new Set(
      skills
        .map((skill) => skill.groupName?.trim())
        .filter((group): group is string => Boolean(group)),
    ),
  ).sort();

  function openCreate() {
    setEditing(null);
    setFormSession((session) => session + 1);
    setFormOpen(true);
  }

  function openEdit(skill: SkillRow) {
    setEditing(skill);
    setFormSession((session) => session + 1);
    setFormOpen(true);
  }

  async function toggleActive(skill: SkillRow, checked: boolean) {
    setTogglingId(skill.id);
    try {
      const response = await fetch(`/api/skills/${skill.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: checked }),
      });
      const payload = await readJson(response);

      if (!response.ok) {
        toast.error("Gagal mengubah status skill", {
          description: getApiErrorMessage(payload),
        });
        return;
      }

      toast.success(
        checked ? "Skill diaktifkan." : "Skill dinonaktifkan.",
      );
      router.refresh();
    } catch (error) {
      toast.error("Gagal mengubah status skill", {
        description: getNetworkErrorMessage(error),
      });
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Keahlian</h1>
          <p className="text-sm text-muted-foreground">
            Kelola daftar skill yang tampil di website publik.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Tambah Skill
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Skill</CardTitle>
          <CardDescription>
            {skills.length} skill tersimpan. Urutan kecil tampil lebih dulu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {skills.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-4 py-12 text-center">
              <Sparkles className="size-6 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Belum ada skill</p>
                <p className="text-xs text-muted-foreground">
                  Tambahkan keahlian pertama yang ingin ditampilkan.
                </p>
              </div>
              <Button size="sm" onClick={openCreate}>
                <Plus className="size-4" />
                Tambah Skill
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Grup</TableHead>
                  <TableHead className="w-20 text-center">Level</TableHead>
                  <TableHead className="w-24 text-center">Aktif</TableHead>
                  <TableHead className="w-20 text-center">Urutan</TableHead>
                  <TableHead className="w-24 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skills.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell className="font-medium">
                      <span className="inline-flex items-center gap-2">
                        {skill.icon ? (
                          <span aria-hidden>{skill.icon}</span>
                        ) : null}
                        {skill.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {skill.groupName || "Lainnya"}
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      {skill.level ?? "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={skill.isActive}
                        disabled={togglingId === skill.id}
                        onCheckedChange={(checked) =>
                          toggleActive(skill, checked)
                        }
                        aria-label={`Aktifkan ${skill.name}`}
                      />
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      {skill.displayOrder}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${skill.name}`}
                          onClick={() => openEdit(skill)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Hapus ${skill.name}`}
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleting(skill)}
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

      <SkillFormDialog
        key={`skill-form-${formSession}`}
        open={formOpen}
        onOpenChange={setFormOpen}
        skill={editing}
        groups={groups}
      />

      <DeleteSkillDialog
        skill={deleting}
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      />
    </div>
  );
}
