"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { STORE } from "@/lib/utils";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" }).then((r) => r.json()).then((d) => {
      if (d.authed) router.replace("/admin");
    });
  }, [router]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل الدخول");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-ink-950 p-4">
      <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-gold-600/20 blur-[120px]" />
      <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-gold-500/10 blur-[100px]" />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #d9a73c 1px, transparent 0)", backgroundSize: "32px 32px" }} />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-600 font-display text-2xl font-black text-ink-950 shadow-gold">K</span>
            <div className="text-right leading-none">
              <p className="font-display text-2xl font-extrabold text-ink-50">K-STORE</p>
              <p className="text-[10px] font-semibold tracking-widest text-gold-400/80">LUXURY MARKET</p>
            </div>
          </Link>
          <h1 className="mt-6 font-display text-2xl font-black text-ink-50">لوحة تحكم المالك</h1>
          <p className="mt-1 text-sm text-ink-400">سجّل الدخول لإدارة متجرك</p>
        </div>

        <form onSubmit={submit} className="card p-6">
          <div className="mb-4">
            <label className="label">اسم المستخدم</label>
            <input className="input" dir="ltr" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="owner" autoFocus />
          </div>
          <div className="mb-2">
            <label className="label">كلمة المرور</label>
            <input className="input" dir="ltr" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </div>

          {error && <div className="mb-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{error}</div>}

          <button type="submit" disabled={loading} className="btn-gold mt-2 w-full">
            {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950" /> جاري الدخول...</> : "تسجيل الدخول"}
          </button>
        </form>

        <div className="mt-4 rounded-xl border border-gold-500/20 bg-gold-500/5 p-3 text-center text-xs text-ink-400">
          <p>بيانات الدخول الافتراضية للتجربة:</p>
          <p className="mt-1 font-mono font-bold text-gold-300" dir="ltr">owner / kstore2024</p>
        </div>

        <Link href="/" className="mt-6 block text-center text-xs text-ink-500 hover:text-gold-300">← العودة للمتجر</Link>
      </div>
    </div>
  );
}
