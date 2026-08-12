import Link from "next/link";
import { Category } from "@/lib/db";
import { STORE } from "@/lib/utils";

export default async function Footer() {
  const categories = Category.all().slice(0, 8);

  return (
    <footer className="mt-20 border-t border-ink-800 bg-ink-950">
      <div className="container-luxe py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* العلامة */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-600 font-display text-2xl font-black text-ink-950">K</span>
              <div className="leading-none">
                <p className="font-display text-2xl font-extrabold text-ink-50">K-STORE</p>
                <p className="text-[10px] font-semibold tracking-widest text-gold-400/80">LUXURY MARKET</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-ink-400">
              متجرك الفاخر المتنوع المنتجات. جودة مضمونة، أسعار تنافسية، وتوصيل سريع لكل المحافظات.
            </p>
            <div className="mt-5 flex gap-2.5">
              {["wa", "ig", "fb", "tk"].map((s) => (
                <span key={s} className="grid h-9 w-9 place-items-center rounded-lg border border-ink-800 bg-ink-900 text-ink-400 transition hover:border-gold-500/50 hover:text-gold-300">
                  {s === "wa" && <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.2-1.4A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.5-5.6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3c-.2.3-.9.9-.9 2.1s.9 2.5 1 2.6c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1-.1-.2-.3-.2-.5-.3z"/></svg>}
                  {s === "ig" && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>}
                  {s === "fb" && <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>}
                  {s === "tk" && <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a5 5 0 0 0 4 2V7a3 3 0 0 1-3-3h-3v10a2.5 2.5 0 1 1-2.5-2.5v-3A5.5 5.5 0 1 0 16 14z"/></svg>}
                </span>
              ))}
            </div>
          </div>

          {/* الفئات */}
          <div>
            <h4 className="mb-4 font-bold text-ink-100">الفئات</h4>
            <ul className="space-y-2.5 text-sm">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/category/${c.slug}`} className="text-ink-400 transition hover:text-gold-300">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* روابط */}
          <div>
            <h4 className="mb-4 font-bold text-ink-100">روابط سريعة</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/products" className="text-ink-400 transition hover:text-gold-300">كل المنتجات</Link></li>
              <li><Link href="/cart" className="text-ink-400 transition hover:text-gold-300">سلة التسوق</Link></li>
              <li><Link href="/checkout" className="text-ink-400 transition hover:text-gold-300">إتمام الطلب</Link></li>
              <li><Link href="/admin" className="text-ink-400 transition hover:text-gold-300">لوحة تحكم المالك</Link></li>
              <li><a href={`tel:${STORE.phone}`} className="text-ink-400 transition hover:text-gold-300" dir="ltr">{STORE.phone}</a></li>
            </ul>
          </div>

          {/* تواصل */}
          <div>
            <h4 className="mb-4 font-bold text-ink-100">تواصل معنا</h4>
            <ul className="space-y-3 text-sm text-ink-400">
              <li className="flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-gold-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <a href={`tel:${STORE.phone}`} dir="ltr" className="hover:text-gold-300">{STORE.phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-gold-400"><path d="M4 4h16v16H4z"/><path d="m22 6-10 7L2 6"/></svg>
                {STORE.email}
              </li>
              <li className="flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-gold-400"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {STORE.city}، {STORE.country}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink-800 pt-6 sm:flex-row">
          <p className="text-xs text-ink-500">© {new Date().getFullYear()} K-Store. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-3 text-ink-500">
            <span className="text-xs">طرق الدفع:</span>
            <span className="rounded-md border border-ink-700 bg-ink-900 px-2 py-1 text-[10px] font-bold">VISA</span>
            <span className="rounded-md border border-ink-700 bg-ink-900 px-2 py-1 text-[10px] font-bold">Mastercard</span>
            <span className="rounded-md border border-ink-700 bg-ink-900 px-2 py-1 text-[10px] font-bold">مدى</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
