import type { Metadata } from "next";
import Link from "next/link";
import { FolderSearch, Search, X } from "lucide-react";
import type { Prisma } from "@prisma/client";

import { ProjectCard } from "@/components/public/project-card";
import { Pagination } from "@/components/public/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/db";
import { getSiteContent, fillTemplate } from "@/lib/site-content";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content.projects_meta_title,
    description: content.projects_meta_description,
    openGraph: {
      title: content.projects_meta_title,
      description: content.projects_meta_description,
    },
  };
}

const PAGE_SIZE = 9;

type SearchParams = Promise<{
  q?: string | string[];
  category?: string | string[];
  page?: string | string[];
}>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildHref({
  q,
  category = "",
  page,
}: {
  q: string;
  category?: string;
  page?: number;
}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  if (page && page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? `/projects?${query}` : "/projects";
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const q = (first(resolvedSearchParams.q) ?? "").trim();
  const categorySlug = (first(resolvedSearchParams.category) ?? "").trim();
  const requestedPage = Number.parseInt(first(resolvedSearchParams.page) ?? "1", 10);
  const page =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const where: Prisma.ProjectWhereInput = {
    status: "PUBLISHED",
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { shortDescription: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(categorySlug
      ? { categories: { some: { slug: categorySlug } } }
      : {}),
  };

  const content = await getSiteContent();

  const [total, publishedTotal, categories] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: { projects: { where: { status: "PUBLISHED" } } },
        },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const projects = await prisma.project.findMany({
    where,
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
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
  });

  const activeCategory = categories.find(
    (category) => category.slug === categorySlug,
  );
  const hasFilter = Boolean(q || categorySlug);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground">
          {content.projects_eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {content.projects_heading}
        </h1>
        <p className="mt-4 text-base leading-7 text-pretty text-muted-foreground">
          {content.projects_description}
        </p>
      </header>

      <div className="mt-10 space-y-4">
        <form
          action="/projects"
          method="get"
          className="flex flex-col gap-2 sm:flex-row"
        >
          {categorySlug ? (
            <input type="hidden" name="category" value={categorySlug} />
          ) : null}

          <div className="relative flex-1">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              name="q"
              defaultValue={q}
              placeholder={content.projects_search_placeholder}
              aria-label={content.projects_search_placeholder}
              className="h-10 pl-9"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="h-10 px-4">
              {content.projects_search_button}
            </Button>
            {hasFilter ? (
              <Button
                variant="ghost"
                className="h-10"
                render={<Link href="/projects" />}
              >
                <X aria-hidden />
                {content.projects_reset_button}
              </Button>
            ) : null}
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-1.5">
          <Link
            href={buildHref({ q })}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors",
              !categorySlug
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {content.projects_all_label}
            <span className="opacity-70">{publishedTotal}</span>
          </Link>

          {categories.map((category) => {
            const active = category.slug === categorySlug;
            return (
              <Link
                key={category.id}
                href={buildHref({ q, category: category.slug })}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors",
                  active
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {category.name}
                <span className="opacity-70">{category._count.projects}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
        <p className="text-sm text-muted-foreground">
          {total === 0
            ? content.projects_empty_filter
            : fillTemplate(content.projects_count_template, {
                shown: projects.length,
                total,
              })}
          {activeCategory ? (
            <>
              {" "}
              {content.projects_category_prefix}{" "}
              <span className="font-medium text-foreground">
                {activeCategory.name}
              </span>
            </>
          ) : null}
        </p>
        {q ? (
          <p className="text-sm text-muted-foreground">
            {content.projects_search_prefix}{" "}
            <span className="font-medium text-foreground">{q}</span>
          </p>
        ) : null}
      </div>

      {projects.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed px-6 py-16 text-center">
          <FolderSearch
            aria-hidden
            className="mx-auto size-8 text-muted-foreground/50"
          />
          <h2 className="mt-4 text-base font-semibold">
            {content.projects_empty_title}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            {content.projects_empty_description}
          </p>
          <Button className="mt-5" render={<Link href="/projects" />}>
            {content.projects_empty_cta}
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              labels={{
                detail: content.project_card_detail,
                featured: content.project_featured_label,
                noDate: content.project_no_date,
              }}
            />
          ))}
        </div>
      )}

      <div className="mt-10">
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          buildHref={(targetPage) =>
            buildHref({ q, category: categorySlug, page: targetPage })
          }
        />
      </div>
    </div>
  );
}
