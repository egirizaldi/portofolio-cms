import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Skills",
  description: "Daftar keahlian teknis dan non-teknis",
  openGraph: {
    title: "Skills",
    description: "Daftar keahlian teknis dan non-teknis.",
  },
};

/** Level disimpan 1–10; nilai lama yang memakai skala 0–100 tetap aman. */
function levelPercent(level: number) {
  const value = level > 10 ? level : level * 10;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export default async function SkillsPage() {
  const skills = await prisma.skill.findMany({
    where: { isActive: true },
    orderBy: [{ groupName: "asc" }, { displayOrder: "asc" }],
  });

  const groups = new Map<string, typeof skills>();
  for (const skill of skills) {
    const group = skill.groupName?.trim() || "Lainnya";
    const current = groups.get(group) ?? [];
    current.push(skill);
    groups.set(group, current);
  }

  const groupEntries = [...groups.entries()].sort(([left], [right]) => {
    if (left === "Lainnya") return 1;
    if (right === "Lainnya") return -1;
    return left.localeCompare(right, "id");
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground">Keahlian</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Skills &amp; kemampuan
        </h1>
        <p className="mt-4 text-base leading-7 text-pretty text-muted-foreground">
          Kumpulan keahlian yang saya gunakan untuk merancang, membangun, dan
          merawat produk digital.
        </p>
      </header>

      {groups.size === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed px-6 py-16 text-center">
          <Sparkles
            aria-hidden
            className="mx-auto size-8 text-muted-foreground/50"
          />
          <h2 className="mt-4 text-base font-semibold">Belum ada skill</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Keahlian yang ditambahkan melalui dashboard akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          {groupEntries.map(([group, items]) => (
            <section key={group}>
              <div className="flex items-center gap-2">
                <Sparkles
                  aria-hidden
                  className="size-4 text-muted-foreground"
                />
                <h2 className="text-lg font-semibold tracking-tight">
                  {group}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {items.length} skill
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((skill) => {
                  const percent =
                    typeof skill.level === "number"
                      ? levelPercent(skill.level)
                      : null;

                  return (
                    <article
                      key={skill.id}
                      className="rounded-xl border bg-card p-4"
                    >
                      <div className="flex items-center gap-2">
                        {skill.icon ? (
                          <span
                            aria-hidden
                            className="text-base leading-none"
                          >
                            {skill.icon}
                          </span>
                        ) : null}
                        <h3 className="min-w-0 flex-1 truncate text-sm font-medium">
                          {skill.name}
                        </h3>
                        {typeof skill.level === "number" ? (
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {skill.level > 10 ? `${skill.level}%` : `${skill.level}/10`}
                          </span>
                        ) : null}
                      </div>

                      {percent !== null ? (
                        <div
                          className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
                          role="progressbar"
                          aria-valuenow={percent}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Tingkat ${skill.name}`}
                        >
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="mt-14 flex flex-col items-center gap-3 rounded-2xl border bg-muted/40 p-6 text-center sm:flex-row sm:justify-between sm:p-8 sm:text-left">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Lihat penerapannya
          </h2>
          <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
            Keahlian ini saya pakai untuk membangun proyek nyata. Jelajahi
            portofolio untuk melihat hasilnya.
          </p>
        </div>
        <Button render={<Link href="/projects" />}>
          Lihat proyek
          <ArrowRight aria-hidden />
        </Button>
      </div>
    </div>
  );
}
