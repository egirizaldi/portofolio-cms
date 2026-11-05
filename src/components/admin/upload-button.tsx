"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  getApiErrorMessage,
  getNetworkErrorMessage,
  readJson,
} from "@/lib/api";
import { getSupabaseBrowser } from "@/lib/storage/supabase-browser";
import {
  getAllowedMimeTypes,
  getMaxUploadSize,
  validateUploadMetadata,
  type SignedUploadResponse,
  type UploadType,
} from "@/lib/validations/upload";

type UploadButtonProps = {
  type: UploadType;
  label?: string;
  /** Override atribut `accept`; default mengikuti tipe upload. */
  accept?: string;
  disabled?: boolean;
  onUploaded: (publicUrl: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
};

const DEFAULT_LABELS: Record<UploadType, string> = {
  profile: "Upload Foto",
  thumbnail: "Upload Thumbnail",
  gallery: "Upload Gambar",
  certificate: "Upload Gambar",
  cv: "Upload CV",
};

export function UploadButton({
  type,
  label,
  accept,
  disabled,
  onUploaded,
  onUploadingChange,
}: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const acceptValue = accept ?? getAllowedMimeTypes(type).join(",");
  const maxSizeLabel = `${Math.round(getMaxUploadSize(type) / (1024 * 1024))} MB`;

  function setUploading(value: boolean) {
    setIsUploading(value);
    onUploadingChange?.(value);
  }

  async function uploadFile(file: File) {
    const metadataError = validateUploadMetadata({
      type,
      mimeType: file.type,
      size: file.size,
    });

    if (metadataError) {
      toast.error("Berkas tidak valid", { description: metadataError });
      return;
    }

    setUploading(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          filename: file.name,
          mimeType: file.type,
          size: file.size,
        }),
      });
      const payload = await readJson(response);

      if (!response.ok) {
        toast.error("Gagal mengunggah berkas", {
          description: getApiErrorMessage(payload),
        });
        return;
      }

      const signed = payload as SignedUploadResponse;
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.storage
        .from(signed.bucket)
        .uploadToSignedUrl(signed.path, signed.token, file, {
          contentType: file.type,
        });

      if (error) {
        toast.error("Gagal mengunggah berkas", {
          description: error.message,
        });
        return;
      }

      onUploaded(signed.publicUrl);
      toast.success("Berkas berhasil diunggah.");
    } catch (error) {
      toast.error("Gagal mengunggah berkas", {
        description: getNetworkErrorMessage(error),
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={acceptValue}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          // Reset agar berkas yang sama bisa dipilih ulang.
          event.target.value = "";
          if (file) {
            void uploadFile(file);
          }
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || isUploading}
        title={`Maksimal ${maxSizeLabel}`}
        onClick={() => inputRef.current?.click()}
      >
        {isUploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Upload className="size-4" />
        )}
        {isUploading ? "Mengunggah..." : (label ?? DEFAULT_LABELS[type])}
      </Button>
    </>
  );
}
