"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function ProductFilters({ categories, current }) {
  const router = useRouter();
  const params = useSearchParams();

  const update = useCallback(
    (key, value) => {
      const p = new URLSearchParams(params.toString());
      if (value === "" || value == null) p.delete(key);
      else p.set(key, value);
      p.delete("page");
      router.push(`/products?${p.toString()}`);
    },
    [params, router]
  );

  const reset = () => router.push("/products");

  const sorts = [
    { v: "newest", l: "الأحدث" },
    { v: "price_low", l: "السعر: الأقل أولاً" },
    { v: "price_high", l: "السعر: الأعلى أولاً" },
    { v: "rating", l: "الأعلى تقييماً" },
    { v: "popular", l: "الأكثر طلباً" },
  ];

  return (
    <div className="card p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="label">الفئة</label>
          <select className="input" value={current.category || ""} onChange={(e) => update("category", e.target.value)}>
            <option value="">كل الفئات</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">ترتيب حسب</label>
          <select className="input" value={current.sort || "newest"} onChange={(e) => update("sort", e.target.value)}>
            {sorts.map((s) => (
              <option key={s.v} value={s.v}>{s.l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">السعر من (ر.ي)</label>
          <input
            type="number"
            className="input"
            placeholder="0"
            value={current.minPrice || ""}
            onChange={(e) => update("minPrice", e.target.value)}
          />
        </div>
        <div>
          <label className="label">السعر إلى (ر.ي)</label>
          <input
            type="number"
            className="input"
            placeholder="∞"
            value={current.maxPrice || ""}
            onChange={(e) => update("maxPrice", e.target.value)}
          />
        </div>
      </div>

      {(current.search || current.category || current.minPrice || current.maxPrice || (current.sort && current.sort !== "newest")) && (
        <button onClick={reset} className="mt-3 text-xs font-semibold text-gold-400 hover:text-gold-300">
          ↺ إعادة ضبط الفلاتر
        </button>
      )}
    </div>
  );
}
