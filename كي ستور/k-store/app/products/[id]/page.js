import Link from "next/link";
import { notFound } from "next/navigation";
import { Product } from "@/lib/db";
import ProductDetailClient from "@/components/ProductDetailClient";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const p = Product.bySlug(params.id) || Product.byId(params.id);
  return { title: p ? `${p.name} | K-Store` : "K-Store" };
}

export default async function ProductPage({ params }) {
  const product = Product.bySlug(params.id) || Product.byId(params.id);
  if (!product) notFound();

  const related = Product.related(product.category_id, product.id, 4);

  return (
    <div className="container-luxe py-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-ink-500">
        <Link href="/" className="hover:text-gold-300">الرئيسية</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-gold-300">المنتجات</Link>
        {product.category_slug && (
          <>
            <span>/</span>
            <Link href={`/category/${product.category_slug}`} className="hover:text-gold-300">{product.category_name}</Link>
          </>
        )}
        <span>/</span>
        <span className="truncate text-ink-300">{product.name}</span>
      </nav>

      <ProductDetailClient product={product} />

      {related.length > 0 && (
        <section className="mt-16">
          <div className="divider-gold mb-8" />
          <h2 className="mb-6 text-2xl font-extrabold text-ink-50">منتجات ذات صلة</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
