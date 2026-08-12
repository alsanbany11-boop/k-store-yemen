import { NextResponse } from "next/server";
import { Category } from "@/lib/db";
import { isAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(req, { params }) {
  if (!isAuthed(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  try {
    const body = await req.json();
    Category.update(params.id, {
      name: body.name,
      slug: body.slug,
      icon: body.icon,
      color: body.color,
      description: body.description,
      sort_order: body.sort_order || 0,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!isAuthed(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  Category.remove(params.id);
  return NextResponse.json({ success: true });
}
