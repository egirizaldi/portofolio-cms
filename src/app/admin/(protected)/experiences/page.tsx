import type { Metadata } from "next";

import { ExperiencesManager } from "@/components/admin/experiences/experiences-manager";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Pengalaman" };

export default async function ExperiencesPage() {
  const experiences = await prisma.experience.findMany({
    orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
  });

  return (
    <ExperiencesManager
      experiences={experiences.map((experience) => ({
        id: experience.id,
        position: experience.position,
        organization: experience.organization,
        location: experience.location,
        description: experience.description,
        startDate: experience.startDate.toISOString(),
        endDate: experience.endDate?.toISOString() ?? null,
        isCurrent: experience.isCurrent,
        displayOrder: experience.displayOrder,
      }))}
    />
  );
}
