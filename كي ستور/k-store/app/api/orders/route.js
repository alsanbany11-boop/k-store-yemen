import { NextResponse } from "next/server";
import { Order } from "@/lib/db";
import { isAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  if (!isAuthed(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const url = new URL(req.url);
  const data = Order.all({
    page: url.searchParams.get("page") || 1,
    limit: url.searchParams.get("limit") || 20,
    status: url.searchParams.get("status") || "all",
  });
  return NextResponse.json(data);
}
