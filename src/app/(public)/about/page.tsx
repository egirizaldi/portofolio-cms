import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Link2,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";

import { TimelineEntry } from "@/components/public/timeline-entry";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { resolveImageSrc } from "@/lib/media";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tentang",
  description:
    "Profil singkat, keahlian, pengalaman, dan latar belakang pendidikan saya.",
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default async function AboutPage() {
  const [profile, skills, experiences, educations] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.skill.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    }),
    prisma.experience.findMany({
      orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
      take: 4,
    }),
    prisma.education.findMany({
      orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
      take: 3,
    }),
  ]);

  const profileImage = resolveImageSrc(profile?.profileImage);
  const name = profile?.fullName ?? "Nama Lengkap";

  const skillGroups = new Map<string, typeof skills>();
  for (const skill of skills) {
    const group = skill.groupName?.trim() || "Lainnya";
    const current = skillGroups.get(group) ?? [];
    current.push(skill);
    skillGroups.set(group, current);
  }

  const socials = [
    { label: "GitHub", href: profile?.githubUrl },
    { label: "LinkedIn", href: profile?.linkedinUrl },
    { label: "Instagram", href: profile?.instagramUrl },
    { label: "Twitter", href: profile?.twitterUrl },
    { label: "Website", href: profile?.websiteUrl },
  ].filter(
    (social): social is { label: string; href: string } =>
      Boolean(social.href?.trim()),
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:py-20">
      <section className="grid items-start gap-10 md:grid-cols-[260px_minmax(0,1fr)]">
        <div className="mx-auto w-full max-w-[260px] md:mx-0">
          <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={name}
                fill
                priority
                unoptimized
                sizes="260px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,var(--muted),color-mix(in_oklch,var(--muted),var(--foreground)_8%))]">
                <span className="text-4xl font-semibold text-muted-foreground/60">
                  {initials(name) || "AD"}
                </span>
              </div>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {profile?.profession ?? "Web Developer"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {name}
          </h1>
          {profile?.headline ? (
            <p className="mt-3 text-lg leading-8 text-pretty text-muted-foreground">
              {profile.headline}
            </p>
          ) : null}
          {profile?.bio ? (
            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-muted-foreground">
              {profile.bio}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {profile?.location ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin aria-hidden className="size-4" />
                {profile.location}
              </span>
            ) : null}
            {profile?.contactEmail ? (
              <a
                href={`mailto:${profile.contactEmail}`}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <Mail aria-hidden className="size-4" />
                {profile.contactEmail}
              </a>
            ) : null}
          </div>

          {socials.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {socials.map((social) => (
                <Button
                  key={social.label}
                  variant="outline"
                  size="sm"
                  render={
                    <a href={social.href} target="_blank" rel="noreferrer" />
                  }
                >
                  <Link2 aria-hidden />
                  {social.label}
                </Button>
              ))}
            </div>
          ) : null}

          <div className="mt-7 flex flex-wrap gap-2">
            <Button render={<Link href="/projects" />}>
              Lihat proyek
              <ArrowRight aria-hidden />
            </Button>
            {profile?.cvFile ? (
              <Button
                variant="outline"
                render={
                  <a href={profile.cvFile} target="_blank" rel="noreferrer" />
                }
              >
                Unduh CV
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      {skillGroups.size > 0 ? (
        <section className="mt-16 border-t pt-10">
          <div className="flex items-center gap-2">
            <Sparkles aria-hidden className="size-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold tracking-tight">Keahlian</h2>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {[...skillGroups.entries()].map(([group, items]) => (
              <div key={group} className="rounded-xl border p-5">
                <h3 className="text-sm font-semibold">{group}</h3>
                <ul className="mt-4 space-y-3">
                  {items.map((skill) => (
                    <li key={skill.id}>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span>{skill.name}</span>
                        {typeof skill.level === "number" ? (
                          <span className="text-xs text-muted-foreground">
                            {skill.level}%
                          </span>
                        ) : null}
                      </div>
                      {typeof skill.level === "number" ? (
                        <div
                          className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted"
                          role="progressbar"
                          aria-valuenow={skill.level}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Tingkat ${skill.name}`}
                        >
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {experiences.length > 0 ? (
        <section className="mt-16 border-t pt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-center gap-2">
              <BriefcaseBusiness
                aria-hidden
                className="size-5 text-muted-foreground"
              />
              <h2 className="text-xl font-semibold tracking-tight">
                Pengalaman
              </h2>
            </div>
            <Button variant="ghost" size="sm" render={<Link href="/experience" />}>
              Lihat semua
              <ArrowRight aria-hidden />
            </Button>
          </div>

          <div className="mt-6">
            {experiences.map((experience) => (
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
            ))}
          </div>
        </section>
      ) : null}

      {educations.length > 0 ? (
        <section className="mt-16 border-t pt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-center gap-2">
              <GraduationCap
                aria-hidden
                className="size-5 text-muted-foreground"
              />
              <h2 className="text-xl font-semibold tracking-tight">
                Pendidikan
              </h2>
            </div>
            <Button variant="ghost" size="sm" render={<Link href="/experience" />}>
              Lihat semua
              <ArrowRight aria-hidden />
            </Button>
          </div>

          <div className="mt-6">
            {educations.map((education) => (
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
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
