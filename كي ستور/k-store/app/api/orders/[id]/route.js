import { NextResponse } from "next/server";
import { Order, db } from "@/lib/db";
import { isAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(req, { params }) {
  if (!isAuthed(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  try {
    const body = await req.json();
    Order.setStatus(params.id, body.order_status);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  if (!isAuthed(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const row = db.prepare("SELECT * FROM orders WHERE id=? OR order_number=?").get(params.id, params.id);
  if (!row) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  row.items = JSON.parse(row.items);
  return NextResponse.json(row);
}
