"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { formatPrice, STORE } from "@/lib/utils";

const CITIES = ["تعز", "صنعاء", "عدن", "الحديدة", "إب", "ذمار", "المكلا", "زبيد", "تعز", "البيضاء", "عمران", "صعدة", "حجة", "لحج", "أبين", "شبوة", "المهرة", "الجوف", "مأرب", "ريمة", "ذو السفال"];

export default function CheckoutPage() {
  const { items, subtotal, clear, hydrated } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", phone: "", email: "", city: "تعز", address: "", notes: "",
    card: "", cardName: "", exp: "", cvv: "",
  });

  const shipping = subtotal >= 100000 ? 0 : 3000;
  const total = subtotal + shipping;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const formatCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExp = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.phone || !form.address) {
      setError("يرجى تعبئة الاسم ورقم الهاتف والعنوان.");
      return;
    }
    if (form.card.replace(/\s/g, "").length < 16 || form.cvv.length < 3) {
      setError("يرجى إدخال بيانات بطاقة صحيحة.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.name,
          customer_phone: form.phone,
          customer_email: form.email,
          city: form.city,
          address: form.address,
          notes: form.notes,
          items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, image: i.image })),
          subtotal,
          shipping,
          total,
          // بيانات البطاقة لا تُخزَّن — تُستخدم فقط لمحاكاة الدفع
          card_last4: form.card.replace(/\s/g, "").slice(-4),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل إتمام الطلب");
      clear();
      router.push(`/order/${data.order_number}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (hydrated && items.length === 0) {
    return (
      <div className="container-luxe py-20">
        <div className="card flex flex-col items-center gap-5 py-20 text-center">
          <span className="text-7xl">🛒</span>
          <h1 className="text-2xl font-bold text-ink-100">لا يمكن إتمام الطلب</h1>
          <p className="text-sm text-ink-400">سلتك فارغة. أضف منتجات أولاً.</p>
          <Link href="/products" className="btn-gold">تصفح المنتجات</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-luxe py-8">
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-ink-500">
        <Link href="/cart" className="hover:text-gold-300">السلة</Link>
        <span>/</span>
        <span className="text-ink-300">إتمام الطلب</span>
      </nav>
      <h1 className="mb-6 section-title">إتمام الطلب</h1>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* بيانات العميل */}
          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink-50">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gold-500/15 text-gold-300 text-sm">1</span>
              بيانات التوصيل
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">الاسم الكامل *</label>
                <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="مثال: أحمد محمد" required />
              </div>
              <div>
                <label className="label">رقم الهاتف *</label>
                <input className="input" dir="ltr" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="7XXXXXXXX" required />
              </div>
              <div>
                <label className="label">البريد الإلكتروني (اختياري)</label>
                <input className="input" dir="ltr" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="email@example.com" />
              </div>
              <div>
                <label className="label">المحافظة *</label>
                <select className="input" value={form.city} onChange={(e) => set("city", e.target.value)}>
                  {Array.from(new Set(CITIES)).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">العنوان التفصيلي *</label>
                <input className="input" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="الحي، الشارع، أقرب نقطة دالة" required />
              </div>
              <div className="sm:col-span-2">
                <label className="label">ملاحظات (اختياري)</label>
                <textarea className="input min-h-20" value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="أي تفاصيل إضافية للتوصيل..." />
              </div>
            </div>
          </div>

          {/* الدفع */}
          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink-50">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gold-500/15 text-gold-300 text-sm">2</span>
              الدفع الإلكتروني
            </h2>
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-md border border-ink-700 bg-ink-900 px-2.5 py-1 text-[11px] font-bold text-ink-200">VISA</span>
              <span className="rounded-md border border-ink-700 bg-ink-900 px-2.5 py-1 text-[11px] font-bold text-ink-200">Mastercard</span>
              <span className="rounded-md border border-ink-700 bg-ink-900 px-2.5 py-1 text-[11px] font-bold text-ink-200">مدى</span>
              <span className="mr-auto flex items-center gap-1 text-[11px] text-emerald-300">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                اتصال آمن SSL
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">رقم البطاقة *</label>
                <input className="input font-mono tracking-widest" dir="ltr" value={form.card} onChange={(e) => set("card", formatCard(e.target.value))} placeholder="0000 0000 0000 0000" inputMode="numeric" required />
              </div>
              <div className="sm:col-span-2">
                <label className="label">الاسم على البطاقة *</label>
                <input className="input" dir="ltr" value={form.cardName} onChange={(e) => set("cardName", e.target.value)} placeholder="AHMED MOHAMMED" required />
              </div>
              <div>
                <label className="label">تاريخ الانتهاء *</label>
                <input className="input font-mono" dir="ltr" value={form.exp} onChange={(e) => set("exp", formatExp(e.target.value))} placeholder="MM/YY" inputMode="numeric" required />
              </div>
              <div>
                <label className="label">CVV *</label>
                <input className="input font-mono" dir="ltr" value={form.cvv} onChange={(e) => set("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123" inputMode="numeric" required />
              </div>
            </div>
            <p className="mt-3 text-[11px] text-ink-500">
              🔒 هذا نموذج دفع تجريبي آمن. لا يتم تخزين بيانات بطاقتك. يمكن ربط بوابة دفع حقيقية لاحقاً.
            </p>
          </div>
        </div>

        {/* الملخص */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24 p-5">
            <h2 className="mb-4 text-lg font-bold text-ink-50">طلبك</h2>
            <div className="max-h-60 space-y-3 overflow-y-auto pl-1">
              {items.map((it) => (
                <div key={it.id} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-ink-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.image} alt="" className="h-full w-full object-cover" />
                    <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gold-400 text-[10px] font-bold text-ink-950">{it.qty}</span>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="line-clamp-1 text-xs font-semibold text-ink-200">{it.name}</span>
                    <span className="text-xs text-ink-400">{formatPrice(it.price)}</span>
                  </div>
                  <span className="text-xs font-bold text-ink-100">{formatPrice(it.price * it.qty)}</span>
                </div>
              ))}
            </div>
            <div className="divider-gold my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-ink-300"><span>المجموع الفرعي</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-ink-300"><span>الشحن</span><span>{shipping === 0 ? "مجاني" : formatPrice(shipping)}</span></div>
              <div className="divider-gold my-2" />
              <div className="flex justify-between text-base">
                <span className="font-bold text-ink-100">الإجمالي</span>
                <span className="font-display text-xl font-black gold-text">{formatPrice(total)}</span>
              </div>
            </div>

            {error && <div className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{error}</div>}

            <button type="submit" disabled={loading} className="btn-gold mt-5 w-full">
              {loading ? (
                <><span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950" /> جاري المعالجة...</>
              ) : (
                <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> ادفع {formatPrice(total)}</>
              )}
            </button>
            <p className="mt-3 text-center text-[11px] text-ink-500">بالضغط على "ادفع" أنت توافق على شروط البيع.</p>
          </div>
        </div>
      </form>
    </div>
  );
}
