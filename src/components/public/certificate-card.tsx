import Image from "next/image";
import { Award, ExternalLink, ImageIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { resolveImageSrc } from "@/lib/media";

export type CertificateCardData = {
  id: string;
  name: string;
  issuer: string;
  issuedAt: Date | null;
  credentialUrl: string | null;
  imagePath: string | null;
};

export function CertificateCard({
  certificate,
  credentialLabel = "Lihat kredensial",
}: {
  certificate: CertificateCardData;
  credentialLabel?: string;
}) {
  const image = resolveImageSrc(certificate.imagePath);
  const issued = formatDate(certificate.issuedAt, {
    month: "long",
    year: "numeric",
  });

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border bg-card">
      <div className="relative aspect-[4/3] bg-muted">
        {image ? (
          <Image
            src={image}
            alt={certificate.name}
            fill
            unoptimized
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,var(--muted),color-mix(in_oklch,var(--muted),var(--foreground)_6%))]">
            <ImageIcon aria-hidden className="size-8 text-muted-foreground/40" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start gap-2">
          <Award aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div>
            <h3 className="text-sm font-semibold tracking-tight">
              {certificate.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {certificate.issuer}
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
          {issued ? (
            <Badge variant="secondary" className="font-normal">
              {issued}
            </Badge>
          ) : (
            <span />
          )}

          {certificate.credentialUrl ? (
            <Button
              variant="ghost"
              size="sm"
              render={
                <a
                  href={certificate.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                />
              }
            >
              {credentialLabel}
              <ExternalLink aria-hidden />
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
