import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Konten berasal dari database CMS, selalu render saat request.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profile, featuredProjects] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        categories: { select: { id: true, name: true } },
      },
    }),
  ]);

  return (
    <div>
      <section className="mx-auto w-full max-w-5xl px-4 py-20 sm:py-28">
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          {profile?.profession ?? "Web Developer"}
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {profile?.fullName ?? "Nama Lengkap"}
        </h1>
        <p className="mt-4 max-w-xl text-base text-pretty text-muted-foreground">
          {profile?.headline ?? "Headline profesional dari dashboard CMS."}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button render={<Link href="/projects" />}>
            Lihat Proyek
            <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" render={<Link href="/contact" />}>
            Hubungi Saya
          </Button>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 pb-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight">Proyek Pilihan</h2>
          <Button variant="ghost" size="sm" render={<Link href="/projects" />}>
            Semua proyek
          </Button>
        </div>

        {featuredProjects.length === 0 ? (
          <p className="rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
            Belum ada proyek yang dipublikasikan.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group rounded-xl border p-5 transition-colors hover:bg-muted/50"
              >
                <h3 className="font-medium group-hover:underline">
                  {project.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {project.shortDescription}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.categories.map((category) => (
                    <Badge key={category.id} variant="secondary">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
