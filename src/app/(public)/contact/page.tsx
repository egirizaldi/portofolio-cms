import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Link2, Mail, MapPin } from "lucide-react";

import { ContactForm } from "@/components/public/contact-form";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi saya untuk diskusi proyek, kolaborasi, atau peluang kerja.",
};

export default async function ContactPage() {
  const profile = await prisma.profile.findFirst();

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
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground">Kontak</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Mari berdiskusi
        </h1>
        <p className="mt-4 text-base leading-7 text-pretty text-muted-foreground">
          Punya ide proyek, ingin berkolaborasi, atau sekadar ingin menyapa?
          Kirim pesan melalui formulir berikut.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border p-5 sm:p-6">
          <ContactForm />
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border p-5">
            <h2 className="text-sm font-semibold">Informasi kontak</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {profile?.contactEmail ? (
                <li>
                  <a
                    href={`mailto:${profile.contactEmail}`}
                    className="inline-flex items-start gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Mail aria-hidden className="mt-0.5 size-4 shrink-0" />
                    <span className="break-all">{profile.contactEmail}</span>
                  </a>
                </li>
              ) : null}
              {profile?.location ? (
                <li className="flex items-start gap-2.5 text-muted-foreground">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0" />
                  {profile.location}
                </li>
              ) : null}
              <li className="flex items-start gap-2.5 text-muted-foreground">
                <Clock aria-hidden className="mt-0.5 size-4 shrink-0" />
                Biasanya membalas dalam 1–2 hari kerja.
              </li>
            </ul>

            {socials.length > 0 ? (
              <div className="mt-5 border-t pt-4">
                <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Temukan saya
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
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
              </div>
            ) : null}
          </div>

          <div className="rounded-xl border bg-muted/40 p-5">
            <h2 className="text-sm font-semibold">Sedang mencari developer?</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Lihat dulu proyek dan pengalaman saya. Jika cocok, ceritakan
              kebutuhan Anda melalui formulir.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              render={<Link href="/projects" />}
            >
              Lihat proyek
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
