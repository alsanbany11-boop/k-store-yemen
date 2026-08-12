import { NextResponse } from "next/server";
import { Settings } from "@/lib/db";
import { isAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

const PUBLIC_KEYS = [
  "store_name", "store_phone", "store_email", "store_city", "store_country",
  "store_currency", "announcement", "free_shipping_threshold", "shipping_cost",
];

export async function GET() {
  const all = Settings.all();
  const pub = {};
  PUBLIC_KEYS.forEach((k) => (pub[k] = all[k]));
  return NextResponse.json(pub);
}

export async function PUT(req) {
  if (!isAuthed(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  try {
    const body = await req.json();
    Settings.setMany(body);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
