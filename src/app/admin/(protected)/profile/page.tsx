import type { Metadata } from "next";

import { ProfileForm } from "@/components/admin/profile/profile-form";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Profil" };

export default async function ProfilePage() {
  const profile = await prisma.profile.findFirst();

  return (
    <ProfileForm
      profile={{
        fullName: profile?.fullName ?? "",
        headline: profile?.headline ?? "",
        profession: profile?.profession ?? "",
        bio: profile?.bio ?? "",
        profileImage: profile?.profileImage ?? "",
        cvFile: profile?.cvFile ?? "",
        contactEmail: profile?.contactEmail ?? "",
        location: profile?.location ?? "",
        githubUrl: profile?.githubUrl ?? "",
        linkedinUrl: profile?.linkedinUrl ?? "",
        instagramUrl: profile?.instagramUrl ?? "",
        twitterUrl: profile?.twitterUrl ?? "",
        websiteUrl: profile?.websiteUrl ?? "",
      }}
    />
  );
}
