import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Konten dikelola lewat CMS dan dibaca per request, sehingga halaman publik
  // memakai `export const dynamic = "force-dynamic"` (tidak kompatibel dengan cacheComponents).
  cacheComponents: false,
  // Izinkan akses dev via localhost maupun 127.0.0.1 (termasuk saat testing otomatis).
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  // Izinkan gambar publik dari Supabase Storage (dipakai pada fase upload media).
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  turbopack: {
    root: path.resolve(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
