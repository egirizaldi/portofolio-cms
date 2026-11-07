import type { Metadata } from "next";
import Link from "next/link";
import { BriefcaseBusiness, GraduationCap } from "lucide-react";

import { TimelineEntry } from "@/components/public/timeline-entry";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content.experience_meta_title,
    description: content.experience_meta_description,
  };
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-dashed px-5 py-10 text-center text-sm text-muted-foreground">
      {message}
    </p>
  );
}

export default async function ExperiencePage() {
  const [experiences, educations, content] = await Promise.all([
    prisma.experience.findMany({
      orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
    }),
    prisma.education.findMany({
      orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
    }),
    getSiteContent(),
  ]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground">
          {content.experience_eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {content.experience_heading}
        </h1>
        <p className="mt-4 text-base leading-7 text-pretty text-muted-foreground">
          {content.experience_description}
        </p>
      </header>

      <section className="mt-12">
        <div className="flex items-center gap-2">
          <BriefcaseBusiness aria-hidden className="size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold tracking-tight">
            {content.experience_section_heading}
          </h2>
        </div>

        <div className="mt-6">
          {experiences.length === 0 ? (
            <EmptyState message={content.experience_empty} />
          ) : (
            experiences.map((experience) => (
              <TimelineEntry
                key={experience.id}
                currentLabel={content.timeline_current}
                entry={{
                  id: experience.id,
                  title: experience.position,
                  organization: experience.organization,
                  location: experience.location,
                  description: experience.description,
                  startDate: experience.startDate,
                  endDate: experience.endDate,
                  isCurrent: experience.isCurrent,
                }}
              />
            ))
          )}
        </div>
      </section>

      <section className="mt-16 border-t pt-10">
        <div className="flex items-center gap-2">
          <GraduationCap aria-hidden className="size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold tracking-tight">
            {content.experience_education_heading}
          </h2>
        </div>

        <div className="mt-6">
          {educations.length === 0 ? (
            <EmptyState message={content.experience_education_empty} />
          ) : (
            educations.map((education) => (
              <TimelineEntry
                key={education.id}
                currentLabel={content.timeline_current}
                entry={{
                  id: education.id,
                  title: education.program,
                  organization: education.institution,
                  location: education.level,
                  description: education.description,
                  startDate: education.startDate,
                  endDate: education.endDate,
                  isCurrent: education.isCurrent,
                }}
              />
            ))
          )}
        </div>
      </section>

      <div className="mt-14 rounded-2xl border bg-muted/40 p-6 text-center sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight">
          {content.experience_cta_heading}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {content.experience_cta_description}
        </p>
        <Button className="mt-5" render={<Link href="/projects" />}>
          {content.experience_cta_button}
        </Button>
      </div>
    </div>
  );
}
