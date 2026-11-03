import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Jika CMS dinonaktifkan (default di Vercel / Production)
  if (process.env.CMS_ENABLED !== "true") {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "CMS disabled" }, { status: 404 });
    }

    if (pathname.startsWith("/admin")) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
