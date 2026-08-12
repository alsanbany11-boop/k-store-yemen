import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req) {
  if (!isAuthed(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  try {
    const body = await req.json();
    const { image, filename } = body;
    if (!image || !image.startsWith("data:image")) {
      return NextResponse.json({ error: "صورة غير صالحة" }, { status: 400 });
    }

    const match = image.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!match) return NextResponse.json({ error: "تنسيق غير مدعوم" }, { status: 400 });

    const ext = match[1] === "jpeg" ? "jpg" : match[1] === "png" ? "png" : match[1] === "webp" ? "webp" : "jpg";
    const buf = Buffer.from(match[2], "base64");

    const dir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const name = "p" + Date.now() + "-" + Math.floor(Math.random() * 10000) + "." + ext;
    fs.writeFileSync(path.join(dir, name), buf);

    return NextResponse.json({ url: "/uploads/" + name, filename: name });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
