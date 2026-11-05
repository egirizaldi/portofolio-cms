// Modul ini hanya boleh diimpor dari server (route handler / server action).
// Jangan diimpor dari komponen klien karena memakai service role key.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_BUCKET = "portfolio";

let adminClient: SupabaseClient | null = null;

/** True jika URL project dan service role key tersedia. */
export function isStorageConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function getStorageBucket(): string {
  return process.env.SUPABASE_STORAGE_BUCKET?.trim() || DEFAULT_BUCKET;
}

/**
 * Klien Supabase dengan service role key. HANYA dipakai di server untuk
 * membuat signed upload URL. Jangan pernah diimpor dari komponen klien.
 */
export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase Storage belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  if (!adminClient) {
    adminClient = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return adminClient;
}

/** URL publik objek di bucket (bucket harus public-read). */
export function getPublicStorageUrl(objectPath: string): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL belum diisi.");
  }

  const base = url.replace(/\/+$/, "");
  const path = objectPath.replace(/^\/+/, "");

  return `${base}/storage/v1/object/public/${getStorageBucket()}/${path}`;
}
