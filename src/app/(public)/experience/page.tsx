import type { Metadata } from "next";
import Link from "next/link";
import { BriefcaseBusiness, GraduationCap } from "lucide-react";

import { TimelineEntry } from "@/components/public/timeline-entry";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pengalaman",
  description: "Riwayat pengalaman kerja, organisasi, dan pendidikan saya.",
};

function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-dashed px-5 py-10 text-center text-sm text-muted-foreground">
      {message}
    </p>
  );
}

export default async function ExperiencePage() {
  const [experiences, educations] = await Promise.all([
    prisma.experience.findMany({
      orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
    }),
    prisma.education.findMany({
      orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
    }),
  ]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground">Perjalanan</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Pengalaman &amp; pendidikan
        </h1>
        <p className="mt-4 text-base leading-7 text-pretty text-muted-foreground">
          Rekam jejak profesional dan latar belakang akademik yang membentuk cara
          saya membangun produk.
        </p>
      </header>

      <section className="mt-12">
        <div className="flex items-center gap-2">
          <BriefcaseBusiness aria-hidden className="size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold tracking-tight">Pengalaman</h2>
        </div>

        <div className="mt-6">
          {experiences.length === 0 ? (
            <EmptyState message="Belum ada pengalaman yang ditambahkan." />
          ) : (
            experiences.map((experience) => (
              <TimelineEntry
                key={experience.id}
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
          <h2 className="text-xl font-semibold tracking-tight">Pendidikan</h2>
        </div>

        <div className="mt-6">
          {educations.length === 0 ? (
            <EmptyState message="Belum ada riwayat pendidikan yang ditambahkan." />
          ) : (
            educations.map((education) => (
              <TimelineEntry
                key={education.id}
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
          Ingin melihat hasil kerjanya?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Beberapa proyek pilihan sudah saya dokumentasikan lengkap dengan
          teknologi dan tautannya.
        </p>
        <Button className="mt-5" render={<Link href="/projects" />}>
          Jelajahi proyek
        </Button>
      </div>
    </div>
  );
}
