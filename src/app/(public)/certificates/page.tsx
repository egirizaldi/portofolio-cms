import type { Metadata } from "next";
import Link from "next/link";
import { Award } from "lucide-react";

import { CertificateCard } from "@/components/public/certificate-card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content.certificates_meta_title,
    description: content.certificates_meta_description,
  };
}

export default async function CertificatesPage() {
  const [certificates, content] = await Promise.all([
    prisma.certificate.findMany({
      orderBy: [{ displayOrder: "asc" }, { issuedAt: "desc" }],
    }),
    getSiteContent(),
  ]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground">
          {content.certificates_eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {content.certificates_heading}
        </h1>
        <p className="mt-4 text-base leading-7 text-pretty text-muted-foreground">
          {content.certificates_description}
        </p>
      </header>

      {certificates.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed px-6 py-16 text-center">
          <Award aria-hidden className="mx-auto size-8 text-muted-foreground/50" />
          <h2 className="mt-4 text-base font-semibold">
            {content.certificates_empty_title}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            {content.certificates_empty_description}
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              credentialLabel={content.certificate_card_credential}
            />
          ))}
        </div>
      )}

      <div className="mt-14 rounded-2xl border bg-muted/40 p-6 text-center sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight">
          {content.certificates_cta_heading}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {content.certificates_cta_description}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button render={<Link href="/projects" />}>
            {content.certificates_cta_projects}
          </Button>
          <Button variant="outline" render={<Link href="/contact" />}>
            {content.certificates_cta_contact}
          </Button>
        </div>
      </div>
    </div>
  );
}
