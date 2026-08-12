"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatPrice, formatNumber, timeAgo, ORDER_STATUS } from "@/lib/utils";

const FILTERS = [
  { v: "all", l: "الكل" },
  { v: "pending", l: "قيد المراجعة" },
  { v: "confirmed", l: "مؤكد" },
  { v: "shipped", l: "تم الشحن" },
  { v: "delivered", l: "تم التوصيل" },
  { v: "cancelled", l: "ملغي" },
];

export default function AdminOrdersPage() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    const q = new URLSearchParams({ page, limit: 20, status });
    fetch("/api/orders?" + q.toString(), { cache: "no-store" }).then((r) => r.json()).then(setData);
  }, [page, status]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black text-ink-50">إدارة الطلبات</h1>
        <p className="text-sm text-ink-400">{data ? `${formatNumber(data.total)} طلب` : "..."}</p>
      </div>

      <div className="card flex gap-1 overflow-x-auto p-2">
        {FILTERS.map((f) => (
          <button
            key={f.v}
            onClick={() => { setStatus(f.v); setPage(1); }}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${status === f.v ? "bg-gold-400 text-ink-950" : "text-ink-300 hover:bg-ink-800"}`}
          >
            {f.l}
          </button>
        ))}
      </div>

      {!data ? (
        <div className="card h-64 animate-pulse" />
      ) : data.items.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-16 text-center">
          <span className="text-5xl">📋</span>
          <p className="text-ink-400">لا توجد طلبات{status !== "all" ? " في هذه الحالة" : ""}.</p>
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="border-b border-ink-800 bg-ink-900/60 text-xs text-ink-400">
                  <tr>
                    <th className="p-3 font-semibold">رقم الطلب</th>
                    <th className="p-3 font-semibold">العميل</th>
                    <th className="hidden p-3 font-semibold sm:table-cell">الهاتف</th>
                    <th className="hidden p-3 font-semibold md:table-cell">التاريخ</th>
                    <th className="p-3 font-semibold">الإجمالي</th>
                    <th className="p-3 font-semibold">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-800">
                  {data.items.map((o) => {
                    const st = ORDER_STATUS[o.order_status] || ORDER_STATUS.pending;
                    return (
                      <tr key={o.id} className="transition hover:bg-ink-800/30">
                        <td className="p-3"><Link href={`/admin/orders/${o.id}`} className="font-mono font-bold text-gold-300" dir="ltr">{o.order_number}</Link></td>
                        <td className="p-3 font-semibold text-ink-100">{o.customer_name}</td>
                        <td className="hidden p-3 text-ink-300 sm:table-cell" dir="ltr">{o.customer_phone}</td>
                        <td className="hidden p-3 text-ink-400 md:table-cell">{timeAgo(o.created_at)}</td>
                        <td className="p-3 font-bold text-ink-50">{formatPrice(o.total)}</td>
                        <td className="p-3"><span className={`badge border ${st.color}`}>{st.label}</span></td>
                      </tr>
                    );
                  })}
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
