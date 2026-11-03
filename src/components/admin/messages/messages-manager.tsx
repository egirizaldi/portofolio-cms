"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  Eye,
  Mail,
  MailOpen,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
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
import { cn } from "@/lib/utils";

type MessageStatus = "UNREAD" | "READ" | "ARCHIVED";
type MessageFilter = "ALL" | MessageStatus;

export type MessageRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
};

const filters: Array<{ value: MessageFilter; label: string }> = [
  { value: "ALL", label: "Semua" },
  { value: "UNREAD", label: "Belum Dibaca" },
  { value: "READ", label: "Sudah Dibaca" },
  { value: "ARCHIVED", label: "Diarsipkan" },
];

const statusLabel: Record<MessageStatus, string> = {
  UNREAD: "Belum dibaca",
  READ: "Sudah dibaca",
  ARCHIVED: "Diarsipkan",
};

function statusVariant(status: MessageStatus) {
  if (status === "UNREAD") return "destructive" as const;
  if (status === "READ") return "secondary" as const;
  return "outline" as const;
}

function formatDateTime(value: string) {
  return (
    formatDate(value, { dateStyle: "medium", timeStyle: "short" }) ?? "—"
  );
}

export function MessagesManager({ messages }: { messages: MessageRow[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<MessageFilter>("ALL");
  const [selected, setSelected] = useState<MessageRow | null>(null);
  const [deleting, setDeleting] = useState<MessageRow | null>(null);
  const [pendingStatus, setPendingStatus] = useState<MessageStatus | null>(null);

  const filtered = useMemo(
    () =>
      filter === "ALL"
        ? messages
        : messages.filter((message) => message.status === filter),
    [filter, messages],
  );

  const unreadCount = messages.filter(
    (message) => message.status === "UNREAD",
  ).length;

  async function updateStatus(message: MessageRow, status: MessageStatus) {
    setPendingStatus(status);
    try {
      const response = await fetch(`/api/messages/${message.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const payload = await readJson(response);

      if (!response.ok) {
        toast.error("Gagal mengubah status pesan", {
          description: getApiErrorMessage(payload),
        });
        return;
      }

      toast.success(`Pesan ditandai sebagai ${statusLabel[status].toLowerCase()}.`);
      setSelected((current) =>
        current && current.id === message.id
          ? { ...current, status }
          : current,
      );
      router.refresh();
    } catch (error) {
      toast.error("Gagal mengubah status pesan", {
        description: getNetworkErrorMessage(error),
      });
    } finally {
      setPendingStatus(null);
    }
  }

  async function handleDelete() {
    if (!deleting) return false;

    try {
      const response = await fetch(`/api/messages/${deleting.id}`, {
        method: "DELETE",
      });
      const payload = await readJson(response);

      if (!response.ok) {
        toast.error("Gagal menghapus pesan", {
          description: getApiErrorMessage(payload),
        });
        return false;
      }

      toast.success("Pesan dihapus.");
      if (selected?.id === deleting.id) setSelected(null);
      router.refresh();
      return true;
    } catch (error) {
      toast.error("Gagal menghapus pesan", {
        description: getNetworkErrorMessage(error),
      });
      return false;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pesan</h1>
        <p className="text-sm text-muted-foreground">
          Pesan dari formulir kontak pengunjung.
          {unreadCount > 0 ? ` ${unreadCount} pesan belum dibaca.` : ""}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {filters.map((item) => {
          const active = filter === item.value;
          const count =
            item.value === "ALL"
              ? messages.length
              : messages.filter((message) => message.status === item.value)
                  .length;

          return (
            <Button
              key={item.value}
              size="sm"
              variant={active ? "default" : "outline"}
              aria-pressed={active}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
              <span
                className={cn(
                  "text-xs tabular-nums",
                  active ? "opacity-80" : "text-muted-foreground",
                )}
              >
                {count}
              </span>
            </Button>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kotak Masuk</CardTitle>
          <CardDescription>
            Menampilkan {filtered.length} dari {messages.length} pesan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-4 py-12 text-center">
              <Mail className="size-6 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Belum ada pesan</p>
                <p className="text-xs text-muted-foreground">
                  Pesan dari formulir kontak akan muncul di sini.
                </p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed px-4 py-12 text-center">
              <p className="text-sm font-medium">Tidak ada pesan</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Tidak ada pesan dengan status ini.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Subjek</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Tanggal</TableHead>
                  <TableHead className="w-28 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((message) => (
                  <TableRow
                    key={message.id}
                    className="cursor-pointer"
                    onClick={() => setSelected(message)}
                  >
                    <TableCell className="font-medium">
                      {message.name}
                      <span className="block text-xs text-muted-foreground md:hidden">
                        {message.email}
                      </span>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {message.email}
                    </TableCell>
                    <TableCell className="max-w-64 truncate text-sm">
                      {message.subject}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(message.status)}>
                        {message.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                      {formatDateTime(message.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div
                        className="flex justify-end gap-1"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Lihat pesan ${message.subject}`}
                          onClick={() => setSelected(message)}
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Hapus pesan ${message.subject}`}
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleting(message)}
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

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-xl">
          {selected ? (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <DialogTitle className="text-lg leading-tight">
                      {selected.subject}
                    </DialogTitle>
                    <DialogDescription className="mt-1">
                      {selected.name} ·{" "}
                      <a
                        href={`mailto:${selected.email}`}
                        className="underline underline-offset-3 hover:text-foreground"
                      >
                        {selected.email}
                      </a>
                    </DialogDescription>
                  </div>
                  <Badge variant={statusVariant(selected.status)}>
                    {selected.status}
                  </Badge>
                </div>
              </DialogHeader>

              <p className="text-xs text-muted-foreground">
                Diterima {formatDateTime(selected.createdAt)}
              </p>

              <Separator />

              <p className="max-h-72 overflow-y-auto whitespace-pre-line text-sm leading-6">
                {selected.message}
              </p>

              <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setDeleting(selected)}
                >
                  <Trash2 className="size-4" />
                  Hapus
                </Button>
                <div className="flex flex-wrap gap-2">
                  {selected.status !== "READ" ? (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={pendingStatus !== null}
                      onClick={() => updateStatus(selected, "READ")}
                    >
                      <MailOpen className="size-4" />
                      Tandai Sudah Dibaca
                    </Button>
                  ) : null}
                  {selected.status !== "ARCHIVED" ? (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={pendingStatus !== null}
                      onClick={() => updateStatus(selected, "ARCHIVED")}
                    >
                      <Archive className="size-4" />
                      Arsipkan
                    </Button>
                  ) : null}
                  {selected.status !== "UNREAD" ? (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={pendingStatus !== null}
                      onClick={() => updateStatus(selected, "UNREAD")}
                    >
                      <RotateCcw className="size-4" />
                      Tandai Belum Dibaca
                    </Button>
                  ) : null}
                </div>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Hapus pesan ini?"
        description={
          <>
            Pesan <strong>{deleting?.subject}</strong> dari{" "}
            <strong>{deleting?.name}</strong> akan dihapus permanen.
          </>
        }
        onConfirm={handleDelete}
      />
    </div>
  );
}
