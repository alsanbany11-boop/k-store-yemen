/**
 * بذرة قاعدة البيانات — تملأ الفئات والمنتجات والمنتجات المميزة والإعدادات والمشرف.
 * التشغيل: node lib/seed.js           (يزرع فقط إذا كانت قاعدة البيانات فارغة)
 *          node lib/seed.js --force   (يمسح ويعيد الزرع)
 */
const { db, Category, Product, Order, Settings, Admin, slugify } = require("./db");
const bcrypt = require("bcryptjs");
const { makePlaceholder } = require("./placeholder");

const FORCE = process.argv.includes("--force");

if (FORCE) {
  db.exec("DELETE FROM products; DELETE FROM categories; DELETE FROM orders;");
  console.log("› تم مسح البيانات السابقة.");
}

/* ----------------- الفئات ----------------- */
const CATEGORIES = [
  { slug: "phones", name: "هواتف وإكسسوارات", icon: "📱", color: "#1e3a8a", desc: "أحدث الهواتف الذكية والشواحن والإكسسوارات الأصلية" },
  { slug: "electronics", name: "إلكترونيات", icon: "🎧", color: "#115e59", desc: "سماعات وحواسيب وكاميرات وأجهزة إلكترونية" },
  { slug: "home-appliances", name: "أجهزة منزلية", icon: "🏠", color: "#9a3412", desc: "ثلاجات وغسالات وأجهزة المطبخ الكهربائية" },
  { slug: "men-fashion", name: "أزياء رجالية", icon: "👔", color: "#475569", desc: "ملابس رجالية أنيقة بجودة عالية" },
  { slug: "women-fashion", name: "أزياء نسائية", icon: "👗", color: "#9d174d", desc: "عبايات وفستاني وملابس نسائية راقية" },
  { slug: "shoes", name: "أحذية", icon: "👟", color: "#b45309", desc: "أحذية رياضية وكلاسيكية لكل الأذواق" },
  { slug: "bags", name: "حقائب", icon: "👜", color: "#6d28d9", desc: "حقائب يد وظهر ومحافظ جلدية" },
  { slug: "watches-jewelry", name: "ساعات ومجوهرات", icon: "⌚", color: "#a16207", desc: "ساعات ذكية وكلاسيكية ومجوهرات ثمينة" },
  { slug: "beauty-care", name: "جمال وعناية", icon: "🧴", color: "#be185d", desc: "عطور ومكياج ومنتجات عناية فاخرة" },
  { slug: "sports", name: "رياضة ولياقة", icon: "🏋️", color: "#15803d", desc: "معدات رياضية ولياقة بدنية" },
  { slug: "kids", name: "مستلزمات أطفال", icon: "🧸", color: "#ea580c", desc: "كل ما يحتاجه طفلك بأمان وجودة" },
  { slug: "furniture", name: "أثاث وديكور", icon: "🛋️", color: "#854d0e", desc: "أثاث منزلي وقطع ديكور أنيقة" },
  { slug: "groceries", name: "أغذية وتموين", icon: "🛒", color: "#16a34a", desc: "منتجات غذائية طبيعية وتموينية" },
];

const slugToId = {};
if (Category.count() === 0) {
  CATEGORIES.forEach((c, i) => {
    const res = Category.create({
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      color: c.color,
      description: c.desc,
      sort_order: i,
    });
    slugToId[c.slug] = res.lastInsertRowid;
  });
  console.log(`› تم إنشاء ${CATEGORIES.length} فئة.`);
} else {
  Category.all().forEach((c) => (slugToId[c.slug] = c.id));
  console.log("› الفئات موجودة مسبقاً.");
}

/* ----------------- المنتجات ----------------- */
const PRODUCTS = [
  // هواتف
  { n: "آيفون 15 برو ماكس 256GB", cat: "phones", price: 285000, cmp: 320000, brand: "Apple", rating: 4.9, rev: 320, stock: 18, feat: true, tags: ["آيفون","أبل","5G","كاميرا احترافية"] },
  { n: "سامسونج جالاكسي S24 ألترا", cat: "phones", price: 245000, cmp: 270000, brand: "Samsung", rating: 4.8, rev: 210, stock: 14, feat: true, tags: ["سامسونج","أندرويد","قلم S Pen"] },
  { n: "شاومي ريدمي نوت 13 برو", cat: "phones", price: 78000, cmp: 89000, brand: "Xiaomi", rating: 4.6, rev: 175, stock: 40, tags: ["شاومي","اقتصادي","شحن سريع"] },
  { n: "شاحن سريع 65 واط أنكر", cat: "phones", price: 12500, cmp: 16000, brand: "Anker", rating: 4.7, rev: 96, stock: 120, tags: ["شاحن","شحن سريع","أنكر"] },
  { n: "سماعة بلوتوث أيربودز برو 2", cat: "phones", price: 42000, cmp: 52000, brand: "Apple", rating: 4.8, rev: 140, stock: 25, feat: true, tags: ["أيربودز","إلغاء ضوضاء"] },

  // إلكترونيات
  { n: "سماعة جي بي أل تون 5 بلوتوث", cat: "electronics", price: 18000, cmp: 22000, brand: "JBL", rating: 4.7, rev: 88, stock: 60, feat: true, tags: ["JBL","بلوتوث","مقاوم للماء"] },
  { n: "لابتوب ديل XPS 13", cat: "electronics", price: 320000, cmp: 360000, brand: "Dell", rating: 4.8, rev: 54, stock: 8, tags: ["دل","لابتوب","أداء عالي"] },
  { n: "سماعات سوني WH-1000XM5", cat: "electronics", price: 95000, cmp: 110000, brand: "Sony", rating: 4.9, rev: 130, stock: 16, feat: true, tags: ["سوني","إلغاء ضوضاء","جودة صوت"] },
  { n: "كاميرا كانون EOS R50", cat: "electronics", price: 210000, brand: "Canon", rating: 4.7, rev: 47, stock: 6, tags: ["كانون","كاميرا","بدون مرآة"] },

  // أجهزة منزلية
  { n: "ثلاجة LG نوفروست 18 قدم", cat: "home-appliances", price: 285000, cmp: 315000, brand: "LG", rating: 4.7, rev: 65, stock: 10, feat: true, tags: ["LG","ثلاجة","توفير طاقة"] },
  { n: "غسالة سامسونج أوتوماتيك 12 كيلو", cat: "home-appliances", price: 195000, brand: "Samsung", rating: 4.6, rev: 52, stock: 9, tags: ["سامسونج","غسالة","أوتوماتيك"] },
  { n: "خلاط براون متعدد الاستخدامات", cat: "home-appliances", price: 22000, cmp: 27000, brand: "Braun", rating: 4.5, rev: 73, stock: 45, feat: true, tags: ["خلاط","براون","مطبخ"] },
  { n: "ميكروويف توشيبا 30 لتر", cat: "home-appliances", price: 48000, brand: "Toshiba", rating: 4.4, rev: 38, stock: 20, tags: ["ميكروويف","توشيبا"] },

  // أزياء رجالية
  { n: "قميص رجالي كلاسيك قطني", cat: "men-fashion", price: 6500, cmp: 8500, rating: 4.5, rev: 120, stock: 80, feat: true, tags: ["قميص","رجالي","قطن"] },
  { n: "جينز رجالي سليم فيت", cat: "men-fashion", price: 11000, cmp: 14000, rating: 4.4, rev: 64, stock: 55, tags: ["جينز","رجالي"] },
  { n: "جاكيت رجالي جلد طبيعي", cat: "men-fashion", price: 38000, cmp: 48000, rating: 4.7, rev: 41, stock: 22, feat: true, tags: ["جاكيت","جلد","رجالي"] },
  { n: "تيشيرت رجالي قطني (3 قطع)", cat: "men-fashion", price: 9000, rating: 4.3, rev: 88, stock: 100, tags: ["تيشيرت","قطن","عرض"] },

  // أزياء نسائية
  { n: "عباية نسائية مطرزة فاخرة", cat: "women-fashion", price: 45000, cmp: 58000, rating: 4.8, rev: 76, stock: 30, feat: true, tags: ["عباية","مطرزة","نسائي"] },
  { n: "فستان سهرة أنيق", cat: "women-fashion", price: 52000, rating: 4.7, rev: 49, stock: 18, feat: true, tags: ["فستان","سهرة","نسائي"] },
  { n: "طرحة حرير مطرزة", cat: "women-fashion", price: 7500, cmp: 10000, rating: 4.5, rev: 95, stock: 70, tags: ["طرحة","حرير"] },
  { n: "بلوزة نسائية أنيقة", cat: "women-fashion", price: 8200, rating: 4.4, rev: 58, stock: 65, tags: ["بلوزة","نسائي"] },

  // أحذية
  { n: "حذاء رياضي نايك إير ماكس", cat: "shoes", price: 65000, cmp: 80000, brand: "Nike", rating: 4.8, rev: 112, stock: 35, feat: true, tags: ["نايك","رياضي","إير ماكس"] },
  { n: "حذاء جلد رجالي كلاسيك", cat: "shoes", price: 42000, brand: "Clarks", rating: 4.6, rev: 54, stock: 28, tags: ["كلاسيك","جلد","رجالي"] },
  { n: "صندل نسائي صيفي", cat: "shoes", price: 14500, rating: 4.3, rev: 67, stock: 50, tags: ["صندل","نسائي","صيفي"] },
  { n: "حذاء أديداس رياضي", cat: "shoes", price: 48000, cmp: 55000, brand: "Adidas", rating: 4.7, rev: 83, stock: 32, feat: true, tags: ["أديداس","رياضي"] },

  // حقائب
  { n: "حقيبة يد نسائية جلد", cat: "bags", price: 32000, cmp: 42000, rating: 4.6, rev: 71, stock: 26, feat: true, tags: ["حقيبة يد","جلد","نسائي"] },
  { n: "حقيبة ظهر لابتوب", cat: "bags", price: 18500, rating: 4.5, rev: 90, stock: 48, tags: ["حقيبة ظهر","لابتوب"] },
  { n: "محفظة رجالية جلد طبيعي", cat: "bags", price: 9800, rating: 4.4, rev: 102, stock: 60, tags: ["محفظة","جلد","رجالي"] },
  { n: "حقيبة سفر كبيرة", cat: "bags", price: 24000, rating: 4.3, rev: 39, stock: 22, tags: ["سفر","حقيبة"] },

  // ساعات ومجوهرات
  { n: "ساعة كاسيو رجالية G-Shock", cat: "watches-jewelry", price: 38000, cmp: 45000, brand: "Casio", rating: 4.8, rev: 130, stock: 24, feat: true, tags: ["كاسيو","مقاوم للماء","رجالي"] },
  { n: "ساعة ذكية أبل واتش SE", cat: "watches-jewelry", price: 95000, brand: "Apple", rating: 4.7, rev: 88, stock: 15, feat: true, tags: ["أبل واتش","ذكية"] },
  { n: "خاتم ذهب عيار 21", cat: "watches-jewelry", price: 120000, rating: 4.9, rev: 33, stock: 9, tags: ["ذهب","خاتم","عيار 21"] },
  { n: "سلسلة فضة 925", cat: "watches-jewelry", price: 16500, rating: 4.5, rev: 47, stock: 30, tags: ["فضة","سلسلة"] },

  // جمال وعناية
  { n: "عطر ديور سوفاج للرجال 100مل", cat: "beauty-care", price: 32000, cmp: 40000, brand: "Dior", rating: 4.9, rev: 156, stock: 28, feat: true, tags: ["ديور","عطر","رجالي"] },
  { n: "كريم مرطب للوجه", cat: "beauty-care", price: 6200, rating: 4.5, rev: 84, stock: 90, tags: ["كريم","مرطب","عناية"] },
  { n: "مجموعة مكياج كاملة", cat: "beauty-care", price: 28000, cmp: 35000, rating: 4.6, rev: 62, stock: 20, feat: true, tags: ["مكياج","مجموعة"] },
  { n: "بخور عود ملكي 50 جم", cat: "beauty-care", price: 18500, rating: 4.8, rev: 45, stock: 35, tags: ["بخور","عود","ملكي"] },

  // رياضة
  { n: "دمبلز حديد 20 كيلو (زوج)", cat: "sports", price: 24000, rating: 4.6, rev: 58, stock: 30, feat: true, tags: ["دمبل","حديد","لياقة"] },
  { n: "كرة قدم احترافية", cat: "sports", price: 8500, rating: 4.4, rev: 120, stock: 70, tags: ["كرة","قدم"] },
  { n: "سجادة يوجا مضادة للانزلاق", cat: "sports", price: 6800, rating: 4.5, rev: 73, stock: 55, tags: ["يوجا","سجادة"] },
  { n: "دراجة هوائية جبلية", cat: "sports", price: 125000, cmp: 145000, rating: 4.7, rev: 29, stock: 7, feat: true, tags: ["دراجة","جبلية"] },

  // أطفال
  { n: "لعبة تعليمية تفاعلية", cat: "kids", price: 14500, rating: 4.6, rev: 64, stock: 40, feat: true, tags: ["لعبة","تعليمية","أطفال"] },
  { n: "كرسي سيارة للأطفال", cat: "kids", price: 38000, rating: 4.7, rev: 38, stock: 14, tags: ["كرسي","سيارة","أمان"] },
  { n: "طقم ملابس أطفال (3 قطع)", cat: "kids", price: 7200, rating: 4.4, rev: 91, stock: 80, tags: ["ملابس","أطفال","طقم"] },
  { n: "عربة أطفال قابلة للطي", cat: "kids", price: 65000, cmp: 78000, rating: 4.8, rev: 52, stock: 11, feat: true, tags: ["عربة","أطفال","قابلة للطي"] },

  // أثاث
  { n: "كنبة 3 مقاعد عصرية", cat: "furniture", price: 145000, rating: 4.6, rev: 34, stock: 8, feat: true, tags: ["كنبة","أثاث","عصري"] },
  { n: "طاولة طعام خشب 6 أشخاص", cat: "furniture", price: 95000, rating: 4.5, rev: 27, stock: 6, tags: ["طاولة","طعام","خشب"] },
  { n: "مكتب دراسة بمرفق", cat: "furniture", price: 42000, rating: 4.4, rev: 48, stock: 18, tags: ["مكتب","دراسة"] },
  { n: "مرتبة سرير طبية", cat: "furniture", price: 58000, cmp: 70000, rating: 4.7, rev: 56, stock: 12, feat: true, tags: ["مرتبة","طبية","سرير"] },

  // أغذية
  { n: "عسل سدر طبيعي 1 كيلو", cat: "groceries", price: 12500, rating: 4.9, rev: 140, stock: 60, feat: true, tags: ["عسل","سدر","طبيعي"] },
  { n: "قهوة لافازا إكسبريسو 1 كيلو", cat: "groceries", price: 6800, brand: "Lavazza", rating: 4.6, rev: 88, stock: 80, tags: ["قهوة","لافازا"] },
  { n: "تمر المجهول الفاخر 2 كيلو", cat: "groceries", price: 8500, rating: 4.8, rev: 75, stock: 70, feat: true, tags: ["تمر","مجهول","فاخر"] },
  { n: "زيت زيتون بكر ممتاز 3 لتر", cat: "groceries", price: 9200, rating: 4.7, rev: 64, stock: 50, tags: ["زيت زيتون","بكر"] },
];

function shortDesc(p) {
  const catName = CATEGORIES.find((c) => c.slug === p.cat)?.name || "";
  return `${catName} • ${p.tags?.[0] || "جودة عالية"} • أصلي 100%`;
}

function longDesc(p) {
  return `${p.n} — منتج مختار بعناية، يجمع بين الجودة العالية والقيمة الرائعة.
أبرز المميزات:
• منتج أصلي 100% ومعتمد.
• جودة مضمونة وسعر تنافسي بالريال اليمني.
• توصيل سريع وخدمة عملاء على الرقم 771717913.
• الدفع الإلكتروني الآمن عند الطلب.`;
}

if (Product.count() === 0) {
  let count = 0;
  PRODUCTS.forEach((p, i) => {
    const catId = slugToId[p.cat];
    const images = [
      makePlaceholder(p.cat, p.n, i),
      makePlaceholder(p.cat, p.n, i + 100),
      makePlaceholder(p.cat, p.n, i + 200),
    ];
    Product.create({
      name: p.n,
      short_description: shortDesc(p),
      description: longDesc(p),
      price: p.price,
      compare_price: p.cmp || Math.round(p.price * 1.18),
      category_id: catId,
      images,
      stock: p.stock,
      sku: "KS-" + p.cat.slice(0, 3).toUpperCase() + "-" + (1000 + i),
      brand: p.brand || "K-Store",
      tags: p.tags || [],
      rating: p.rating || 4.5,
      reviews_count: p.rev || 0,
      featured: p.feat || false,
      status: "active",
    });
    count++;
  });
  console.log(`› تم إضافة ${count} منتج.`);
} else {
  console.log("› المنتجات موجودة مسبقاً (" + Product.count() + ").");
}

/* ----------------- الإعدادات ----------------- */
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
console.log("› تم حفظ إعدادات المتجر.");

/* ----------------- المشرف ----------------- */
if (Admin.count() === 0) {
  const hash = bcrypt.hashSync("kstore2024", 10);
  Admin.create("owner", hash, "مالك المتجر");
  console.log("› تم إنشاء حساب المالك: owner / kstore2024");
} else {
  console.log("› حساب المالك موجود.");
}

console.log("\n✅ اكتملت البذرة. المتجر جاهز.");
console.log(`   المنتجات: ${Product.count()} | الفئات: ${Category.count()} | الطلبات: ${Order.count()}`);
