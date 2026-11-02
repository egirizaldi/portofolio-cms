import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  ExternalLink,
  GitBranch,
} from "lucide-react";

import { ProjectCard } from "@/components/public/project-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { resolveImageSrc } from "@/lib/media";

export const dynamic = "force-dynamic";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

const getProject = cache(async (slug: string) => {
  return prisma.project.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      categories: { select: { id: true, name: true, slug: true } },
      images: {
        orderBy: { displayOrder: "asc" },
        select: { id: true, imagePath: true, altText: true },
      },
    },
  });
});

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Proyek tidak ditemukan",
      robots: { index: false, follow: false },
    };
  }

  const image = resolveImageSrc(project.thumbnail);

  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      type: "article",
      title: project.title,
      description: project.shortDescription,
      images: image ? [{ url: image, alt: project.title }] : undefined,
      ...(project.projectDate
        ? { publishedTime: project.projectDate.toISOString() }
        : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: project.title,
      description: project.shortDescription,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const thumbnail = resolveImageSrc(project.thumbnail);
  const gallery = project.images
    .map((image) => ({ ...image, src: resolveImageSrc(image.imagePath) }))
    .filter(
      (image): image is typeof image & { src: string } => Boolean(image.src),
    );

  const categoryIds = project.categories.map((category) => category.id);

  const relatedProjects =
    categoryIds.length > 0
      ? await prisma.project.findMany({
          where: {
            status: "PUBLISHED",
            id: { not: project.id },
            categories: { some: { id: { in: categoryIds } } },
          },
          take: 3,
          orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
          select: {
            id: true,
            title: true,
            slug: true,
            shortDescription: true,
            thumbnail: true,
            technologies: true,
            projectDate: true,
            createdAt: true,
            isFeatured: true,
            categories: { select: { id: true, name: true } },
          },
        })
      : [];

  const date = formatDate(project.projectDate ?? project.createdAt);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:py-16">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Semua proyek
      </Link>

      <header className="mt-6 max-w-3xl">
        {project.categories.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {project.categories.map((category) => (
              <Badge
                key={category.id}
                variant="secondary"
                render={<Link href={`/projects?category=${category.slug}`} />}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        ) : null}

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-pretty text-muted-foreground">
          {project.shortDescription}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays aria-hidden className="size-4" />
            {date ?? "Tanpa tanggal"}
          </span>
          {project.isFeatured ? <Badge>Featured</Badge> : null}
        </div>
      </header>

      {thumbnail ? (
        <div className="mt-8 overflow-hidden rounded-2xl border bg-muted">
          <div className="relative aspect-[16/9]">
            <Image
              src={thumbnail}
              alt={project.title}
              fill
              priority
              unoptimized
              sizes="(min-width: 1024px) 960px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight">
            Tentang proyek
          </h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
            {project.description}
          </p>

          {gallery.length > 0 ? (
            <section className="mt-10">
              <h2 className="text-lg font-semibold tracking-tight">Galeri</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {gallery.map((image) => (
                  <figure
                    key={image.id}
                    className="overflow-hidden rounded-xl border bg-muted"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={image.src}
                        alt={image.altText ?? project.title}
                        fill
                        unoptimized
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    {image.altText ? (
                      <figcaption className="px-3 py-2 text-xs text-muted-foreground">
                        {image.altText}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            </section>
          ) : null}
        </article>

        <aside className="space-y-4">
          {project.technologies.length > 0 ? (
            <div className="rounded-xl border p-5">
              <h2 className="text-sm font-semibold">Teknologi</h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.technologies.map((technology) => (
                  <Badge key={technology} variant="secondary">
                    {technology}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}

          {project.demoUrl || project.githubUrl ? (
            <div className="space-y-2 rounded-xl border p-5">
              <h2 className="text-sm font-semibold">Tautan</h2>
              {project.demoUrl ? (
                <Button
                  className="w-full justify-start"
                  render={
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                    />
                  }
                >
                  <ExternalLink aria-hidden />
                  Live demo
                </Button>
              ) : null}
              {project.githubUrl ? (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  render={
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                    />
                  }
                >
                  <GitBranch aria-hidden />
                  Repository
                </Button>
              ) : null}
            </div>
          ) : null}

          <div className="rounded-xl border p-5">
            <h2 className="text-sm font-semibold">Detail</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted-foreground">Tanggal</dt>
                <dd className="text-right font-medium">
                  {date ?? "Tanpa tanggal"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted-foreground">Kategori</dt>
                <dd className="text-right font-medium">
                  {project.categories.length > 0
                    ? project.categories.map((category) => category.name).join(", ")
                    : "Tanpa kategori"}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      {relatedProjects.length > 0 ? (
        <section className="mt-16 border-t pt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Proyek lainnya
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Karya lain dengan kategori serupa.
              </p>
            </div>
            <Button variant="ghost" size="sm" render={<Link href="/projects" />}>
              Lihat semua
              <ArrowUpRight aria-hidden />
            </Button>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProjects.map((related) => (
              <ProjectCard key={related.id} project={related} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
