"use client";

import { useEffect, useState } from "react";

const EMOJIS = ["📱","🎧","🏠","👔","👗","👟","👜","⌚","🧴","🏋️","🧸","🛋️","🛒","🎮","💻","📸","💄","💍","🧩","🛍️","⌚","🕶️"];
const COLORS = ["#1e3a8a","#115e59","#9a3412","#475569","#9d174d","#b45309","#6d28d9","#a16207","#be185d","#15803d","#ea580c","#854d0e","#16a34a","#64748b"];

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", icon: "🏷️", color: "#475569", description: "" });
  const [busy, setBusy] = useState(false);

  const load = () => fetch("/api/categories", { cache: "no-store" }).then((r) => r.json()).then((d) => setCats(d.categories || []));
  useEffect(() => { load(); }, []);

  const reset = () => { setForm({ name: "", slug: "", icon: "🏷️", color: "#475569", description: "" }); setEditing(null); };

  const edit = (c) => { setEditing(c); setForm({ name: c.name, slug: c.slug, icon: c.icon, color: c.color, description: c.description }); };

  const save = async () => {
    if (!form.name) return;
    setBusy(true);
    if (editing) {
      await fetch(`/api/categories/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setBusy(false);
    reset();
    load();
  };

  const del = async (c) => {
    if (!confirm(`حذف فئة "${c.name}"؟`)) return;
    await fetch(`/api/categories/${c.id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black text-ink-50">إدارة الفئات</h1>
        <p className="text-sm text-ink-400">{cats.length} فئة</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* النموذج */}
        <div className="card p-5">
          <h2 className="mb-4 font-bold text-ink-50">{editing ? "تعديل فئة" : "إضافة فئة"}</h2>
          <div className="space-y-3">
            <div>
              <label className="label">اسم الفئة</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثال: إلكترونيات" />
            </div>
            <div>
              <label className="label">الرمز التعبيري</label>
              <div className="flex flex-wrap gap-1.5">
                {EMOJIS.map((e) => (
                  <button key={e} onClick={() => setForm({ ...form, icon: e })} className={`grid h-9 w-9 place-items-center rounded-lg border text-lg ${form.icon === e ? "border-gold-400 bg-gold-500/15" : "border-ink-700 bg-ink-950"}`}>{e}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">اللون</label>
              <div className="flex flex-wrap gap-1.5">
                {COLORS.map((c) => (
                  <button key={c} onClick={() => setForm({ ...form, color: c })} className={`h-8 w-8 rounded-lg border-2 ${form.color === c ? "border-gold-300" : "border-transparent"}`} style={{ background: c }} />
                ))}
              </div>
            </div>
            <div>
              <label className="label">الوصف</label>
              <input className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="وصف مختصر للفئة" />
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={save} disabled={busy} className="btn-gold flex-1">{editing ? "حفظ التعديل" : "إضافة"}</button>
              {editing && <button onClick={reset} className="btn-outline">إلغاء</button>}
            </div>
          </div>
        </div>

        {/* القائمة */}
        <div className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {cats.map((c) => (
              <div key={c.id} className="card flex items-center gap-3 p-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl" style={{ background: `${c.color}22`, border: `1px solid ${c.color}55` }}>{c.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-ink-100">{c.name}</p>
                  <p className="truncate text-xs text-ink-400">{c.description || c.slug}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => edit(c)} className="grid h-8 w-8 place-items-center rounded-lg border border-ink-700 text-ink-300 hover:border-gold-500/50 hover:text-gold-300">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={() => del(c)} className="grid h-8 w-8 place-items-center rounded-lg border border-ink-700 text-rose-400 hover:bg-rose-500/10">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
