import type { Metadata } from "next";

import { MessagesManager } from "@/components/admin/messages/messages-manager";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Pesan" };

export default async function MessagesPage() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <MessagesManager
      messages={messages.map((message) => ({
        id: message.id,
        name: message.name,
        email: message.email,
        subject: message.subject,
        message: message.message,
        status: message.status,
        createdAt: message.createdAt.toISOString(),
      }))}
    />
  );
}
