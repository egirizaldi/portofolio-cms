"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { categorySchema } from "@/lib/validations/category";

export type CategoryActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};


function revalidateCategories() {
  revalidatePath("/admin/categories");
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
}

/** Pesan ramah untuk pelanggaran unique constraint. */
function uniqueErrorMessage(error: Prisma.PrismaClientKnownRequestError) {
  const target = Array.isArray(error.meta?.target)
    ? (error.meta.target as string[])
    : [];

  if (target.includes("name")) return "Nama kategori sudah dipakai.";
  if (target.includes("slug")) return "Slug sudah dipakai kategori lain.";
  return "Nama atau slug sudah dipakai.";
}

export async function saveCategoryAction(
  _prevState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  await requireAdmin();

  const id = formData.get("id");
  const isUpdate = typeof id === "string" && id.length > 0;

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data yang diisi.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const data = {
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description?.trim() ? parsed.data.description : null,
  };

  try {
    if (isUpdate) {
      await prisma.category.update({ where: { id: id as string }, data });
    } else {
      await prisma.category.create({ data });
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { status: "error", message: uniqueErrorMessage(error) };
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { status: "error", message: "Kategori tidak ditemukan." };
    }
    console.error("saveCategoryAction", error);
    return { status: "error", message: "Gagal menyimpan kategori." };
  }

  revalidateCategories();

  return {
    status: "success",
    message: isUpdate ? "Kategori diperbarui." : "Kategori ditambahkan.",
  };
}

export async function deleteCategoryAction(
  _prevState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) {
    return { status: "error", message: "Kategori tidak valid." };
  }

  try {
    // Relasi many-to-many ikut dibersihkan; proyek tetap ada.
    await prisma.category.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { status: "error", message: "Kategori tidak ditemukan." };
    }
    console.error("deleteCategoryAction", error);
    return { status: "error", message: "Gagal menghapus kategori." };
  }

  revalidateCategories();
  return { status: "success", message: "Kategori dihapus." };
}
