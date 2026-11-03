import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  FolderKanban,
  Mail,
  Sparkles,
  Tags,
} from "lucide-react";

import { prisma } from "@/lib/db";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { StatCard } from "@/components/admin/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard" };

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function DashboardPage() {
  const [
    publishedProjects,
    draftProjects,
    categoryCount,
    skillCount,
    certificateCount,
    unreadMessages,
    readMessages,
    archivedMessages,
    totalMessages,
    latestMessages,
    latestProjects,
  ] = await Promise.all([
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.project.count({ where: { status: "DRAFT" } }),
    prisma.category.count(),
    prisma.skill.count(),
    prisma.certificate.count(),
    prisma.message.count({ where: { status: "UNREAD" } }),
    prisma.message.count({ where: { status: "READ" } }),
    prisma.message.count({ where: { status: "ARCHIVED" } }),
    prisma.message.count(),
    prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        subject: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        createdAt: true,
        categories: { select: { id: true, name: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Ringkasan konten portofolio Anda.
          </p>
        </div>
        <Button render={<Link href="/admin/projects/new" />}>
          Tambah Proyek
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Proyek Published"
          value={publishedProjects}
          icon={FolderKanban}
          hint={`${draftProjects} draft`}
        />
        <StatCard label="Kategori" value={categoryCount} icon={Tags} />
        <StatCard label="Keahlian" value={skillCount} icon={Sparkles} />
        <StatCard
          label="Pesan Belum Dibaca"
          value={unreadMessages}
          icon={Mail}
          hint={`${totalMessages} total pesan`}
        />
      </div>

      <DashboardCharts
        projects={{ published: publishedProjects, draft: draftProjects }}
        messages={{
          unread: unreadMessages,
          read: readMessages,
          archived: archivedMessages,
        }}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2">
            <div>
              <CardTitle>Pesan Terbaru</CardTitle>
              <CardDescription>5 pesan terakhir dari pengunjung.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" render={<Link href="/admin/messages" />}>
              Lihat semua
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada pesan masuk.
              </p>
            ) : (
              latestMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start justify-between gap-3 border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {message.subject}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {message.name} · {formatDate(message.createdAt)}
                    </p>
                  </div>
                  {message.status === "UNREAD" ? (
                    <Badge variant="secondary">Baru</Badge>
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2">
            <div>
              <CardTitle>Proyek Terbaru</CardTitle>
              <CardDescription>5 proyek terakhir dibuat.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" render={<Link href="/admin/projects" />}>
              Lihat semua
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada proyek. Mulai dengan menambah proyek baru.
              </p>
            ) : (
              latestProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-start justify-between gap-3 border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {project.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {project.categories.map((c) => c.name).join(", ") ||
                        "Tanpa kategori"}{" "}
                      · {formatDate(project.createdAt)}
                    </p>
                  </div>
                  <Badge
                    variant={
                      project.status === "PUBLISHED" ? "default" : "outline"
                    }
                  >
                    {project.status === "PUBLISHED" ? "Published" : "Draft"}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sertifikat</CardTitle>
          <CardDescription>
            Total {certificateCount} sertifikat tersimpan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/admin/certificates" />}
          >
            <Award className="size-4" />
            Kelola sertifikat
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
