import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Product, Category } from "@/lib/db";
import { formatNumber } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import CategorySort from "@/components/CategorySort";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const c = Category.bySlug(params.slug);
  return { title: c ? `${c.name} | K-Store` : "K-Store" };
}

export default async function CategoryPage({ params, searchParams }) {
  const category = Category.bySlug(params.slug);
  if (!category) notFound();

  const sp = searchParams || {};
  const { items, total, page, pages } = Product.paginate({
    page: sp.page,
    limit: 24,
    categorySlug: params.slug,
    sort: sp.sort || "newest",
  });

  const base = new URLSearchParams();
  if (sp.sort) base.set("sort", sp.sort);

  return (
    <div>
      {/* رأس الفئة */}
      <section className="relative overflow-hidden border-b border-ink-800" style={{ background: `linear-gradient(120deg, ${category.color}33, #0a0908 60%)` }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #d9a73c 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="container-luxe relative py-10">
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-ink-500">
            <Link href="/" className="hover:text-gold-300">الرئيسية</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gold-300">المنتجات</Link>
            <span>/</span>
            <span className="text-ink-300">{category.name}</span>
          </nav>
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl text-3xl" style={{ background: `${category.color}33`, border: `1px solid ${category.color}66` }}>
              {category.icon}
            </span>
            <div>
              <h1 className="font-display text-3xl font-black text-ink-50 sm:text-4xl">{category.name}</h1>
              <p className="mt-1 text-sm text-ink-400">{category.description}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-luxe py-8">
        <Suspense fallback={null}>
          <div className="mb-6 flex items-center justify-between gap-3">
            <p className="text-sm text-ink-400">{formatNumber(total)} منتج</p>
            <CategorySort current={sp.sort} slug={params.slug} />
          </div>
        </Suspense>

        {items.length === 0 ? (
          <div className="card flex flex-col items-center gap-4 py-20 text-center">
            <span className="text-6xl">{category.icon}</span>
            <p className="text-ink-400">لا توجد منتجات في هذه الفئة حالياً.</p>
            <Link href="/products" className="btn-outline">تصفح كل المنتجات</Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {pages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-1.5">
                {page > 1 && (
                  <Link href={`/category/${params.slug}?${new URLSearchParams({ ...Object.fromEntries(base), page: page - 1 }).toString()}`} className="grid h-10 w-10 place-items-center rounded-lg border border-ink-700 bg-ink-900 text-ink-200 hover:border-gold-500/50">←</Link>
                )}
                {Array.from({ length: pages }).slice(0, 7).map((_, i) => {
                  const p = i + 1;
                  return (
                    <Link key={p} href={`/category/${params.slug}?${new URLSearchParams({ ...Object.fromEntries(base), page: p }).toString()}`} className={`grid h-10 w-10 place-items-center rounded-lg border text-sm font-bold ${p === page ? "border-gold-400 bg-gold-400 text-ink-950" : "border-ink-700 bg-ink-900 text-ink-200 hover:text-gold-300"}`}>{p}</Link>
                  );
                })}
                {page < pages && (
                  <Link href={`/category/${params.slug}?${new URLSearchParams({ ...Object.fromEntries(base), page: page + 1 }).toString()}`} className="grid h-10 w-10 place-items-center rounded-lg border border-ink-700 bg-ink-900 text-ink-200 hover:border-gold-500/50">→</Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
