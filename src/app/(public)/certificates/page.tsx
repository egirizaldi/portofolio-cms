import type { Metadata } from "next";
import Link from "next/link";
import { Award } from "lucide-react";

import { CertificateCard } from "@/components/public/certificate-card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sertifikat",
  description: "Sertifikat dan kredensial profesional yang telah saya peroleh.",
};

export default async function CertificatesPage() {
  const certificates = await prisma.certificate.findMany({
    orderBy: [{ displayOrder: "asc" }, { issuedAt: "desc" }],
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground">Kredensial</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Sertifikat
        </h1>
        <p className="mt-4 text-base leading-7 text-pretty text-muted-foreground">
          Kumpulan sertifikat, pelatihan, dan kredensial yang mendukung keahlian
          saya.
        </p>
      </header>

      {certificates.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed px-6 py-16 text-center">
          <Award aria-hidden className="mx-auto size-8 text-muted-foreground/50" />
          <h2 className="mt-4 text-base font-semibold">
            Belum ada sertifikat
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Sertifikat yang ditambahkan melalui dashboard akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </div>
      )}

      <div className="mt-14 rounded-2xl border bg-muted/40 p-6 text-center sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight">
          Tertarik bekerja sama?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Lihat proyek yang sudah saya kerjakan atau hubungi saya untuk
          berdiskusi.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button render={<Link href="/projects" />}>Lihat proyek</Button>
          <Button variant="outline" render={<Link href="/contact" />}>
            Hubungi saya
          </Button>
        </div>
      </div>
    </div>
  );
}
