import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import {
  SETTING_KEYS,
  singleSettingSchema,
  SingleSettingInput,
} from "@/lib/validations/settings";

/**
 * GET /api/settings
 * Ambil semua settings sebagai object { key: value } (publik)
 */
export async function GET() {
  const settings = await prisma.setting.findMany();
  const settingsObj: Record<string, string> = {};

  for (const item of settings) {
    settingsObj[item.key] = item.value;
  }

  return NextResponse.json(settingsObj);
}

/**
 * PUT /api/settings
 * Update satu atau banyak setting sekaligus (admin only)
 * Support array [{ key, value }], single { key, value }, atau object { [key]: value }
 */
export async function PUT(request: Request) {
  await requireAdmin();

  const json = await request.json();
  const itemsToUpdate: SingleSettingInput[] = [];

  if (Array.isArray(json)) {
    for (const item of json) {
      const parsed = singleSettingSchema.safeParse(item);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid input", details: parsed.error.format() },
          { status: 400 }
        );
      }
      itemsToUpdate.push(parsed.data);
    }
  } else if (typeof json === "object" && json !== null) {
    if ("key" in json && "value" in json) {
      const parsed = singleSettingSchema.safeParse(json);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid input", details: parsed.error.format() },
          { status: 400 }
        );
      }
      itemsToUpdate.push(parsed.data);
    } else {
      // Object format: { site_title: "...", footer_text: "..." }
      for (const [key, value] of Object.entries(json)) {
        if (!SETTING_KEYS.includes(key as (typeof SETTING_KEYS)[number])) {
          return NextResponse.json(
            { error: `Key tidak valid: ${key}` },
            { status: 400 }
          );
        }
        if (typeof value !== "string") {
          return NextResponse.json(
            { error: `Value untuk ${key} harus berupa string` },
            { status: 400 }
          );
        }
        itemsToUpdate.push({ key: key as (typeof SETTING_KEYS)[number], value });
      }
    }
  } else {
    return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
  }

  if (itemsToUpdate.length === 0) {
    return NextResponse.json({ error: "Tidak ada data setting yang dikirim" }, { status: 400 });
  }

  // Upsert per key dalam transaksi
  await prisma.$transaction(
    itemsToUpdate.map(({ key, value }) =>
      prisma.setting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      })
    )
  );

  const updatedSettings = await prisma.setting.findMany();
  const result: Record<string, string> = {};
  for (const s of updatedSettings) {
    result[s.key] = s.value;
  }

  return NextResponse.json(result);
}
