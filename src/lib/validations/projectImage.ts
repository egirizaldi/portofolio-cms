import { z } from "zod";

/**
 * Validation schema for project image metadata (used in PUT /api/images/[id]).
 *
 * - `altText`  : optional string, trimmed, max 200 chars.
 * - `displayOrder` : optional integer >= 0.
 */
export const projectImageSchema = z.object({
  altText: z
    .string()
    .trim()
    .max(200, { error: "Alt text maksimal 200 karakter." })
    .optional()
    .or(z.literal("")),
  displayOrder: z
    .number()
    .int({ error: "Display order harus bilangan bulat." })
    .min(0, { error: "Display order tidak boleh negatif." })
    .optional(),
});

export type ProjectImageInput = z.infer<typeof projectImageSchema>;
