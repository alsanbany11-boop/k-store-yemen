import { NextResponse } from "next/server";
import { Product } from "@/lib/db";
import { isAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  const p = Product.byId(params.id);
  if (!p) return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
  return NextResponse.json(p);
}

export async function PUT(req, { params }) {
  if (!isAuthed(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  try {
    const body = await req.json();
    Product.update(params.id, {
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
      featured: body.featured || false,
      status: body.status || "active",
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!isAuthed(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  Product.remove(params.id);
  return NextResponse.json({ success: true });
}
