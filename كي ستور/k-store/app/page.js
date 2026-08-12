import Link from "next/link";
import { Product, Category } from "@/lib/db";
import { STORE } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

const FEATURES = [
  { icon: "M22 12h-4l-3 9L9 3l-3 9H2", title: "توصيل سريع", desc: "لكل المحافظات" },
  { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4", title: "دفع آمن 100%", desc: "إلكتروني ومشفّر" },
  { icon: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z", title: "دعم متواصل", desc: STORE.phone },
  { icon: "M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11", title: "منتجات أصلية", desc: "جودة مضمونة" },
];

export default async function HomePage() {
  const featured = Product.featured(8);
  const newest = Product.newest(10);
  const categories = Category.all();

  return (
    <div>
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900 via-ink-950 to-ink-950" />
        <div className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-gold-600/20 blur-[120px]" />
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-gold-500/10 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #d9a73c 1px, transparent 0)", backgroundSize: "32px 32px" }} />

        <div className="container-luxe relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:py-28">
          <div className="animate-fadeUp">
            <span className="badge mb-5 border border-gold-500/30 bg-gold-500/10 text-gold-300">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              متجر متنوع المنتجات • {STORE.country}
            </span>
            <h1 className="font-display text-4xl font-black leading-[1.15] text-ink-50 sm:text-5xl lg:text-6xl">
              تسوّق <span className="gold-text">بفخامة</span>
              <br />
              من <span className="gold-text">K-Store</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-300 sm:text-lg">
              آلاف المنتجات الأصلية بين يديك — إلكترونيات، أزياء، عطور، وأكثر.
              جودة مضمونة، أسعار تنافسية بالريال اليمني، ودفع إلكتروني آمن.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn-gold">
                تسوّق الآن
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </Link>
              <Link href="#categories" className="btn-outline">تصفح الفئات</Link>
            </div>
            <div className="mt-10 flex items-center gap-6">
              <div>
                <p className="font-display text-2xl font-extrabold gold-text">{Product.count()}+</p>
                <p className="text-xs text-ink-400">منتج متنوع</p>
              </div>
              <div className="h-10 w-px bg-ink-800" />
              <div>
                <p className="font-display text-2xl font-extrabold gold-text">{categories.length}</p>
                <p className="text-xs text-ink-400">فئة رئيسية</p>
              </div>
              <div className="h-10 w-px bg-ink-800" />
              <div>
                <p className="font-display text-2xl font-extrabold gold-text">24/7</p>
                <p className="text-xs text-ink-400">دعم متواصل</p>
              </div>
            </div>
          </div>

          {/* لوحة منتجات زجاجية */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {featured.slice(0, 4).map((p, i) => (
                <div
                  key={p.id}
                  className={`card overflow-hidden ${i % 2 === 0 ? "animate-floatY" : ""}`}
                  style={{ animationDelay: `${i * 0.4}s` }}
                >
                  <div className="aspect-square overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images?.[0]} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="truncate text-xs font-bold text-ink-100">{p.name}</p>
                    <p className="mt-1 text-sm font-extrabold gold-text">{Math.round(p.price).toLocaleString()} ر.ي</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute -bottom-6 -right-6 rounded-2xl border border-gold-500/30 bg-ink-950/90 px-5 py-4 shadow-luxe backdrop-blur">
              <p className="text-xs text-ink-400">للطلب والدعم</p>
              <p className="font-display text-xl font-extrabold gold-text" dir="ltr">{STORE.phone}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== مميزات ===== */}
      <section className="border-y border-ink-800 bg-ink-900/40">
        <div className="container-luxe grid grid-cols-2 gap-px lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-center gap-3 px-3 py-5 sm:px-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gold-500/30 bg-gold-500/10 text-gold-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={f.icon} /></svg>
              </span>
              <div>
                <p className="text-sm font-bold text-ink-100">{f.title}</p>
                <p className="text-xs text-ink-400" dir={f.desc === STORE.phone ? "ltr" : "rtl"}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== الفئات ===== */}
      <section id="categories" className="container-luxe py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-semibold text-gold-400">تسوّق حسب الفئة</p>
            <h2 className="section-title">استكشف فئاتنا</h2>
          </div>
          <Link href="/products" className="btn-ghost shrink-0">عرض الكل ←</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="group card card-hover flex flex-col items-center gap-3 p-5 text-center"
            >
              <span
                className="grid h-14 w-14 place-items-center rounded-2xl text-2xl transition group-hover:scale-110"
                style={{ background: `${c.color}22`, border: `1px solid ${c.color}55` }}
              >
                {c.icon}
              </span>
              <span className="text-xs font-semibold leading-tight text-ink-200 group-hover:text-gold-200">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== المنتجات المميزة ===== */}
      <section className="container-luxe py-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-semibold text-gold-400">الأكثر طلباً</p>
            <h2 className="section-title">منتجات مميزة</h2>
          </div>
          <Link href="/products" className="btn-ghost shrink-0">المزيد ←</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ===== بانر عروض ===== */}
      <section className="container-luxe py-16">
        <div className="relative overflow-hidden rounded-3xl border border-gold-500/30 bg-gradient-to-l from-ink-900 via-ink-950 to-ink-900 p-8 sm:p-12">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gold-500/20 blur-[90px]" />
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(45deg, #d9a73c 25%, transparent 25%, transparent 50%, #d9a73c 50%, #d9a73c 75%, transparent 75%)", backgroundSize: "24px 24px" }} />
          <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="badge mb-3 bg-gold-400 text-ink-950">عرض خاص</span>
              <h3 className="font-display text-2xl font-black text-ink-50 sm:text-3xl">عروض حصرية تصل إلى <span className="gold-text">40% خصم</span></h3>
              <p className="mt-2 max-w-md text-sm text-ink-300">اكتشف أحدث العروض على آلاف المنتجات. عروض لفترة محدودة — لا تفوّت الفرصة!</p>
            </div>
            <Link href="/products?sort=price_low" className="btn-gold shrink-0">
              تصفّح العروض
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== الأحدث ===== */}
      <section className="container-luxe py-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-semibold text-gold-400">وصل حديثاً</p>
            <h2 className="section-title">أحدث المنتجات</h2>
          </div>
          <Link href="/products?sort=newest" className="btn-ghost shrink-0">المزيد ←</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {newest.slice(0, 10).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ===== CTA هاتفي ===== */}
      <section className="container-luxe py-16">
        <div className="card flex flex-col items-center gap-5 p-8 text-center sm:p-12">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gold-500/15 text-gold-300">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </span>
          <div>
            <h3 className="font-display text-2xl font-extrabold text-ink-50">تحتاج مساعدة في اختيار منتجك؟</h3>
            <p className="mt-2 text-sm text-ink-400">فريقنا جاهز لمساعدتك يومياً — تواصل معنا الآن</p>
          </div>
          <a href={`tel:${STORE.phone}`} className="btn-gold" dir="ltr">{STORE.phone}</a>
        </div>
      </section>
    </div>
  );
}
