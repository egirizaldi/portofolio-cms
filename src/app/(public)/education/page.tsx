import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";

import { TimelineEntry } from "@/components/public/timeline-entry";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pendidikan",
  description: "Riwayat pendidikan",
  openGraph: {
    title: "Pendidikan",
    description: "Riwayat pendidikan.",
  },
};

export default async function EducationPage() {
  const educations = await prisma.education.findMany({
    orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
  });

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground">Akademik</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Riwayat pendidikan
        </h1>
        <p className="mt-4 text-base leading-7 text-pretty text-muted-foreground">
          Latar belakang akademik yang menjadi fondasi cara saya belajar dan
          membangun produk.
        </p>
      </header>

      <section className="mt-12">
        <div className="flex items-center gap-2">
          <GraduationCap aria-hidden className="size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold tracking-tight">Pendidikan</h2>
        </div>

        <div className="mt-6">
          {educations.length === 0 ? (
            <div className="rounded-xl border border-dashed px-6 py-14 text-center">
              <GraduationCap
                aria-hidden
                className="mx-auto size-8 text-muted-foreground/50"
              />
              <h3 className="mt-4 text-base font-semibold">
                Belum ada riwayat pendidikan
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Riwayat pendidikan yang ditambahkan melalui dashboard akan muncul
                di sini.
              </p>
            </div>
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
          Ingin melihat pengalaman kerja?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Selain pendidikan, saya juga punya rekam jejak profesional yang bisa
          Anda telusuri.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button render={<Link href="/experience" />}>
            Lihat pengalaman
            <ArrowRight aria-hidden />
          </Button>
          <Button variant="outline" render={<Link href="/skills" />}>
            Lihat skills
          </Button>
        </div>
      </div>
    </div>
  );
}
