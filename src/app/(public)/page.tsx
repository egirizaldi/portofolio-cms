import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { prisma } from "@/lib/db";
import { getSiteContent } from "@/lib/site-content";
import { ProjectCard, type ProjectCardData } from "@/components/public/project-card";
import { Button } from "@/components/ui/button";

// Konten berasal dari database CMS, selalu render saat request.
export const dynamic = "force-dynamic";

const getProfile = cache(async () => {
  try {
    return await prisma.profile.findFirst();
  } catch (error) {
    console.error("Gagal membaca profil dari database:", error);
    return null;
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const [content, profile] = await Promise.all([getSiteContent(), getProfile()]);
  const description =
    content.site_description?.trim() ||
    profile?.headline?.trim() ||
    "Portofolio pribadi, proyek pilihan, dan pengalaman profesional.";

  return {
    description,
    openGraph: {
      title: content.site_title,
      description,
      type: "website",
    },
  };
}

export default async function HomePage() {
  const [content, profile] = await Promise.all([getSiteContent(), getProfile()]);
  let featuredProjects: ProjectCardData[] = [];
  try {
    featuredProjects = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 3,
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
  } catch (error) {
    console.error("Gagal membaca project dari database:", error);
  }

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
            {content.home_cta_primary}
            <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" render={<Link href="/contact" />}>
            {content.home_cta_secondary}
          </Button>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 pb-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight">
            {content.home_projects_heading}
          </h2>
          <Button variant="ghost" size="sm" render={<Link href="/projects" />}>
            {content.home_projects_link}
          </Button>
        </div>

        {featuredProjects.length === 0 ? (
          <p className="rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
            {content.home_projects_empty}
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
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
      </section>
    </div>
  );
}
