import { NextResponse } from "next/server";
import { Order, Product, Category } from "@/lib/db";
import { isAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  if (!isAuthed(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const orderStats = Order.stats();
  // أكثر الفئات مبيعاً (تقديري عبر عدد المنتجات)
  const categories = Category.all().map((c) => ({
    ...c,
    productCount: Product.paginate({ categorySlug: c.slug, limit: 1 }).total,
  }));
  // آخر الطلبات
  const recent = Order.all({ page: 1, limit: 5 }).items;
  return NextResponse.json({
    ...orderStats,
    products: Product.count(),
    categories: Category.count(),
    categoriesWithCount: categories,
    recent,
  });
}
