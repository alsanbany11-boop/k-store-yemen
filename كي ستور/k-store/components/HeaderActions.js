"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";

export default function HeaderActions({ categories = [] }) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <>
      <div className="flex items-center gap-1.5">
        <Link href="/cart" className="relative grid h-10 w-10 place-items-center rounded-xl border border-ink-700 bg-ink-900/60 text-ink-100 transition hover:border-gold-500/60 hover:text-gold-300" aria-label="السلة">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          {count > 0 && (
            <span className="absolute -top-1.5 -left-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold-400 px-1 text-[11px] font-extrabold text-ink-950">{count}</span>
          )}
        </Link>

        <button
          onClick={() => setOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-ink-700 bg-ink-900/60 text-ink-100 transition hover:border-gold-500/60 hover:text-gold-300 lg:hidden"
          aria-label="القائمة"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
      </div>

      {/* القائمة الجانبية للجوال */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[82%] max-w-sm overflow-y-auto border-l border-ink-800 bg-ink-950 p-5 shadow-luxe animate-fadeUp">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-2xl font-extrabold gold-text">K-STORE</span>
              <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg border border-ink-700 text-ink-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <form action="/products" method="get" className="mb-5">
              <div className="relative">
                <input name="search" placeholder="ابحث عن منتج..." className="input pl-10" />
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-500">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </span>
              </div>
            </form>
            <nav className="flex flex-col gap-1">
              <Link href="/" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-200 hover:bg-ink-800">الرئيسية</Link>
              <Link href="/products" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-200 hover:bg-ink-800">كل المنتجات</Link>
              <div className="my-2 divider-gold" />
              <p className="px-3 pb-1 text-xs font-bold uppercase tracking-wider text-gold-400/80">الفئات</p>
              {categories.map((c) => (
                <Link key={c.id} href={`/category/${c.slug}`} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-200 hover:bg-ink-800">
                  <span className="text-lg">{c.icon}</span>
                  {c.name}
                </Link>
              ))}
              <div className="my-2 divider-gold" />
              <Link href="/admin" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-gold-300 hover:bg-ink-800">لوحة التحكم</Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
