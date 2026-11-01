import { z } from "zod";

export const messageSchema = z.object({
  name: z.string().min(2, { error: "Nama minimal 2 karakter" }),
  email: z.string().email({ error: "Format email tidak valid" }),
  subject: z.string().min(3, { error: "Subject minimal 3 karakter" }),
  message: z.string().min(10, { error: "Pesan minimal 10 karakter" }),
});

export type MessageInput = z.infer<typeof messageSchema>;
