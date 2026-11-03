import type { Metadata } from "next";

import { EducationsManager } from "@/components/admin/educations/educations-manager";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Pendidikan" };

export default async function EducationsPage() {
  const educations = await prisma.education.findMany({
    orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
  });

  return (
    <EducationsManager
      educations={educations.map((education) => ({
        id: education.id,
        institution: education.institution,
        program: education.program,
        level: education.level,
        description: education.description,
        startDate: education.startDate.toISOString(),
        endDate: education.endDate?.toISOString() ?? null,
        isCurrent: education.isCurrent,
        displayOrder: education.displayOrder,
      }))}
    />
  );
}
