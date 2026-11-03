import type { Metadata } from "next";

import { ProjectForm } from "@/components/admin/projects/project-form";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Tambah Proyek" };

export default async function NewProjectPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return <ProjectForm categories={categories} />;
}
