import Link from "next/link";
import { Category } from "@/lib/db";
import { STORE } from "@/lib/utils";
import HeaderActions from "./HeaderActions";

export default async function Header() {
  const categories = Category.all();

  return (
    <header className="sticky top-0 z-50">
      {/* شريط الإعلان */}
      <div className="bg-gradient-to-l from-gold-700 via-gold-600 to-gold-700 text-ink-950">
        <div className="container-luxe flex h-9 items-center justify-between gap-3 text-[12px] font-semibold">
          <p className="truncate">{STORE.announcement}</p>
          <a href={`tel:${STORE.phone}`} className="hidden shrink-0 items-center gap-1.5 sm:flex" dir="ltr">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            {STORE.phone}
          </a>
        </div>
      </div>

      {/* الشريط الرئيسي */}
      <div className="glass border-b border-ink-800/80">
        <div className="container-luxe flex h-16 items-center gap-4">
          <Link href="/" className="group flex shrink-0 items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-600 font-display text-xl font-black text-ink-950 shadow-gold">K</span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-xl font-extrabold tracking-tight text-ink-50">K-STORE</span>
              <span className="text-[10px] font-semibold tracking-widest text-gold-400/80">LUXURY MARKET</span>
            </span>
          </Link>

          {/* البحث - سطح المكتب */}
          <form action="/products" method="get" className="relative mx-auto hidden max-w-xl flex-1 md:block">
            <input
              name="search"
              placeholder="ابحث عن آلاف المنتجات..."
              className="input pr-11"
              autoComplete="off"
            />
            <button type="submit" className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg bg-gold-400 text-ink-950 transition hover:bg-gold-300" aria-label="بحث">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
          </form>

          <nav className="hidden items-center gap-1 lg:flex">
            <Link href="/" className="btn-ghost">الرئيسية</Link>
            <Link href="/products" className="btn-ghost">المنتجات</Link>
            <Link href="/admin" className="btn-ghost text-gold-300 hover:text-gold-200">لوحة التحكم</Link>
          </nav>

          <HeaderActions categories={categories} />
        </div>
      </div>

      {/* شريط الفئات - سطح المكتب */}
      <div className="hidden border-b border-ink-800/60 bg-ink-950/80 backdrop-blur lg:block">
        <div className="container-luxe">
          <ul className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
            <li>
              <Link href="/products" className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-semibold text-ink-200 transition hover:bg-ink-800 hover:text-gold-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
                كل المنتجات
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/category/${c.slug}`}
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium text-ink-300 transition hover:bg-ink-800 hover:text-gold-300"
                >
                  <span>{c.icon}</span>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
