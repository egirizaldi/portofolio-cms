/**
 * Mengembalikan path gambar yang layak ditampilkan.
 * Seed lama memakai `/uploads/.gitkeep` sebagai placeholder, jadi nilai itu
 * (dan string kosong) dianggap tidak punya gambar.
 */
export function resolveImageSrc(src: string | null | undefined) {
  const value = src?.trim();
  if (!value) return null;
  if (value.endsWith(".gitkeep")) return null;
  return value;
}
