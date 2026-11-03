"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Award, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { CertificateFormDialog } from "@/components/admin/certificates/certificate-form-dialog";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
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
import { formatDate } from "@/lib/format";
import { resolveImageSrc } from "@/lib/media";

export type CertificateRow = {
  id: string;
  name: string;
  issuer: string;
  issuedAt: string | null;
  credentialUrl: string | null;
  imagePath: string | null;
  displayOrder: number;
};

export function CertificatesManager({
  certificates,
}: {
  certificates: CertificateRow[];
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [formSession, setFormSession] = useState(0);
  const [editing, setEditing] = useState<CertificateRow | null>(null);
  const [deleting, setDeleting] = useState<CertificateRow | null>(null);

  function openCreate() {
    setEditing(null);
    setFormSession((session) => session + 1);
    setFormOpen(true);
  }

  function openEdit(certificate: CertificateRow) {
    setEditing(certificate);
    setFormSession((session) => session + 1);
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!deleting) return false;

    try {
      const response = await fetch(`/api/certificates/${deleting.id}`, {
        method: "DELETE",
      });
      const payload = await readJson(response);

      if (!response.ok) {
        toast.error("Gagal menghapus sertifikat", {
          description: getApiErrorMessage(payload),
        });
        return false;
      }

      toast.success("Sertifikat dihapus.");
      router.refresh();
      return true;
    } catch (error) {
      toast.error("Gagal menghapus sertifikat", {
        description: getNetworkErrorMessage(error),
      });
      return false;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sertifikat</h1>
          <p className="text-sm text-muted-foreground">
            Kelola sertifikat dan kredensial profesional.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Tambah Sertifikat
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Sertifikat</CardTitle>
          <CardDescription>
            {certificates.length} sertifikat tersimpan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {certificates.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-4 py-12 text-center">
              <Award className="size-6 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Belum ada sertifikat</p>
                <p className="text-xs text-muted-foreground">
                  Tambahkan sertifikat pertama yang ingin ditampilkan.
                </p>
              </div>
              <Button size="sm" onClick={openCreate}>
                <Plus className="size-4" />
                Tambah Sertifikat
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Gambar</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Penerbit</TableHead>
                  <TableHead>Tanggal Terbit</TableHead>
                  <TableHead className="w-24 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.map((certificate) => {
                  const image = resolveImageSrc(certificate.imagePath);
                  return (
                    <TableRow key={certificate.id}>
                      <TableCell>
                        <div className="flex size-10 items-center justify-center overflow-hidden rounded-md border bg-muted">
                          {image ? (
                            <Image
                              src={image}
                              alt={certificate.name}
                              width={40}
                              height={40}
                              unoptimized
                              className="size-full object-cover"
                            />
                          ) : (
                            <Award className="size-4 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {certificate.name}
                        {certificate.credentialUrl ? (
                          <span className="block max-w-52 truncate text-xs text-muted-foreground">
                            {certificate.credentialUrl}
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {certificate.issuer}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(certificate.issuedAt) ?? "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Edit ${certificate.name}`}
                            onClick={() => openEdit(certificate)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Hapus ${certificate.name}`}
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleting(certificate)}
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

      <CertificateFormDialog
        key={`certificate-form-${formSession}`}
        open={formOpen}
        onOpenChange={setFormOpen}
        certificate={editing}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Hapus sertifikat ini?"
        description={
          <>
            Sertifikat <strong>{deleting?.name}</strong> dari{" "}
            <strong>{deleting?.issuer}</strong> akan dihapus permanen.
          </>
        }
        onConfirm={handleDelete}
      />
    </div>
  );
}
