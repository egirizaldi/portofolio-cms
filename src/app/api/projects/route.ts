// API routes untuk Project (public GET & admin POST)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { projectSchema } from "@/lib/validations/project";
import { requireAdmin } from "@/lib/auth/guards";
import { Prisma } from "@prisma/client";

/**
 * GET /api/projects
 * - Tanpa query param: mengembalikan semua project (untuk admin).
 * - Dengan `status=PUBLISHED` atau `public=true`: hanya project yang dipublikasikan.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const isPublic = url.searchParams.get("public") === "true" || url.searchParams.get("status") === "PUBLISHED";

  // Pagination & validation
  const page = Math.max(parseInt(url.searchParams.get("page") ?? "1"), 1);
  const rawLimit = parseInt(url.searchParams.get("limit") ?? "20");
  const limit = Math.min(Math.max(rawLimit, 1), 100); // max 100

  const search = url.searchParams.get("search")?.trim();
  const categoryId = url.searchParams.get("categoryId");

  const where: Prisma.ProjectWhereInput = isPublic ? { status: "PUBLISHED" as const } : {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { shortDescription: { contains: search, mode: "insensitive" } },
    ];
  }
  if (categoryId) {
    where.categories = { some: { id: categoryId } };
  }

  const projects = await prisma.project.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      categories: { select: { id: true, name: true } },
      images: { select: { id: true, imagePath: true, altText: true, displayOrder: true } },
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  const total = await prisma.project.count({ where });
  return NextResponse.json({ data: projects, meta: { page, limit, total } });
}

/**
 * POST /api/projects
 * - Hanya dapat diakses admin (session required).
 * - Body harus sesuai `projectSchema`.
 * - `categoryIds` diproses menjadi relasi many‑to‑many.
 */
export async function POST(request: Request) {
  // Pastikan admin sudah login
  await requireAdmin();

  const json = await request.json();
  const result = projectSchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
  }
  const data = result.data;

  const { categoryIds, ...projectData } = data;

  const created = await prisma.project.create({
    data: {
      ...projectData,
      demoUrl: projectData.demoUrl || null,
      githubUrl: projectData.githubUrl || null,
      projectDate: projectData.projectDate
        ? new Date(projectData.projectDate)
        : null,
      categories: {
        connect: categoryIds.map((id) => ({ id })),
      },
    },
    include: { categories: true },
  }).catch((error) => {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return null;
    }
    throw error;
  });

  if (!created) {
    return NextResponse.json(
      { error: "Slug sudah dipakai proyek lain. Gunakan slug berbeda." },
      { status: 409 },
    );
  }

  return NextResponse.json(created, { status: 201 });
}
