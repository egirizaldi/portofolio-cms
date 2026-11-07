import Link from "next/link";
import type { Metadata } from "next";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getSiteContent } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content.not_found_title,
    robots: { index: false, follow: false },
  };
}

export default async function PublicNotFound() {
  const content = await getSiteContent();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-24 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl border bg-muted">
        <Compass aria-hidden className="size-5 text-muted-foreground" />
      </span>
      <p className="mt-6 text-sm font-medium text-muted-foreground">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
        {content.not_found_title}
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        {content.not_found_description}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-2">
        <Button render={<Link href="/" />}>{content.not_found_home}</Button>
        <Button variant="outline" render={<Link href="/projects" />}>
          {content.not_found_projects}
        </Button>
      </div>
    </div>
  );
}
