import { Suspense } from "react";
import Link from "next/link";
import { Product, Category } from "@/lib/db";
import { formatPrice, formatNumber } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";

export const dynamic = "force-dynamic";

function Pagination({ page, pages, base }) {
  if (pages <= 1) return null;
  const range = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, page + 2);
  for (let i = start; i <= end; i++) range.push(i);

  const link = (p) => {
    const url = new URLSearchParams(base);
    url.set("page", p);
    return `/products?${url.toString()}`;
  };

  return (
    <div className="mt-10 flex items-center justify-center gap-1.5">
      {page > 1 && (
        <Link href={link(page - 1)} className="grid h-10 w-10 place-items-center rounded-lg border border-ink-700 bg-ink-900 text-ink-200 hover:border-gold-500/50 hover:text-gold-300">←</Link>
      )}
      {start > 1 && <Link href={link(1)} className="grid h-10 w-10 place-items-center rounded-lg border border-ink-700 bg-ink-900 text-ink-200 hover:text-gold-300">1</Link>}
      {start > 2 && <span className="px-1 text-ink-600">…</span>}
      {range.map((i) => (
        <Link
          key={i}
          href={link(i)}
          className={`grid h-10 min-w-10 place-items-center rounded-lg border px-2 text-sm font-bold ${
            i === page
              ? "border-gold-400 bg-gold-400 text-ink-950"
              : "border-ink-700 bg-ink-900 text-ink-200 hover:border-gold-500/50 hover:text-gold-300"
          }`}
        >
          {i}
        </Link>
      ))}
      {end < pages - 1 && <span className="px-1 text-ink-600">…</span>}
      {end < pages && <Link href={link(pages)} className="grid h-10 w-10 place-items-center rounded-lg border border-ink-700 bg-ink-900 text-ink-200 hover:text-gold-300">{pages}</Link>}
      {page < pages && (
        <Link href={link(page + 1)} className="grid h-10 w-10 place-items-center rounded-lg border border-ink-700 bg-ink-900 text-ink-200 hover:border-gold-500/50 hover:text-gold-300">→</Link>
      )}
    </div>
  );
}

export default async function ProductsPage({ searchParams }) {
  const sp = searchParams || {};
  const categories = Category.all();
  const { items, total, page, pages } = Product.paginate({
    page: sp.page,
    limit: 24,
    categorySlug: sp.category,
    search: sp.search,
    sort: sp.sort,
    minPrice: sp.minPrice,
    maxPrice: sp.maxPrice,
  });

  const base = new URLSearchParams();
  if (sp.search) base.set("search", sp.search);
  if (sp.category) base.set("category", sp.category);
  if (sp.sort) base.set("sort", sp.sort);
  if (sp.minPrice) base.set("minPrice", sp.minPrice);
  if (sp.maxPrice) base.set("maxPrice", sp.maxPrice);

  return (
    <div className="container-luxe py-8">
      <div className="mb-6">
        <nav className="mb-3 flex items-center gap-1.5 text-xs text-ink-500">
          <Link href="/" className="hover:text-gold-300">الرئيسية</Link>
          <span>/</span>
          <span className="text-ink-300">المنتجات</span>
        </nav>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="section-title">
              {sp.search ? `نتائج البحث: "${sp.search}"` : sp.category ? categories.find((c) => c.slug === sp.category)?.name || "المنتجات" : "كل المنتجات"}
            </h1>
            <p className="mt-1 text-sm text-ink-400">{formatNumber(total)} منتج</p>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="card mb-6 h-24 animate-pulse" />}>
        <div className="mb-6">
          <ProductFilters categories={categories} current={sp} />
        </div>
      </Suspense>

      {items.length === 0 ? (
        <div className="card flex flex-col items-center gap-4 py-20 text-center">
          <span className="text-6xl">🔍</span>
          <h2 className="text-xl font-bold text-ink-100">لا توجد منتجات مطابقة</h2>
          <p className="text-sm text-ink-400">جرّب تعديل الفلاتر أو البحث بكلمات مختلفة.</p>
          <Link href="/products" className="btn-outline">عرض كل المنتجات</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <Pagination page={page} pages={pages} base={base.toString()} />
        </>
      )}
    </div>
  );
}
