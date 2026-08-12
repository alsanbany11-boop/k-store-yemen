"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    fetch("/api/categories", { cache: "no-store" }).then((r) => r.json()).then((d) => setCategories(d.categories || []));
    fetch(`/api/products/${id}`, { cache: "no-store" }).then((r) => r.json()).then((p) => {
      setForm({
        ...p,
        tags: (p.tags || []).join("، "),
      });
    });
  }, [id]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name || form.price == null) {
      setError("الاسم والسعر مطلوبان.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          compare_price: form.compare_price ? Number(form.compare_price) : null,
          stock: Number(form.stock),
          category_id: form.category_id ? Number(form.category_id) : null,
          tags: form.tags ? form.tags.split(/[،,]/).map((t) => t.trim()).filter(Boolean) : [],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل الحفظ");
      router.push("/admin/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const removeImage = (i) => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));
  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setForm((f) => ({ ...f, images: [...(f.images || []), newImageUrl.trim()] }));
      setNewImageUrl("");
    }
  };

  if (!form) return <div className="card h-64 animate-pulse" />;

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/products" className="text-xs text-ink-400 hover:text-gold-300">← العودة للمنتجات</Link>
          <h1 className="mt-1 font-display text-2xl font-black text-ink-50">تعديل المنتج</h1>
        </div>
      </div>

      {error && <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="card p-5">
            <h2 className="mb-4 font-bold text-ink-50">المعلومات الأساسية</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">اسم المنتج *</label>
                <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div>
                <label className="label">الفئة</label>
                <select className="input" value={form.category_id || ""} onChange={(e) => set("category_id", e.target.value)}>
                  <option value="">— بدون فئة —</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">العلامة التجارية</label>
                <input className="input" value={form.brand || ""} onChange={(e) => set("brand", e.target.value)} />
              </div>
              <div>
                <label className="label">السعر (ر.ي) *</label>
                <input className="input" type="number" value={form.price} onChange={(e) => set("price", e.target.value)} />
              </div>
              <div>
                <label className="label">سعر المقارنة (ر.ي)</label>
                <input className="input" type="number" value={form.compare_price || ""} onChange={(e) => set("compare_price", e.target.value)} />
              </div>
              <div>
                <label className="label">المخزون</label>
                <input className="input" type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} />
              </div>
              <div>
                <label className="label">SKU</label>
                <input className="input" dir="ltr" value={form.sku || ""} onChange={(e) => set("sku", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">الوصف المختصر</label>
                <input className="input" value={form.short_description || ""} onChange={(e) => set("short_description", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">الوصف التفصيلي</label>
                <textarea className="input min-h-32" value={form.description || ""} onChange={(e) => set("description", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">الوسوم (افصل بفاصلة)</label>
                <input className="input" value={form.tags || ""} onChange={(e) => set("tags", e.target.value)} />
              </div>
              <div>
                <label className="label">الحالة</label>
                <select className="input" value={form.status} onChange={(e) => set("status", e.target.value)}>
                  <option value="active">نشط</option>
                  <option value="draft">مسودة</option>
                </select>
              </div>
              <div>
                <label className="label">منتج مميز؟</label>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-ink-700 bg-ink-950 px-4 py-3">
                  <input type="checkbox" checked={!!form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-gold-500" />
                  <span className="text-sm text-ink-200">عرض في المميزة</span>
                </label>
              </div>
            </div>
          </div>

          <button onClick={save} disabled={busy} className="btn-gold w-full">
            {busy ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950" /> جاري الحفظ...</> : "💾 حفظ التغييرات"}
          </button>
        </div>

        {/* الصور */}
        <div className="lg:col-span-1">
          <div className="card p-5">
            <h2 className="mb-4 font-bold text-ink-50">الصور</h2>
            <div className="space-y-2">
              {(form.images || []).map((img, i) => (
                <div key={i} className="group relative aspect-video overflow-hidden rounded-lg border border-ink-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-cover" />
                  <button onClick={() => removeImage(i)} className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-ink-950/80 text-rose-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              ))}
              {(form.images || []).length === 0 && <p className="py-6 text-center text-xs text-ink-500">لا توجد صور</p>}
            </div>
            <div className="mt-3 flex gap-2">
              <input className="input" placeholder="رابط صورة..." dir="ltr" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
              <button onClick={addImageUrl} className="btn-outline shrink-0 px-3">+</button>
            </div>
            <p className="mt-2 text-[11px] text-ink-500">أضف رابط صورة مباشر.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
