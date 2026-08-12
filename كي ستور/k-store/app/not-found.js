"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative grid min-h-[70vh] place-items-center overflow-hidden p-4">
      <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-gold-600/20 blur-[120px]" />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #d9a73c 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      <div className="relative text-center">
        <p className="font-display text-8xl font-black gold-text">404</p>
        <h1 className="mt-4 font-display text-2xl font-black text-ink-50">الصفحة غير موجودة</h1>
        <p className="mt-2 text-sm text-ink-400">عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-gold">العودة للرئيسية</Link>
          <Link href="/products" className="btn-outline">تصفح المنتجات</Link>
        </div>
      </div>
    </div>
  );
}
