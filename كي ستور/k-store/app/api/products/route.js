import { NextResponse } from "next/server";
import { Product } from "@/lib/db";
import { isAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const url = new URL(req.url);
  const data = Product.allAdmin({
    page: url.searchParams.get("page") || 1,
    limit: url.searchParams.get("limit") || 50,
    search: url.searchParams.get("search") || "",
  });
  return NextResponse.json(data);
}

export async function POST(req) {
  if (!isAuthed(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  try {
    const body = await req.json();
    if (!body.name || body.price == null) {
      return NextResponse.json({ error: "الاسم والسعر مطلوبان" }, { status: 400 });
    }
    const id = Product.create({
      name: body.name,
      short_description: body.short_description,
      description: body.description,
      price: Number(body.price),
      compare_price: body.compare_price ? Number(body.compare_price) : null,
      category_id: body.category_id || null,
      images: body.images || [],
      stock: Number(body.stock) || 0,
      sku: body.sku || "",
      brand: body.brand || "",
      tags: body.tags || [],
      rating: body.rating || 0,
      reviews_count: body.reviews_count || 0,
      featured: body.featured || false,
      status: body.status || "active",
    });
    return NextResponse.json({ id, success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
