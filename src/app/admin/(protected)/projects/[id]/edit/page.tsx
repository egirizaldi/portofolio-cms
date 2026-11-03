import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectForm } from "@/components/admin/projects/project-form";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Edit Proyek" };

type EditProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;

  const [project, categories] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: { categories: { select: { id: true, name: true } } },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <ProjectForm
      categories={categories}
      project={{
        id: project.id,
        title: project.title,
        slug: project.slug,
        shortDescription: project.shortDescription,
        description: project.description,
        thumbnail: project.thumbnail,
        technologies: project.technologies,
        demoUrl: project.demoUrl,
        githubUrl: project.githubUrl,
        projectDate: project.projectDate?.toISOString().slice(0, 10) ?? "",
        isFeatured: project.isFeatured,
        status: project.status,
        categoryIds: project.categories.map((category) => category.id),
      }}
    />
  );
}
