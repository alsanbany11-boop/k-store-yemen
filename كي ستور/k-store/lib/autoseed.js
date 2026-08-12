/**
 * تشغيل تلقائي عند بدء التطبيق في الإنتاج:
 * يزرع البيانات الأولية (الفئات، المنتجات، المالك) إذا كانت قاعدة البيانات فارغة.
 */
const { Product, Category, Admin, Settings } = require("./db");
const bcrypt = require("bcryptjs");

function autoSeed() {
  let seeded = false;

  // الفئات
  const CATS = [
    { slug: "phones", name: "هواتف وإكسسوارات", icon: "📱", color: "#1e3a8a", desc: "أحدث الهواتف الذكية والإكسسوارات الأصلية" },
    { slug: "electronics", name: "إلكترونيات", icon: "🎧", color: "#115e59", desc: "سماعات وحواسيب وأجهزة إلكترونية" },
    { slug: "home-appliances", name: "أجهزة منزلية", icon: "🏠", color: "#9a3412", desc: "ثلاجات وغسالات وأجهزة المطبخ" },
    { slug: "men-fashion", name: "أزياء رجالية", icon: "👔", color: "#475569", desc: "ملابس رجالية أنيقة" },
    { slug: "women-fashion", name: "أزياء نسائية", icon: "👗", color: "#9d174d", desc: "ملابس نسائية راقية" },
    { slug: "shoes", name: "أحذية", icon: "👟", color: "#b45309", desc: "أحذية رياضية وكلاسيكية" },
    { slug: "bags", name: "حقائب", icon: "👜", color: "#6d28d9", desc: "حقائب يد وظهر ومحافظ" },
    { slug: "watches-jewelry", name: "ساعات ومجوهرات", icon: "⌚", color: "#a16207", desc: "ساعات ومجوهرات ثمينة" },
    { slug: "beauty-care", name: "جمال وعناية", icon: "🧴", color: "#be185d", desc: "عطور ومنتجات عناية فاخرة" },
    { slug: "sports", name: "رياضة ولياقة", icon: "🏋️", color: "#15803d", desc: "معدات رياضية ولياقة" },
    { slug: "kids", name: "مستلزمات أطفال", icon: "🧸", color: "#ea580c", desc: "كل ما يحتاجه طفلك" },
    { slug: "furniture", name: "أثاث وديكور", icon: "🛋️", color: "#854d0e", desc: "أثاث وقطع ديكور أنيقة" },
    { slug: "groceries", name: "أغذية وتموين", icon: "🛒", color: "#16a34a", desc: "منتجات غذائية وتموينية" },
  ];

  const slugToId = {};
  if (Category.count() === 0) {
    CATS.forEach((c, i) => {
      const r = Category.create({ name: c.name, slug: c.slug, icon: c.icon, color: c.color, description: c.desc, sort_order: i });
      slugToId[c.slug] = r.lastInsertRowid;
    });
    seeded = true;
  } else {
    Category.all().forEach((c) => (slugToId[c.slug] = c.id));
  }

  // المالك
  if (Admin.count() === 0) {
    const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "kstore2024", 10);
    Admin.create(process.env.ADMIN_USERNAME || "owner", hash, "مالك المتجر");
    seeded = true;
  }

  // الإعدادات
  if (!Settings.get("store_name")) {
    Settings.setMany({
      store_name: "K-Store",
      store_phone: "771717913",
      store_email: "info@k-store.ye",
      store_city: "تعز",
      store_country: "اليمن",
      store_currency: "ر.ي",
      free_shipping_threshold: "100000",
      shipping_cost: "3000",
      announcement: "توصيل سريع لكل المحافظات • الدفع الإلكتروني الآمن • للطلب: 771717913",
    });
    seeded = true;
  }

  if (seeded) {
    console.log("[AutoSeed] تم زرع البيانات الأولية تلقائياً.");
  }
  return seeded;
}

module.exports = { autoSeed };
