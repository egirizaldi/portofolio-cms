import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";

import { TimelineEntry } from "@/components/public/timeline-entry";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content.education_meta_title,
    description: content.education_meta_description,
    openGraph: {
      title: content.education_meta_title,
      description: content.education_meta_description,
    },
  };
}

export default async function EducationPage() {
  const [educations, content] = await Promise.all([
    prisma.education.findMany({
      orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
    }),
    getSiteContent(),
  ]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground">
          {content.education_eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {content.education_heading}
        </h1>
        <p className="mt-4 text-base leading-7 text-pretty text-muted-foreground">
          {content.education_description}
        </p>
      </header>

      <section className="mt-12">
        <div className="flex items-center gap-2">
          <GraduationCap aria-hidden className="size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold tracking-tight">
            {content.education_section_heading}
          </h2>
        </div>

        <div className="mt-6">
          {educations.length === 0 ? (
            <div className="rounded-xl border border-dashed px-6 py-14 text-center">
              <GraduationCap
                aria-hidden
                className="mx-auto size-8 text-muted-foreground/50"
              />
              <h3 className="mt-4 text-base font-semibold">
                {content.education_empty_title}
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                {content.education_empty_description}
              </p>
            </div>
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
          {content.education_cta_heading}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {content.education_cta_description}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button render={<Link href="/experience" />}>
            {content.education_cta_experience}
            <ArrowRight aria-hidden />
          </Button>
          <Button variant="outline" render={<Link href="/skills" />}>
            {content.education_cta_skills}
          </Button>
        </div>
      </div>
    </div>
  );
}
