"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

export default function AddProductAIPage() {
  const router = useRouter();
  const fileRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [step, setStep] = useState("input"); // input | review | done
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // المدخلات
  const [images, setImages] = useState([]); // [{ dataUri, name, type }]
  const [description, setDescription] = useState("");

  // المولّد
  const [gen, setGen] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    fetch("/api/categories", { cache: "no-store" }).then((r) => r.json()).then((d) => setCategories(d.categories || []));
  }, []);

  const onFiles = useCallback((files) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    arr.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prev) => [...prev, { dataUri: reader.result, name: f.name, type: f.type }]);
      };
      reader.readAsDataURL(f);
    });
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    onFiles(e.dataTransfer.files);
  };

  const removeImage = (i) => setImages((prev) => prev.filter((_, idx) => idx !== i));

  const generate = async () => {
    if (!description.trim() && images.length === 0) {
      setError("أضف صورة أو وصفاً للمنتج على الأقل.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          image: images[0]?.dataUri,
          imageFilename: images[0]?.name,
          imageType: images[0]?.type,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل التوليد");
      setGen(data);
      setForm({
        name: data.name || "",
        category_id: data.category_id || "",
        price: data.price || "",
        compare_price: data.compare_price || "",
        brand: data.brand || "",
        stock: data.stock ?? 15,
        sku: data.sku || "",
        short_description: data.short_description || "",
        description: data.description || "",
        tags: (data.tags || []).join("، "),
        featured: false,
        status: "active",
      });
      setStep("review");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name || !form.price) {
      setError("الاسم والسعر مطلوبان.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      // رفع الصور
      const urls = [];
      for (const img of images) {
        const up = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: img.dataUri, filename: img.name }),
        });
        const ud = await up.json();
        if (ud.url) urls.push(ud.url);
      }
      // إن لم تُرفع صورة، نولّد صورة افتراضية
      if (urls.length === 0 && images.length === 0) {
        urls.push(gen?.images?.[0] || "");
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          compare_price: form.compare_price ? Number(form.compare_price) : null,
          stock: Number(form.stock),
          category_id: form.category_id ? Number(form.category_id) : null,
          tags: form.tags ? form.tags.split(/[،,]/).map((t) => t.trim()).filter(Boolean) : [],
          images: urls,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل الحفظ");
      setStep("done");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setStep("input");
    setImages([]);
    setDescription("");
    setGen(null);
    setForm({});
    setError("");
  };

  /* ===== نجاح ===== */
  if (step === "done") {
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-300">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
        </span>
        <h1 className="mt-4 font-display text-2xl font-black text-ink-50">تمت إضافة المنتج! 🎉</h1>
        <p className="mt-2 text-sm text-ink-400">أصبح منتجك الآن متاحاً في المتجر.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="btn-gold">إضافة منتج آخر</button>
          <Link href="/admin/products" className="btn-outline">إدارة المنتجات</Link>
          <Link href="/products" className="btn-ghost">عرض في المتجر</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-500/15 text-2xl">🤖</span>
        <div>
          <h1 className="font-display text-2xl font-black text-ink-50">إضافة منتج بالذكاء الاصطناعي</h1>
          <p className="text-sm text-ink-400">ارفع صورة المنتج واكتب وصفاً بسيطاً — وسيقوم الـ AI بتوليد كل البيانات تلقائياً</p>
        </div>
      </div>

      {/* الخطوات */}
      <div className="flex items-center gap-2 text-xs">
        <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-bold ${step === "input" ? "bg-gold-400 text-ink-950" : "bg-ink-800 text-ink-400"}`}>① الإدخال</span>
        <span className="h-px w-6 bg-ink-700" />
        <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-bold ${step === "review" ? "bg-gold-400 text-ink-950" : "bg-ink-800 text-ink-400"}`}>② المراجعة والتعديل</span>
        <span className="h-px w-6 bg-ink-700" />
        <span className="rounded-full bg-ink-800 px-3 py-1.5 font-bold text-ink-400">③ الحفظ</span>
      </div>

      {error && <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>}

      {step === "input" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* رفع الصور */}
          <div>
            <label className="label">صور المنتج</label>
            <div
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className="card flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed border-ink-700 p-8 text-center transition hover:border-gold-500/50 hover:bg-ink-800/30"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gold-500/10 text-gold-300">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
              </span>
              <div>
                <p className="font-bold text-ink-100">اسحب الصور هنا أو اضغط للاختيار</p>
                <p className="mt-1 text-xs text-ink-400">PNG، JPG، WEBP — حتى عدة صور</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
            </div>

            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-ink-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.dataUri} alt="" className="h-full w-full object-cover" />
                    <button onClick={() => removeImage(i)} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-ink-950/80 text-rose-400 opacity-0 transition group-hover:opacity-100">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                    {i === 0 && <span className="absolute bottom-1 right-1 rounded bg-gold-400 px-1 text-[9px] font-bold text-ink-950">رئيسية</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* الوصف */}
          <div>
            <label className="label">وصف بسيط للمنتج</label>
            <textarea
              className="input min-h-40"
              placeholder="مثال: آيفون 15 برو ماكس لون أسود تيتانيوم 256 جيجا جديد أصلي..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="mt-2 text-xs text-ink-500">
              💡 كلما كان الوصف أوضح، كان التوليد أدق. يمكنك كتابة الاسم أو السعر أو أي تفاصيل تريد إدراجها.
            </p>

            <div className="mt-4 rounded-xl border border-gold-500/20 bg-gold-500/5 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-gold-300">
                <span>🤖</span> ماذا سيولّد الـ AI؟
              </p>
              <ul className="mt-2 space-y-1 text-xs text-ink-400">
                <li>• اسم المنتج الاحترافي</li>
                <li>• الفئة المناسبة تلقائياً</li>
                <li>• السعر المقترح بالريال اليمني</li>
                <li>• الوصف التسويقي التفصيلي</li>
                <li>• العلامة التجارية والوسوم</li>
              </ul>
            </div>

            <button onClick={generate} disabled={busy} className="btn-gold mt-4 w-full">
              {busy ? (
                <><span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950" /> الـ AI يعمل...</>
              ) : (
                <><span>🤖</span> توليد بيانات المنتج بالذكاء الاصطناعي</>
              )}
            </button>
          </div>
        </div>
      )}

      {step === "review" && gen && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* النموذج */}
          <div className="space-y-4 lg:col-span-2">
            <div className="card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-bold text-ink-50">راجع وعدّل البيانات المولّدة</h2>
                <span className="badge bg-gold-500/15 text-gold-300 border border-gold-500/30">دقة: {gen.confidence}</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label">اسم المنتج</label>
                  <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} />
                </div>
                <div>
                  <label className="label">الفئة</label>
                  <select className="input" value={form.category_id} onChange={(e) => set("category_id", e.target.value)}>
                    <option value="">— بدون فئة —</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">العلامة التجارية</label>
                  <input className="input" value={form.brand} onChange={(e) => set("brand", e.target.value)} />
                </div>
                <div>
                  <label className="label">السعر (ر.ي) *</label>
                  <input className="input" type="number" value={form.price} onChange={(e) => set("price", e.target.value)} />
                </div>
                <div>
                  <label className="label">سعر المقارنة (ر.ي)</label>
                  <input className="input" type="number" value={form.compare_price} onChange={(e) => set("compare_price", e.target.value)} />
                </div>
                <div>
                  <label className="label">المخزون</label>
                  <input className="input" type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} />
                </div>
                <div>
                  <label className="label">SKU</label>
                  <input className="input" dir="ltr" value={form.sku} onChange={(e) => set("sku", e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">الوصف المختصر</label>
                  <input className="input" value={form.short_description} onChange={(e) => set("short_description", e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">الوصف التفصيلي</label>
                  <textarea className="input min-h-32" value={form.description} onChange={(e) => set("description", e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">الوسوم (افصل بفاصلة)</label>
                  <input className="input" value={form.tags} onChange={(e) => set("tags", e.target.value)} />
                </div>
                <div>
                  <label className="label">الحالة</label>
                  <select className="input" value={form.status} onChange={(e) => set("status", e.target.value)}>
                    <option value="active">نشط (ظاهر في المتجر)</option>
                    <option value="draft">مسودة (مخفي)</option>
                  </select>
                </div>
                <div>
                  <label className="label">منتج مميز؟</label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-ink-700 bg-ink-950 px-4 py-3">
                    <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-gold-500" />
                    <span className="text-sm text-ink-200">عرض في المميزة</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={save} disabled={busy} className="btn-gold flex-1">
                {busy ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950" /> جاري الحفظ...</> : <>💾 حفظ المنتج</>}
              </button>
              <button onClick={reset} className="btn-outline">إعادة البدء</button>
            </div>
          </div>

          {/* معاينة حية */}
          <div className="lg:col-span-1">
            <p className="mb-3 text-xs font-semibold text-ink-400">معاينة المنتج</p>
            <div className="card overflow-hidden">
              <div className="relative aspect-square overflow-hidden bg-ink-900">
                {images[0] ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={images[0].dataUri} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-5xl">🛍️</div>
                )}
                {form.compare_price > form.price && (
                  <span className="badge absolute right-3 top-3 bg-rose-500 text-white">
                    -{Math.round(((form.compare_price - form.price) / form.compare_price) * 100)}%
                  </span>
                )}
                {form.featured && <span className="badge absolute left-3 top-3 bg-gold-400 text-ink-950">مميز</span>}
              </div>
              <div className="p-4">
                {form.category_id && <span className="text-[11px] font-semibold text-gold-400">{categories.find((c) => String(c.id) === String(form.category_id))?.name}</span>}
                <h3 className="mt-1 line-clamp-2 text-sm font-bold text-ink-50">{form.name || "اسم المنتج"}</h3>
                <div className="mt-2 flex items-end gap-2">
                  <span className="font-extrabold text-ink-50">{form.price ? formatPrice(form.price) : "—"}</span>
                  {form.compare_price > form.price && <span className="text-xs text-ink-500 line-through">{formatPrice(form.compare_price)}</span>}
                </div>
                {form.brand && <span className="mt-2 inline-block rounded-md border border-ink-700 px-1.5 py-0.5 text-[10px] text-ink-400">{form.brand}</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
