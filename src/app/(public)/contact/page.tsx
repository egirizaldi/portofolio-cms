import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Link2, Mail, MapPin } from "lucide-react";

import { ContactForm } from "@/components/public/contact-form";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content.contact_meta_title,
    description: content.contact_meta_description,
  };
}

export default async function ContactPage() {
  const [profile, content] = await Promise.all([
    prisma.profile.findFirst(),
    getSiteContent(),
  ]);
  const contactEmail = profile?.contactEmail?.trim() || content.contact_email;

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
        <p className="text-sm font-medium text-muted-foreground">
          {content.contact_eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {content.contact_heading}
        </h1>
        <p className="mt-4 text-base leading-7 text-pretty text-muted-foreground">
          {content.contact_description}
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border p-5 sm:p-6">
          <ContactForm
            labels={{
              nameLabel: content.contact_form_name_label,
              namePlaceholder: content.contact_form_name_placeholder,
              emailLabel: content.contact_form_email_label,
              emailPlaceholder: content.contact_form_email_placeholder,
              subjectLabel: content.contact_form_subject_label,
              subjectPlaceholder: content.contact_form_subject_placeholder,
              messageLabel: content.contact_form_message_label,
              messagePlaceholder: content.contact_form_message_placeholder,
              submit: content.contact_form_submit,
              submitting: content.contact_form_submitting,
              successTitle: content.contact_form_success_title,
              successMessage: content.contact_form_success_message,
              sendAnother: content.contact_form_send_another,
              errorFallback: content.contact_form_error_fallback,
              networkError: content.contact_form_network_error,
            }}
          />
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border p-5">
            <h2 className="text-sm font-semibold">
              {content.contact_info_heading}
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {contactEmail ? (
                <li>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="inline-flex items-start gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Mail aria-hidden className="mt-0.5 size-4 shrink-0" />
                    <span className="break-all">{contactEmail}</span>
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
                {content.contact_response_time}
              </li>
            </ul>

            {socials.length > 0 ? (
              <div className="mt-5 border-t pt-4">
                <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {content.contact_social_heading}
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
            <h2 className="text-sm font-semibold">
              {content.contact_hire_heading}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {content.contact_hire_description}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              render={<Link href="/projects" />}
            >
              {content.contact_hire_cta}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
