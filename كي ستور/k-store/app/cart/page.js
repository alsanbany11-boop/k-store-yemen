"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatPrice, STORE } from "@/lib/utils";

export default function CartPage() {
  const { items, setQty, remove, subtotal, hydrated } = useCart();

  const shipping = subtotal >= 100000 || subtotal === 0 ? 0 : 3000;
  const total = subtotal + shipping;

  if (!hydrated) {
    return <div className="container-luxe py-20"><div className="card h-64 animate-pulse" /></div>;
  }

  if (items.length === 0) {
    return (
      <div className="container-luxe py-20">
        <div className="card flex flex-col items-center gap-5 py-20 text-center">
          <span className="text-7xl">🛒</span>
          <h1 className="text-2xl font-bold text-ink-100">سلة التسوق فارغة</h1>
          <p className="text-sm text-ink-400">لم تقم بإضافة أي منتجات بعد. تصفح متجرنا واكتشف آلاف المنتجات.</p>
          <Link href="/products" className="btn-gold">ابدأ التسوق</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-luxe py-8">
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-ink-500">
        <Link href="/" className="hover:text-gold-300">الرئيسية</Link>
        <span>/</span>
        <span className="text-ink-300">السلة</span>
      </nav>
      <h1 className="mb-6 section-title">سلة التسوق ({items.length})</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* العناصر */}
        <div className="lg:col-span-2">
          <div className="card divide-y divide-ink-800">
            {items.map((it) => (
              <div key={it.id} className="flex gap-4 p-4">
                <Link href={`/products/${it.id}`} className="shrink-0">
                  <div className="h-24 w-24 overflow-hidden rounded-xl border border-ink-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                  </div>
                </Link>
                <div className="flex flex-1 flex-col">
                  <Link href={`/products/${it.id}`} className="line-clamp-2 text-sm font-bold text-ink-100 hover:text-gold-200">{it.name}</Link>
                  <span className="mt-1 text-sm font-extrabold gold-text">{formatPrice(it.price)}</span>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-lg border border-ink-700 bg-ink-950">
                      <button onClick={() => setQty(it.id, it.qty - 1)} className="grid h-9 w-9 place-items-center text-ink-300 hover:text-gold-300">−</button>
                      <span className="w-9 text-center text-sm font-bold text-ink-50">{it.qty}</span>
                      <button onClick={() => setQty(it.id, it.qty + 1)} className="grid h-9 w-9 place-items-center text-ink-300 hover:text-gold-300">+</button>
                    </div>
                    <button onClick={() => remove(it.id)} className="flex items-center gap-1 text-xs font-semibold text-rose-400 hover:text-rose-300">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      إزالة
                    </button>
                  </div>
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-xs text-ink-500">الإجمالي</p>
                  <p className="font-bold text-ink-50">{formatPrice(it.price * it.qty)}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/products" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-400 hover:text-gold-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            مواصلة التسوق
          </Link>
        </div>

        {/* الملخص */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24 p-5">
            <h2 className="mb-4 text-lg font-bold text-ink-50">ملخص الطلب</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-ink-300">
                <span>المجموع الفرعي</span>
                <span className="font-semibold text-ink-100">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-300">
                <span>الشحن</span>
                <span className="font-semibold text-ink-100">{shipping === 0 ? "مجاني" : formatPrice(shipping)}</span>
              </div>
              {shipping === 0 && subtotal > 0 && (
                <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">🎉 حصلت على شحن مجاني!</p>
              )}
              {shipping > 0 && (
                <p className="rounded-lg bg-ink-800 px-3 py-2 text-xs text-ink-400">
                  أضف {formatPrice(100000 - subtotal)} للحصول على شحن مجاني
                </p>
              )}
              <div className="divider-gold my-3" />
              <div className="flex justify-between text-base">
                <span className="font-bold text-ink-100">الإجمالي</span>
                <span className="font-display text-xl font-black gold-text">{formatPrice(total)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-gold mt-5 w-full">
              إتمام الطلب والدفع
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            </Link>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-ink-500">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              دفع آمن ومشفّر 256-bit
            </p>
            <a href={`tel:${STORE.phone}`} className="mt-3 block text-center text-xs text-ink-500 hover:text-gold-300" dir="ltr">للاستفسار: {STORE.phone}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
