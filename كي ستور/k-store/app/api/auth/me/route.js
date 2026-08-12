import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const user = isAuthed(req);
  if (!user) return NextResponse.json({ authed: false }, { status: 200 });
  return NextResponse.json({ authed: true, admin: user });
}
