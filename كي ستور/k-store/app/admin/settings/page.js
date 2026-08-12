"use client";

import { useEffect, useState } from "react";
import { STORE } from "@/lib/utils";

export default function AdminSettingsPage() {
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" }).then((r) => r.json()).then(setForm);
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setBusy(true);
    setSaved(false);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setBusy(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!form) return <div className="card h-64 animate-pulse" />;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black text-ink-50">إعدادات المتجر</h1>
        <p className="text-sm text-ink-400">تحكم في معلومات المتجر الأساسية</p>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 font-bold text-ink-50">معلومات المتجر</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">اسم المتجر</label>
            <input className="input" value={form.store_name || ""} onChange={(e) => set("store_name", e.target.value)} />
          </div>
          <div>
            <label className="label">رقم الهاتف</label>
            <input className="input" dir="ltr" value={form.store_phone || ""} onChange={(e) => set("store_phone", e.target.value)} />
          </div>
          <div>
            <label className="label">البريد الإلكتروني</label>
            <input className="input" dir="ltr" value={form.store_email || ""} onChange={(e) => set("store_email", e.target.value)} />
          </div>
          <div>
            <label className="label">العملة</label>
            <input className="input" value={form.store_currency || ""} onChange={(e) => set("store_currency", e.target.value)} />
          </div>
          <div>
            <label className="label">المدينة</label>
            <input className="input" value={form.store_city || ""} onChange={(e) => set("store_city", e.target.value)} />
          </div>
          <div>
            <label className="label">الدولة</label>
            <input className="input" value={form.store_country || ""} onChange={(e) => set("store_country", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">شريط الإعلان العلوي</label>
            <input className="input" value={form.announcement || ""} onChange={(e) => set("announcement", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 font-bold text-ink-50">الشحن</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">تكلفة الشحن (ر.ي)</label>
            <input className="input" type="number" value={form.shipping_cost || ""} onChange={(e) => set("shipping_cost", e.target.value)} />
          </div>
          <div>
            <label className="label">حد الشحن المجاني (ر.ي)</label>
            <input className="input" type="number" value={form.free_shipping_threshold || ""} onChange={(e) => set("free_shipping_threshold", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={busy} className="btn-gold">
          {busy ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950" /> جاري الحفظ...</> : "💾 حفظ الإعدادات"}
        </button>
        {saved && <span className="flex items-center gap-1 text-sm font-semibold text-emerald-300"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg> تم الحفظ</span>}
      </div>
    </div>
  );
}
