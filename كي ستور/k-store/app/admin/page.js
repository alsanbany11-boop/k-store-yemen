"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice, formatNumber, timeAgo, ORDER_STATUS } from "@/lib/utils";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/stats", { cache: "no-store" }).then((r) => r.json()).then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => <div key={i} className="card h-32 animate-pulse" />)}
      </div>
    );
  }

  const cards = [
    { label: "إجمالي الإيرادات", value: formatPrice(stats.revenue), icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", color: "from-emerald-500/20 to-emerald-500/5", iconC: "text-emerald-300" },
    { label: "إجمالي الطلبات", value: formatNumber(stats.orders), sub: `${stats.pending} قيد المراجعة`, icon: "M9 11l3 3 8-8M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11", color: "from-blue-500/20 to-blue-500/5", iconC: "text-blue-300" },
    { label: "عدد المنتجات", value: formatNumber(stats.products), sub: `${stats.categories} فئة`, icon: "M20 7l-.8 2M16 9l.8 2M20 11l-2-.8M16 13l.8 2M4 4h16v16H4z", color: "from-gold-500/20 to-gold-500/5", iconC: "text-gold-300" },
    { label: "مبيعات اليوم", value: formatPrice(stats.todayRevenue), sub: `${stats.todayOrders} طلب اليوم`, icon: "M22 12h-4l-3 9L9 3l-3 9H2", color: "from-violet-500/20 to-violet-500/5", iconC: "text-violet-300" },
  ];

  const maxCat = Math.max(1, ...stats.categoriesWithCount.map((c) => c.productCount));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black text-ink-50">نظرة عامة</h1>
        <p className="text-sm text-ink-400">ملخص أداء متجرك K-Store</p>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className={`card relative overflow-hidden bg-gradient-to-br ${c.color} p-5`}>
            <span className={`absolute left-4 top-4 ${c.iconC}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={c.icon} /></svg>
            </span>
            <p className="text-xs text-ink-400">{c.label}</p>
            <p className="mt-2 font-display text-2xl font-black text-ink-50">{c.value}</p>
            {c.sub && <p className="mt-1 text-[11px] text-ink-500">{c.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* آخر الطلبات */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-ink-800 p-5">
            <h2 className="font-bold text-ink-50">آخر الطلبات</h2>
            <Link href="/admin/orders" className="text-xs font-semibold text-gold-400 hover:text-gold-300">عرض الكل ←</Link>
          </div>
          {stats.recent.length === 0 ? (
            <p className="p-8 text-center text-sm text-ink-400">لا توجد طلبات بعد.</p>
          ) : (
            <div className="divide-y divide-ink-800">
              {stats.recent.map((o) => {
                const st = ORDER_STATUS[o.order_status] || ORDER_STATUS.pending;
                return (
                  <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center gap-3 p-4 transition hover:bg-ink-800/40">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-ink-100">{o.customer_name}</p>
                      <p className="text-xs text-ink-500" dir="ltr">{o.order_number} • {timeAgo(o.created_at)}</p>
                    </div>
                    <span className={`badge border ${st.color}`}>{st.label}</span>
                    <span className="font-bold text-gold-300">{formatPrice(o.total)}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* الفئات */}
        <div className="card">
          <div className="border-b border-ink-800 p-5">
            <h2 className="font-bold text-ink-50">المنتجات حسب الفئة</h2>
          </div>
          <div className="space-y-3 p-5">
            {stats.categoriesWithCount.slice(0, 7).map((c) => (
              <div key={c.id}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-ink-300"><span>{c.icon}</span>{c.name}</span>
                  <span className="font-bold text-ink-100">{c.productCount}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink-800">
                  <div className="h-full rounded-full bg-gradient-to-l from-gold-400 to-gold-600" style={{ width: `${(c.productCount / maxCat) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* إجراءات سريعة */}
      <div className="card p-5">
        <h2 className="mb-4 font-bold text-ink-50">إجراءات سريعة</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link href="/admin/products/add" className="card card-hover flex items-center gap-3 p-4 border-gold-500/30">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-500/15 text-gold-300 text-xl">🤖</span>
            <div>
              <p className="text-sm font-bold text-ink-50">إضافة منتج بالذكاء الاصطناعي</p>
              <p className="text-xs text-ink-400">ارفع صورة ووصف — والباقي علينا</p>
            </div>
          </Link>
          <Link href="/admin/products" className="card card-hover flex items-center gap-3 p-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-800 text-ink-200 text-xl">📦</span>
            <div>
              <p className="text-sm font-bold text-ink-50">إدارة المنتجات</p>
              <p className="text-xs text-ink-400">عرض وتعديل وحذف</p>
            </div>
          </Link>
          <Link href="/admin/orders" className="card card-hover flex items-center gap-3 p-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-800 text-ink-200 text-xl">📋</span>
            <div>
              <p className="text-sm font-bold text-ink-50">إدارة الطلبات</p>
              <p className="text-xs text-ink-400">متابعة وتحديث الحالات</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
