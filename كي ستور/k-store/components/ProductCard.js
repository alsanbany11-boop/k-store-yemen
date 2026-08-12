"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
import StarRating from "./StarRating";
import { formatPrice, discountPercent } from "@/lib/utils";

const FALLBACK =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="800" height="800" fill="#1d1c19"/><text x="400" y="430" font-size="220" text-anchor="middle">🛍️</text><text x="400" y="690" font-size="34" fill="#e3bd5f" text-anchor="middle" font-family="Arial">K-STORE</text></svg>`
  );

export default function ProductCard({ product }) {
  const { add } = useCart();
  const [imgSrc, setImgSrc] = useState(product.images?.[0] || FALLBACK);
  const [added, setAdded] = useState(false);
  const discount = discountPercent(product.price, product.compare_price);
  const out = product.stock <= 0;

  const quickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (out) return;
    add(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group card card-hover flex flex-col overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-ink-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={product.name}
          loading="lazy"
          onError={() => setImgSrc(FALLBACK)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && <span className="badge bg-rose-500 text-white shadow">-{discount}%</span>}
          {product.featured && <span className="badge bg-gold-400 text-ink-950 shadow">مميز</span>}
        </div>
        {out && (
          <div className="absolute inset-0 grid place-items-center bg-ink-950/70">
            <span className="rounded-lg border border-ink-700 bg-ink-900 px-4 py-2 text-sm font-bold text-ink-300">نفذت الكمية</span>
          </div>
        )}
        <button
          onClick={quickAdd}
          disabled={out}
          className={`absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-xl shadow-luxe-sm transition-all ${
            added ? "bg-emerald-500 text-white" : "bg-ink-950/85 text-gold-300 opacity-0 backdrop-blur group-hover:opacity-100 hover:bg-gold-400 hover:text-ink-950"
          } ${out ? "pointer-events-none opacity-0" : ""}`}
          aria-label="أضف للسلة"
        >
          {added ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          )}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {product.category_name && (
          <span className="mb-1.5 text-[11px] font-semibold text-gold-400/80">{product.category_name}</span>
        )}
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-ink-50 transition group-hover:text-gold-200">
          {product.name}
        </h3>
        <div className="mt-2">
          <StarRating rating={product.rating} count={product.reviews_count} />
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="flex flex-col">
            {product.compare_price > product.price && (
              <span className="text-xs text-ink-500 line-through">{formatPrice(product.compare_price)}</span>
            )}
            <span className="text-base font-extrabold text-ink-50">{formatPrice(product.price)}</span>
          </div>
          {product.brand && (
            <span className="rounded-md border border-ink-700 px-1.5 py-0.5 text-[10px] font-semibold text-ink-400">{product.brand}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
