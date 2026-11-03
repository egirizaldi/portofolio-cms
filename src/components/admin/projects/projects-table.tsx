"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  FolderKanban,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { DeleteProjectDialog } from "@/components/admin/projects/delete-project-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { formatDate } from "@/lib/format";
import { resolveImageSrc } from "@/lib/media";
import { cn } from "@/lib/utils";

export type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  status: "DRAFT" | "PUBLISHED";
  isFeatured: boolean;
  createdAt: string;
  categories: Array<{ id: string; name: string }>;
};

type StatusFilter = "ALL" | "DRAFT" | "PUBLISHED";

const PAGE_SIZE = 10;

const statusFilters: Array<{ value: StatusFilter; label: string }> = [
  { value: "ALL", label: "Semua" },
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
];

export function ProjectsTable({ projects }: { projects: ProjectRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<ProjectRow | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesStatus = status === "ALL" || project.status === status;
      const matchesQuery =
        !needle ||
        project.title.toLowerCase().includes(needle) ||
        project.slug.toLowerCase().includes(needle);
      return matchesStatus && matchesQuery;
    });
  }, [projects, query, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  async function toggleStatus(project: ProjectRow) {
    const nextStatus = project.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setTogglingId(project.id);

    try {
      const response = await fetch(`/api/projects/${project.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const payload = await readJson(response);

      if (!response.ok) {
        toast.error("Gagal mengubah status proyek", {
          description: getApiErrorMessage(payload),
        });
        return;
      }

      toast.success(
        nextStatus === "PUBLISHED"
          ? "Proyek dipublikasikan."
          : "Proyek diubah menjadi draft.",
      );
      router.refresh();
    } catch (error) {
      toast.error("Gagal mengubah status proyek", {
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
          <h1 className="text-2xl font-semibold tracking-tight">Proyek</h1>
          <p className="text-sm text-muted-foreground">
            Kelola portofolio proyek, status publikasi, dan kategori.
          </p>
        </div>
        <Button render={<Link href="/admin/projects/new" />}>
          <Plus className="size-4" />
          Tambah Proyek
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Cari judul atau slug..."
            aria-label="Cari proyek"
            className="h-9 pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {statusFilters.map((item) => {
            const active = status === item.value;
            return (
              <Button
                key={item.value}
                size="sm"
                variant={active ? "default" : "outline"}
                aria-pressed={active}
                onClick={() => {
                  setStatus(item.value);
                  setPage(1);
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Proyek</CardTitle>
          <CardDescription>
            Menampilkan {visible.length} dari {filtered.length} proyek
            {filtered.length !== projects.length
              ? ` (total ${projects.length})`
              : ""}
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-4 py-12 text-center">
              <FolderKanban className="size-6 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Belum ada proyek</p>
                <p className="text-xs text-muted-foreground">
                  Tambahkan proyek pertama untuk mulai membangun portofolio.
                </p>
              </div>
              <Button size="sm" render={<Link href="/admin/projects/new" />}>
                <Plus className="size-4" />
                Tambah Proyek
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed px-4 py-12 text-center">
              <p className="text-sm font-medium">Proyek tidak ditemukan</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Coba kata kunci lain atau ubah filter status.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Thumbnail</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead className="hidden lg:table-cell">Kategori</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                  <TableHead className="w-20 text-center">Featured</TableHead>
                  <TableHead className="hidden xl:table-cell">
                    Dibuat
                  </TableHead>
                  <TableHead className="w-32 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((project) => {
                  const thumbnail = resolveImageSrc(project.thumbnail);
                  return (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div className="flex h-10 w-14 items-center justify-center overflow-hidden rounded-md border bg-muted">
                          {thumbnail ? (
                            <Image
                              src={thumbnail}
                              alt={project.title}
                              width={56}
                              height={40}
                              unoptimized
                              className="size-full object-cover"
                            />
                          ) : (
                            <FolderKanban className="size-4 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-64">
                        <p className="truncate font-medium">{project.title}</p>
                        <p className="truncate font-mono text-xs text-muted-foreground">
                          /{project.slug}
                        </p>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex max-w-56 flex-wrap gap-1">
                          {project.categories.length > 0 ? (
                            project.categories.map((category) => (
                              <Badge key={category.id} variant="secondary">
                                {category.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Tanpa kategori
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            project.status === "PUBLISHED"
                              ? "default"
                              : "outline"
                          }
                        >
                          {project.status === "PUBLISHED"
                            ? "Published"
                            : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Star
                          aria-label={
                            project.isFeatured ? "Featured" : "Tidak featured"
                          }
                          className={cn(
                            "mx-auto size-4",
                            project.isFeatured
                              ? "fill-amber-400 text-amber-500"
                              : "text-muted-foreground/40",
                          )}
                        />
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground xl:table-cell">
                        {formatDate(project.createdAt, {
                          dateStyle: "medium",
                        }) ?? "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={
                              project.status === "PUBLISHED"
                                ? `Jadikan draft ${project.title}`
                                : `Publikasikan ${project.title}`
                            }
                            title={
                              project.status === "PUBLISHED"
                                ? "Jadikan draft"
                                : "Publikasikan"
                            }
                            disabled={togglingId === project.id}
                            onClick={() => toggleStatus(project)}
                          >
                            {project.status === "PUBLISHED" ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Edit ${project.title}`}
                            render={
                              <Link
                                href={`/admin/projects/${project.id}/edit`}
                              />
                            }
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Hapus ${project.title}`}
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleting(project)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {filtered.length > PAGE_SIZE ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              <ChevronLeft className="size-4" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setPage((value) => Math.min(totalPages, value + 1))
              }
            >
              Berikutnya
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      ) : null}

      <DeleteProjectDialog
        project={deleting}
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      />
    </div>
  );
}
