import type { Metadata } from "next";

import { ProjectsTable } from "@/components/admin/projects/projects-table";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Proyek" };

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: {
      categories: { select: { id: true, name: true } },
    },
    orderBy: [{ updatedAt: "desc" }],
  });

  return (
    <ProjectsTable
      projects={projects.map((project) => ({
        id: project.id,
        title: project.title,
        slug: project.slug,
        thumbnail: project.thumbnail,
        status: project.status,
        isFeatured: project.isFeatured,
        createdAt: project.createdAt.toISOString(),
        categories: project.categories,
      }))}
    />
  );
}
