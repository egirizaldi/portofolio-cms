/** Format tanggal ke locale Indonesia. Mengembalikan null untuk nilai kosong. */
export function formatDate(
  date: Date | string | null | undefined,
  options: Intl.DateTimeFormatOptions = { dateStyle: "long" },
) {
  if (!date) return null;

  const value = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(value.getTime())) return null;

  return new Intl.DateTimeFormat("id-ID", options).format(value);
}

/** Rentang bulan/tahun, mis. "Jan 2024 – Sekarang". */
export function formatDateRange(
  startDate: Date | string | null | undefined,
  endDate: Date | string | null | undefined,
  isCurrent = false,
) {
  const start = formatDate(startDate, { month: "short", year: "numeric" });
  if (!start) return null;

  if (isCurrent || !endDate) {
    return `${start} – Sekarang`;
  }

  const end = formatDate(endDate, { month: "short", year: "numeric" });
  return end ? `${start} – ${end}` : start;
}
