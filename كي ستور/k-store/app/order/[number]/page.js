import Link from "next/link";
import { notFound } from "next/navigation";
import { Order } from "@/lib/db";
import { formatPrice, STORE, ORDER_STATUS, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }) {
  const order = Order.byNumber(params.number);
  if (!order) notFound();

  const status = ORDER_STATUS[order.order_status] || ORDER_STATUS.pending;

  return (
    <div className="container-luxe py-10">
      <div className="mx-auto max-w-2xl">
        {/* نجاح */}
        <div className="card mb-6 flex flex-col items-center gap-3 p-8 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-300">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </span>
          <h1 className="font-display text-2xl font-black text-ink-50">تم استلام طلبك بنجاح! 🎉</h1>
          <p className="text-sm text-ink-400">شكراً لتسوقك من K-Store. سنتواصل معك قريباً لتأكيد الطلب والتوصيل.</p>
          <p className="mt-1 text-xs text-ink-500">رقم الطلب: <span className="font-mono font-bold text-gold-300" dir="ltr">{order.order_number}</span></p>
        </div>

        {/* الحالة */}
        <div className="card mb-6 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-ink-500">حالة الطلب</p>
              <span className={`badge mt-1 border ${status.color}`}>{status.label}</span>
            </div>
            <div className="text-left">
              <p className="text-xs text-ink-500">تاريخ الطلب</p>
              <p className="text-sm text-ink-200">{timeAgo(order.created_at)}</p>
            </div>
          </div>
        </div>

        {/* العناصر */}
        <div className="card mb-6 divide-y divide-ink-800">
          {order.items.map((it, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-ink-700">
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
        </div>

        {/* الملخص */}
        <div className="card mb-6 p-5">
          <h2 className="mb-3 font-bold text-ink-50">الملخص المالي</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-ink-300"><span>المجموع الفرعي</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between text-ink-300"><span>الشحن</span><span>{order.shipping === 0 ? "مجاني" : formatPrice(order.shipping)}</span></div>
            <div className="flex justify-between text-ink-300"><span>طريقة الدفع</span><span>بطاقة •••• {order.transaction_id?.slice(-4) || "0000"}</span></div>
            <div className="divider-gold my-2" />
            <div className="flex justify-between text-base">
              <span className="font-bold text-ink-100">الإجمالي المدفوع</span>
              <span className="font-display text-xl font-black gold-text">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* التوصيل */}
        <div className="card mb-6 p-5">
          <h2 className="mb-3 font-bold text-ink-50">عنوان التوصيل</h2>
          <div className="space-y-1 text-sm text-ink-300">
            <p className="font-semibold text-ink-100">{order.customer_name}</p>
            <p dir="ltr" className="text-right">{order.customer_phone}</p>
            <p>{order.city} — {order.address}</p>
            {order.notes && <p className="mt-2 rounded-lg bg-ink-800/60 p-2 text-xs text-ink-400">ملاحظات: {order.notes}</p>}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/products" className="btn-gold">مواصلة التسوق</Link>
          <a href={`tel:${STORE.phone}`} className="btn-outline">تواصل معنا: {STORE.phone}</a>
        </div>
      </div>
    </div>
  );
}
