"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatPrice, timeAgo, ORDER_STATUS, STORE } from "@/lib/utils";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => fetch(`/api/orders/${id}`, { cache: "no-store" }).then((r) => r.json()).then(setOrder);
  useEffect(() => { load(); }, [id]);

  const changeStatus = async (s) => {
    setSaving(true);
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_status: s }),
    });
    setSaving(false);
    load();
  };

  if (!order) return <div className="card h-64 animate-pulse" />;
  const st = ORDER_STATUS[order.order_status] || ORDER_STATUS.pending;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/orders" className="text-xs text-ink-400 hover:text-gold-300">← كل الطلبات</Link>
          <h1 className="mt-1 font-display text-2xl font-black text-ink-50">طلب <span className="font-mono gold-text" dir="ltr">{order.order_number}</span></h1>
        </div>
        <span className={`badge border ${st.color}`}>{st.label}</span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-3 font-bold text-ink-50">بيانات العميل</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-ink-500">الاسم:</span> <span className="font-semibold text-ink-100">{order.customer_name}</span></p>
            <p><span className="text-ink-500">الهاتف:</span> <a href={`tel:${order.customer_phone}`} className="font-semibold text-gold-300" dir="ltr">{order.customer_phone}</a></p>
            {order.customer_email && <p><span className="text-ink-500">البريد:</span> <span className="text-ink-200" dir="ltr">{order.customer_email}</span></p>}
            <p><span className="text-ink-500">المحافظة:</span> <span className="text-ink-200">{order.city}</span></p>
            <p><span className="text-ink-500">العنوان:</span> <span className="text-ink-200">{order.address}</span></p>
            {order.notes && <p className="rounded-lg bg-ink-800/60 p-2 text-xs text-ink-400">ملاحظات: {order.notes}</p>}
          </div>
          <a href={`tel:${order.customer_phone}`} className="btn-outline mt-4 w-full">📞 الاتصال بالعميل</a>
        </div>

        <div className="card p-5">
          <h2 className="mb-3 font-bold text-ink-50">تحديث حالة الطلب</h2>
          <div className="space-y-2">
            {STATUSES.map((s) => {
              const info = ORDER_STATUS[s];
              return (
                <button
                  key={s}
                  onClick={() => changeStatus(s)}
                  disabled={saving || order.order_status === s}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    order.order_status === s
                      ? "border-gold-400 bg-gold-500/15 text-gold-200"
                      : "border-ink-700 bg-ink-950 text-ink-300 hover:border-gold-500/40 hover:text-ink-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {order.order_status === s && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>}
                    {info.label}
                  </span>
                  <span className={`h-2 w-2 rounded-full ${info.color.includes("emerald") ? "bg-emerald-400" : info.color.includes("amber") ? "bg-amber-400" : info.color.includes("blue") ? "bg-blue-400" : info.color.includes("indigo") ? "bg-indigo-400" : "bg-rose-400"}`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card divide-y divide-ink-800">
        <div className="p-4"><h2 className="font-bold text-ink-50">المنتجات ({order.items.length})</h2></div>
        {order.items.map((it, i) => (
          <div key={i} className="flex items-center gap-3 p-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-ink-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.image} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-ink-100">{it.name}</p>
              <p className="text-xs text-ink-400">{formatPrice(it.price)} × {it.qty}</p>
            </div>
            <p className="font-bold text-ink-50">{formatPrice(it.price * it.qty)}</p>
          </div>
        ))}
        <div className="space-y-2 p-4 text-sm">
          <div className="flex justify-between text-ink-300"><span>المجموع الفرعي</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between text-ink-300"><span>الشحن</span><span>{order.shipping === 0 ? "مجاني" : formatPrice(order.shipping)}</span></div>
          <div className="flex justify-between text-ink-300"><span>طريقة الدفع</span><span>بطاقة (مدفوع)</span></div>
          <div className="flex justify-between text-ink-300"><span>معاملة</span><span className="font-mono" dir="ltr">{order.transaction_id}</span></div>
          <div className="divider-gold my-2" />
          <div className="flex justify-between text-base"><span className="font-bold text-ink-100">الإجمالي</span><span className="font-display text-xl font-black gold-text">{formatPrice(order.total)}</span></div>
        </div>
      </div>

      <p className="text-center text-xs text-ink-500">تاريخ الطلب: {timeAgo(order.created_at)}</p>
    </div>
  );
}
