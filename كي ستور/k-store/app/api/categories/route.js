import { NextResponse } from "next/server";
import { Category } from "@/lib/db";
import { isAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ categories: Category.all() });
}

export async function POST(req) {
  if (!isAuthed(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  try {
    const body = await req.json();
    const slug = body.slug || require("@/lib/db").slugify(body.name) + "-" + Math.random().toString(36).slice(2, 5);
    const res = Category.create({
      name: body.name,
      slug,
      icon: body.icon || "🏷️",
      color: body.color || "#475569",
      description: body.description || "",
      sort_order: body.sort_order || 0,
    });
    return NextResponse.json({ id: res.lastInsertRowid, slug });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
