import { prisma } from "./prisma";

export type CategoryWithCount = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  projectCount: number;
};

/** Daftar kategori beserta jumlah proyek yang memakainya. */
export async function listCategories(): Promise<CategoryWithCount[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      createdAt: true,
      _count: { select: { projects: true } },
    },
  });

  return categories.map(({ _count, ...category }) => ({
    ...category,
    projectCount: _count.projects,
  }));
}

/** Statistik ringkas untuk header halaman. */
export async function getCategoryStats() {
  const [total, used] = await Promise.all([
    prisma.category.count(),
    prisma.category.count({ where: { projects: { some: {} } } }),
  ]);

  return { total, used, unused: total - used };
}
