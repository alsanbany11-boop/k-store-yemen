"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import { formatPrice, discountPercent, STORE } from "@/lib/utils";

export default function ProductDetailClient({ product }) {
  const { add } = useCart();
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const discount = discountPercent(product.price, product.compare_price);
  const out = product.stock <= 0;

  const onAdd = () => {
    if (out) return;
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const buyNow = () => {
    if (out) return;
    add(product, qty);
    router.push("/checkout");
  };

  const waText = encodeURIComponent(`مرحباً، أريد طلب: ${product.name} بسعر ${formatPrice(product.price)}`);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* معرض الصور */}
      <div className="flex flex-col gap-4">
        <div className="card relative aspect-square overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.images?.[active]} alt={product.name} className="h-full w-full object-cover" />
          {discount > 0 && <span className="badge absolute right-4 top-4 bg-rose-500 text-white shadow">-{discount}%</span>}
          {product.featured && <span className="badge absolute left-4 top-4 bg-gold-400 text-ink-950 shadow">مميز</span>}
        </div>
        {product.images?.length > 1 && (
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition ${i === active ? "border-gold-400" : "border-ink-700 hover:border-gold-500/50"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* المعلومات */}
      <div>
        {product.category_name && (
          <span className="text-sm font-semibold text-gold-400">{product.category_name}</span>
        )}
        <h1 className="mt-1 font-display text-3xl font-black leading-tight text-ink-50">{product.name}</h1>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center gap-1 text-gold-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill={s <= Math.round(product.rating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5"><path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.8L5.4 21l1.7-7L1.7 9.5l7.1-.6z"/></svg>
            ))}
          </div>
          <span className="text-sm text-ink-400">{product.rating} ({product.reviews_count} تقييم)</span>
          {product.brand && (
            <span className="rounded-md border border-ink-700 px-2 py-0.5 text-xs font-semibold text-ink-300">{product.brand}</span>
          )}
        </div>

        <div className="mt-5 flex items-end gap-3">
          <span className="font-display text-4xl font-black gold-text">{formatPrice(product.price)}</span>
          {product.compare_price > product.price && (
            <span className="mb-1 text-lg text-ink-500 line-through">{formatPrice(product.compare_price)}</span>
          )}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-ink-300">{product.short_description}</p>

        {/* الحالة */}
        <div className="mt-5 flex items-center gap-2">
          {out ? (
            <span className="badge bg-rose-500/15 text-rose-300 border border-rose-500/30">● نفذت الكمية</span>
          ) : (
            <span className="badge bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">● متوفر ({product.stock} قطعة)</span>
          )}
          <span className="badge bg-ink-800 text-ink-300">SKU: {product.sku}</span>
        </div>

        {/* الكمية + الأزرار */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center rounded-xl border border-ink-700 bg-ink-950">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center text-xl text-ink-300 hover:text-gold-300">−</button>
            <span className="w-12 text-center font-bold text-ink-50">{qty}</span>
            <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="grid h-12 w-12 place-items-center text-xl text-ink-300 hover:text-gold-300">+</button>
          </div>
          <button onClick={onAdd} disabled={out} className={`btn-gold flex-1 ${added ? "!bg-emerald-500 !text-white" : ""}`}>
            {added ? (
              <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg> تمت الإضافة</>
            ) : (
              <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> أضف للسلة</>
            )}
          </button>
          <button onClick={buyNow} disabled={out} className="btn-outline flex-1">اشترِ الآن</button>
        </div>

        <a
          href={`https://wa.me/${STORE.whatsapp}?text=${waText}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-emerald-600/40 bg-emerald-600/10 px-6 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-600/20"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.2-1.4A10 10 0 1 0 12 2zm5 13.5c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.6-.1-.4-.1-.8-.3-1.4-.5-2.4-1-3.9-3.5-4-3.7-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.4-.3.6-.3h.4c.1 0 .3 0 .5.4l.7 1.6c.1.2.1.3 0 .5l-.3.4-.3.3c-.1.1-.2.3-.1.5.2.3.7 1.1 1.4 1.7 1 .8 1.7 1 2 1.2.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.5-.1l1.5.7c.2.1.4.2.4.3.1.2.1.7-.1 1.3z"/></svg>
          اطلب عبر واتساب
        </a>

        {/* ضمانات */}
        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-ink-800 pt-6">
          {[
            { i: "M9 11l3 3L22 4", t: "منتج أصلي" },
            { i: "M22 12h-4l-3 9L9 3l-3 9H2", t: "شحن سريع" },
            { i: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", t: "دفع آمن" },
          ].map((b) => (
            <div key={b.t} className="flex flex-col items-center gap-1.5 text-center">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold-500/10 text-gold-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={b.i} /></svg>
              </span>
              <span className="text-[11px] font-semibold text-ink-300">{b.t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* الوصف الكامل */}
      {product.description && (
        <div className="lg:col-span-2">
          <div className="divider-gold mb-6" />
          <h2 className="mb-4 text-xl font-bold text-ink-50">تفاصيل المنتج</h2>
          <div className="card whitespace-pre-line p-6 text-sm leading-relaxed text-ink-300">
            {product.description}
          </div>
        </div>
      )}

      {/* الوسوم */}
      {product.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 lg:col-span-2">
          {product.tags.map((t) => (
            <span key={t} className="badge border border-ink-700 bg-ink-900 text-ink-400">#{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}
