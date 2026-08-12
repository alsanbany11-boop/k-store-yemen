"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatPrice, formatNumber } from "@/lib/utils";

export default function AdminProductsPage() {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    const q = new URLSearchParams({ page, limit: 20 });
    if (search) q.set("search", search);
    fetch("/api/products?" + q.toString(), { cache: "no-store" })
      .then((r) => r.json())
      .then(setData);
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const del = async (id, name) => {
    if (!confirm(`حذف المنتج "${name}"؟ لا يمكن التراجع.`)) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  };

  const toggle = async (p) => {
    await fetch(`/api/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, status: p.status === "active" ? "draft" : "active" }),
    });
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-ink-50">إدارة المنتجات</h1>
          <p className="text-sm text-ink-400">{data ? `${formatNumber(data.total)} منتج` : "..."}</p>
        </div>
        <Link href="/admin/products/add" className="btn-gold">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          إضافة منتج بالـ AI
        </Link>
      </div>

      <div className="card p-4">
        <div className="relative">
          <input className="input pr-10" placeholder="ابحث باسم المنتج أو SKU..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-500">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </span>
        </div>
      </div>

      {!data ? (
        <div className="card h-64 animate-pulse" />
      ) : data.items.length === 0 ? (
        <div className="card flex flex-col items-center gap-4 py-16 text-center">
          <span className="text-5xl">📦</span>
          <p className="text-ink-400">لا توجد منتجات.{search && " جرّب بحثاً آخر."}</p>
          <Link href="/admin/products/add" className="btn-gold">أضف أول منتج</Link>
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="border-b border-ink-800 bg-ink-900/60 text-xs text-ink-400">
                  <tr>
                    <th className="p-3 font-semibold">المنتج</th>
                    <th className="p-3 font-semibold">السعر</th>
                    <th className="hidden p-3 font-semibold sm:table-cell">المخزون</th>
                    <th className="hidden p-3 font-semibold md:table-cell">الفئة</th>
                    <th className="p-3 font-semibold">الحالة</th>
                    <th className="p-3 font-semibold">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-800">
                  {data.items.map((p) => (
                    <tr key={p.id} className="transition hover:bg-ink-800/30">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-ink-700">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.images?.[0]} alt="" className="h-full w-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="line-clamp-1 font-bold text-ink-100">{p.name}</p>
                            <p className="text-[11px] text-ink-500">{p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-bold text-gold-300">{formatPrice(p.price)}</td>
                      <td className="hidden p-3 sm:table-cell">
                        <span className={p.stock <= 0 ? "text-rose-400" : p.stock < 10 ? "text-amber-400" : "text-ink-200"}>{p.stock}</span>
                      </td>
                      <td className="hidden p-3 text-ink-300 md:table-cell">{p.category_name || "—"}</td>
                      <td className="p-3">
                        <button onClick={() => toggle(p)} className={`badge border ${p.status === "active" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-ink-800 text-ink-400 border-ink-700"}`}>
                          {p.status === "active" ? "● نشط" : "○ مسودة"}
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Link href={`/admin/products/${p.id}/edit`} className="grid h-8 w-8 place-items-center rounded-lg border border-ink-700 text-ink-300 hover:border-gold-500/50 hover:text-gold-300" title="تعديل">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </Link>
                          <button onClick={() => del(p.id, p.name)} className="grid h-8 w-8 place-items-center rounded-lg border border-ink-700 text-rose-400 hover:border-rose-500/50 hover:bg-rose-500/10" title="حذف">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {data.pages > 1 && (
            <div className="flex items-center justify-center gap-1.5">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="grid h-9 w-9 place-items-center rounded-lg border border-ink-700 bg-ink-900 text-ink-200 disabled:opacity-30">←</button>
              <span className="px-3 text-sm text-ink-400">صفحة {data.page} من {data.pages}</span>
              <button disabled={page >= data.pages} onClick={() => setPage(page + 1)} className="grid h-9 w-9 place-items-center rounded-lg border border-ink-700 bg-ink-900 text-ink-200 disabled:opacity-30">→</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
