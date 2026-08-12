import { NextResponse } from "next/server";
import { generateProduct } from "@/lib/ai";
import { isAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  if (!isAuthed(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  try {
    const body = await req.json();
    const { description, imageFilename, imageType, image } = body;

    if (!description && !imageFilename) {
      return NextResponse.json({ error: "يرجى إرسال الوصف أو الصورة" }, { status: 400 });
    }

    // توليد بيانات المنتج بالذكاء الاصطناعي
    const generated = await generateProduct({
      description: description || "",
      imageFilename: imageFilename || "",
      imageType: imageType || "",
    });

    // إذا أُرسلت صورة (base64) نضمّنها كأول صورة للمنتج
    const images = image ? [image] : [];

    return NextResponse.json({
      ...generated,
      images,
      source: "ai-generated",
      note: "تم التوليد بواسطة محرك K-Store AI. راجع البيانات وعدّلها قبل الحفظ.",
    });
  } catch (err) {
    return NextResponse.json({ error: "خطأ في التوليد: " + err.message }, { status: 500 });
  }
}
