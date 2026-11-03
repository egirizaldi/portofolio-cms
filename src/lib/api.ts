/**
 * Helper kecil untuk berkomunikasi dengan Route Handlers.
 * API mengembalikan error dalam bentuk `{ error, details }`; helper ini
 * mengambil pesan pertama yang bisa ditampilkan ke pengguna.
 */
export type ApiErrorPayload = {
  error?: unknown;
  details?: unknown;
};

function firstFieldMessage(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const errors = record._errors;

  if (Array.isArray(errors) && typeof errors[0] === "string") {
    return errors[0];
  }

  for (const nested of Object.values(record)) {
    const message = firstFieldMessage(nested);
    if (message) return message;
  }

  return null;
}

/** Ambil pesan error yang ramah dari payload API (atau fallback). */
export function getApiErrorMessage(
  payload: unknown,
  fallback = "Terjadi kesalahan. Silakan coba lagi.",
) {
  if (!payload || typeof payload !== "object") return fallback;

  const fieldMessage = firstFieldMessage(
    (payload as ApiErrorPayload).details,
  );
  if (fieldMessage) return fieldMessage;

  const error = (payload as ApiErrorPayload).error;
  if (typeof error === "string" && error.trim()) return error;

  return fallback;
}

/** Parse JSON tanpa melempar error saat body kosong / bukan JSON. */
export async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/** Normalisasi error jaringan agar pesan toast tetap informatif. */
export function getNetworkErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return "Tidak dapat terhubung ke server.";
}
