import type { Metadata } from "next";

import { CertificatesManager } from "@/components/admin/certificates/certificates-manager";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Sertifikat" };

export default async function CertificatesPage() {
  const certificates = await prisma.certificate.findMany({
    orderBy: [{ displayOrder: "asc" }, { issuedAt: "desc" }],
  });

  return (
    <CertificatesManager
      certificates={certificates.map((certificate) => ({
        id: certificate.id,
        name: certificate.name,
        issuer: certificate.issuer,
        issuedAt: certificate.issuedAt?.toISOString() ?? null,
        credentialUrl: certificate.credentialUrl,
        imagePath: certificate.imagePath,
        displayOrder: certificate.displayOrder,
      }))}
    />
  );
}
