"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function CategorySort({ current, slug }) {
  const router = useRouter();
  const params = useSearchParams();

  const change = (sort) => {
    const p = new URLSearchParams(params.toString());
    if (sort === "newest") p.delete("sort");
    else p.set("sort", sort);
    p.delete("page");
    router.push(`/category/${slug}?${p.toString()}`);
  };

  return (
    <select className="input w-auto" value={current || "newest"} onChange={(e) => change(e.target.value)}>
      <option value="newest">الأحدث</option>
      <option value="price_low">السعر: الأقل أولاً</option>
      <option value="price_high">السعر: الأعلى أولاً</option>
      <option value="rating">الأعلى تقييماً</option>
      <option value="popular">الأكثر طلباً</option>
    </select>
  );
}
