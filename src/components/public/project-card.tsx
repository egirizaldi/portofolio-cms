import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, ImageIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { resolveImageSrc } from "@/lib/media";
import { cn } from "@/lib/utils";

export type ProjectCardData = {
  title: string;
  slug: string;
  shortDescription: string;
  thumbnail: string;
  technologies: string[];
  projectDate: Date | null;
  createdAt: Date;
  isFeatured: boolean;
  categories: { id: string; name: string }[];
};

type ProjectCardProps = {
  project: ProjectCardData;
  className?: string;
};

export function ProjectCard({ project, className }: ProjectCardProps) {
  const image = resolveImageSrc(project.thumbnail);
  const date = formatDate(project.projectDate ?? project.createdAt, {
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image}
            alt={project.title}
            fill
            unoptimized
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,var(--muted),color-mix(in_oklch,var(--muted),var(--foreground)_6%))]">
            <ImageIcon aria-hidden className="size-8 text-muted-foreground/40" />
          </div>
        )}

        {project.isFeatured ? (
          <Badge className="absolute left-3 top-3 shadow-sm">Featured</Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {project.categories.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {project.categories.slice(0, 3).map((category) => (
              <Badge key={category.id} variant="secondary" className="font-normal">
                {category.name}
              </Badge>
            ))}
          </div>
        ) : null}

        <div>
          <h3 className="text-base font-semibold tracking-tight group-hover:underline">
            {project.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {project.shortDescription}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays aria-hidden className="size-3.5" />
            {date ?? "Tanpa tanggal"}
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-foreground/80 transition-colors group-hover:text-foreground">
            Lihat detail
            <ArrowUpRight aria-hidden className="size-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
