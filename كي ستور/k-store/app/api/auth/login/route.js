import { NextResponse } from "next/server";
import { login, ensureDefaultAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  ensureDefaultAdmin();
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "أدخل اسم المستخدم وكلمة المرور" }, { status: 400 });
    }
    const result = login(username, password);
    if (!result) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }
    const res = NextResponse.json({ success: true, admin: result.admin });
    res.cookies.set("kstore_token", result.token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
