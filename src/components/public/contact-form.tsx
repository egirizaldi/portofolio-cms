"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormState = {
  status: "idle" | "submitting" | "success" | "error";
  message?: string;
};

export function ContactForm() {
  const [state, setState] = useState<FormState>({ status: "idle" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setState({ status: "submitting" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
          website: formData.get("website"),
        }),
      });

      const body = (await response.json().catch(() => null)) as
        | { error?: string | { message?: string } }
        | null;

      if (!response.ok) {
        const apiError = body?.error;
        setState({
          status: "error",
          message:
            (typeof apiError === "string" ? apiError : apiError?.message) ??
            "Pesan gagal dikirim. Silakan coba lagi beberapa saat lagi.",
        });
        return;
      }

      form.reset();
      setState({
        status: "success",
        message:
          "Pesan berhasil dikirim. Terima kasih, saya akan membalas secepatnya.",
      });
    } catch {
      setState({
        status: "error",
        message:
          "Tidak dapat menghubungi server. Periksa koneksi Anda lalu coba lagi.",
      });
    }
  }

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-xl border bg-muted/40 p-6 text-sm leading-6"
      >
        <p className="font-medium text-foreground">Pesan terkirim</p>
        <p className="mt-1 text-muted-foreground">{state.message}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setState({ status: "idle" })}
        >
          Kirim pesan lain
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="contact-name">Nama</Label>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            placeholder="Nama Anda"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="nama@email.com"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-subject">Subjek</Label>
        <Input
          id="contact-subject"
          name="subject"
          required
          minLength={3}
          placeholder="Ada yang bisa saya bantu?"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-message">Pesan</Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          rows={6}
          placeholder="Ceritakan proyek atau ide yang ingin Anda diskusikan..."
        />
      </div>

      <div className="hidden" aria-hidden>
        <Label htmlFor="contact-website">Website</Label>
        <Input
          id="contact-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state.status === "error" ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={state.status === "submitting"}>
        {state.status === "submitting" ? (
          <Loader2 aria-hidden className="animate-spin" />
        ) : (
          <Send aria-hidden />
        )}
        {state.status === "submitting" ? "Mengirim..." : "Kirim pesan"}
      </Button>
    </form>
  );
}
