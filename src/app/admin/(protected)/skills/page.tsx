import type { Metadata } from "next";

import { SkillsManager } from "@/components/admin/skills/skills-manager";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Keahlian" };

export default async function SkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ groupName: "asc" }, { displayOrder: "asc" }],
  });

  return (
    <SkillsManager
      skills={skills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        groupName: skill.groupName,
        level: skill.level,
        icon: skill.icon,
        isActive: skill.isActive,
        displayOrder: skill.displayOrder,
      }))}
    />
  );
}
