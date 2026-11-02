import type { Metadata } from "next";

import { listCategories } from "@/lib/db/categories";
import { CategoriesManager } from "@/components/admin/categories/categories-manager";

export const metadata: Metadata = { title: "Kategori" };

export default async function CategoriesPage() {
  const categories = await listCategories();

  return (
    <CategoriesManager
      categories={categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        projectCount: category.projectCount,
      }))}
    />
  );
}
