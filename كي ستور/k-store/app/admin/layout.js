"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { STORE } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "الرئيسية", icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" },
  { href: "/admin/products", label: "المنتجات", icon: "M20 7l-.8 2-2-.8-2 .8-.8-2-2 .8.8 2-2 .8.8 2 2-.8 2 .8.8 2 2-.8-.8-2 2-.8z M4 4h16v16H4z" },
  { href: "/admin/products/add", label: "إضافة منتج (AI)", icon: "M12 5v14M5 12h14", highlight: true },
  { href: "/admin/orders", label: "الطلبات", icon: "M9 11l3 3 8-8 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" },
  { href: "/admin/categories", label: "الفئات", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" },
  { href: "/admin/settings", label: "الإعدادات", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState({ loading: true, authed: false, admin: null });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) {
      setState({ loading: false, authed: false, admin: null });
      return;
    }
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.authed) setState({ loading: false, authed: true, admin: d.admin });
        else router.replace("/admin/login");
      })
      .catch(() => router.replace("/admin/login"));
  }, [isLogin, router]);

  if (isLogin) return <>{children}</>;
  if (state.loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-950">
        <div className="flex flex-col items-center gap-3">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-ink-700 border-t-gold-400" />
          <p className="text-sm text-ink-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }
  if (!state.authed) return null;

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    document.cookie = "kstore_token=; path=/; max-age=0";
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-screen bg-ink-950 lg:flex">
      {/* القائمة الجانبية */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 right-0 z-50 w-72 transform border-l border-ink-800 bg-ink-900/95 backdrop-blur transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 border-b border-ink-800 p-5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-600 font-display text-xl font-black text-ink-950">K</span>
            <div className="leading-none">
              <p className="font-display text-lg font-extrabold text-ink-50">K-STORE</p>
              <p className="text-[10px] font-semibold tracking-wider text-gold-400/80">لوحة التحكم</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {NAV.map((n) => {
              const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-gold-500/15 text-gold-200 border border-gold-500/30"
                      : n.highlight
                      ? "text-gold-300 hover:bg-ink-800 border border-gold-500/20"
                      : "text-ink-300 hover:bg-ink-800 hover:text-ink-50"
                  }`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d={n.icon} /></svg>
                  {n.label}
                  {n.highlight && <span className="mr-auto badge bg-gold-400 text-ink-950">AI</span>}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-ink-800 p-3">
            <div className="mb-2 flex items-center gap-3 rounded-xl bg-ink-800/50 p-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-500/20 text-gold-300 font-bold">{state.admin?.name?.[0] || "م"}</span>
              <div className="leading-tight">
                <p className="text-sm font-bold text-ink-100">{state.admin?.name}</p>
                <p className="text-[11px] text-ink-400">{state.admin?.username}</p>
              </div>
            </div>
            <Link href="/" className="btn-ghost mb-1 w-full justify-center">← عرض المتجر</Link>
            <button onClick={logout} className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-rose-400 transition hover:bg-rose-500/10">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
              تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>

      {/* المحتوى */}
      <div className="flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-800 bg-ink-950/80 px-4 py-3 backdrop-blur lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="grid h-10 w-10 place-items-center rounded-lg border border-ink-700 text-ink-200 lg:hidden">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
          <div className="hidden lg:block">
            <p className="text-sm text-ink-400">مرحباً، <span className="font-bold text-ink-100">{state.admin?.name}</span> 👋</p>
          </div>
          <a href={`tel:${STORE.phone}`} className="flex items-center gap-2 rounded-lg border border-ink-700 px-3 py-2 text-xs font-semibold text-ink-200" dir="ltr">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            {STORE.phone}
          </a>
        </header>
        <div className="p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
