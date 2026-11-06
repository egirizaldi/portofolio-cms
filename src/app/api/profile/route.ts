import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdminApi } from "@/lib/auth/guards";
import { profileSchema } from "@/lib/validations/profile";

/**
 * GET /api/profile
 * Ambil profil pemilik website (publik)
 */
export async function GET() {
  const profile = await prisma.profile.findFirst();

  return NextResponse.json(profile ?? {});
}

/**
 * PUT /api/profile
 * Update / Upsert profil (admin only)
 */
export async function PUT(request: Request) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  const json = await request.json();
  const result = profileSchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid input", details: result.error.format() },
      { status: 400 }
    );
  }

  const data = result.data;
  const profileData = {
    fullName: data.fullName,
    headline: data.headline || null,
    profession: data.profession || null,
    bio: data.bio || null,
    profileImage: data.profileImage || null,
    cvFile: data.cvFile || null,
    contactEmail: data.contactEmail || null,
    location: data.location || null,
    githubUrl: data.githubUrl || null,
    linkedinUrl: data.linkedinUrl || null,
    instagramUrl: data.instagramUrl || null,
    twitterUrl: data.twitterUrl || null,
    websiteUrl: data.websiteUrl || null,
  };

  const existing = await prisma.profile.findFirst();

  let profile;
  if (existing) {
    profile = await prisma.profile.update({
      where: { id: existing.id },
      data: profileData,
    });
  } else {
    profile = await prisma.profile.create({
      data: profileData,
    });
  }

  return NextResponse.json(profile);
}
