/**
 * K-Store AI Product Generator
 * ----------------------------
 * يحلل الصورة (عبر اسم الملف/النوع) والوصف النصي، ثم يولّد تلقائياً:
 *  - اسم المنتج الاحترافي
 *  - الفئة المناسبة
 *  - السعر المقترح (بالريال اليمني)
 *  - الوصف التسويقي التفصيلي
 *  - العلامة التجارية المحتملة
 *  - الكلمات المفتاحية/الوسوم
 *
 * هذا المحرك يعمل محلياً (بدون مفاتيح API) ويمكن استبداله لاحقاً بنموذج LLM خارجي
 * عبر تعديل دالة generateProduct فقط.
 */

const { Category } = require("./db");

// قاعدة بيانات الفئات مع كلماتها المفتاحية ونطاقات أسعارها (بالريال اليمني)
const CATALOG = [
  {
    slug: "phones",
    name: "هواتف وإكسسوارات",
    keywords: ["هاتف", "موبايل", "جوال", "تلفون", "phone", "mobile", "smartphone", "ايفون", "iphone", "سامسونج", "samsung", "هواوي", "huawei", "شاومي", "xiaomi", "شيومي", "oppo", "شارجر", "شاحن", "charger", "سماعة", "كابل", "usb", "باوربانك", "powerbank", "جراب", "كفر", "case", "حافظة", "سكرين", "زجاج", "بلوتوث"],
    brands: ["Apple", "Samsung", "Huawei", "Xiaomi", "Oppo", "Realme", "Anker", "JBL"],
    price: { min: 6000, max: 650000 },
    unit: "جهاز",
    features: ["بطارية طويلة العمر", "شحن سريع", "كاميرا عالية الدقة", "أداء قوي", "شاشة واضحة", "تصميم أنيق"],
  },
  {
    slug: "electronics",
    name: "إلكترونيات",
    keywords: ["إلكترون", "الكترون", "سماعة", "سبيكر", "speaker", "耳机", "headphone", "earbuds", "لابتوب", "لاب توب", "حاسوب", "كمبيوتر", "laptop", "computer", "pc", "تابلت", "tablet", "ايباد", "ipad", "كاميرا", "camera", "تلفزيون", "تلفاز", "tv", "كيبورد", "ماوس", "router", "راوتر", "مودم", "كارت ميموري", "sd", "فلاش", "flash", "rgb", "gaming"],
    brands: ["Sony", "Logitech", "Dell", "HP", "Lenovo", "Asus", "Canon", "Nikon", "Bose"],
    price: { min: 15000, max: 500000 },
    unit: "قطعة",
    features: ["جودة صوت نقية", "أداء عالي", "تقنية حديثة", "ضمان", "سهل الاستخدام", "تصميم مدمج"],
  },
  {
    slug: "home-appliances",
    name: "أجهزة منزلية",
    keywords: ["ثلاجة", "غسالة", "مكنسة", "خلاط", "مكسر", "عصارة", "ميكروويف", "فرن", "سخان", "مكواة", "محمصة", "تدفئة", "مروحة", "تكييف", "مياه", "بوتاجاز", "fridge", "washer", "washing", "vacuum", "blender", "microwave", "oven", "iron", "air conditioner", "fan", "kitchen", "كهربائي", "منزلي", "مطبخ"],
    brands: ["LG", "Samsung", "Toshiba", "Panasonic", "Philips", "Black & Decker", "Braun"],
    price: { min: 20000, max: 450000 },
    unit: "قطعة",
    features: ["توفير في الطاقة", "سعة مناسبة", "تشغيل هادئ", "تحكم سهل", "ضمان", "متين"],
  },
  {
    slug: "men-fashion",
    name: "أزياء رجالية",
    keywords: ["رجالي", "قميص", "بنطلون", "بناطيل", "جينز", "جاكيت", "بدلة", "ثوب", "مشلح", "كاب", "تيشيرت", "تي شيرت", "tshirt", "بنطال", "شورت", "جورب", "حزام", "men", "mens", "man", "رجال"],
    brands: ["Zara", "H&M", "Polo", "Nike", "Adidas", "Levi's", "Tommy"],
    price: { min: 3000, max: 60000 },
    unit: "قطعة",
    features: ["خامة قطنية مريحة", "تصميم عصري", "مقاسات متنوعة", "ألوان أنيقة", "خياطة متينة", "مناسبة لكل المناسبات"],
  },
  {
    slug: "women-fashion",
    name: "أزياء نسائية",
    keywords: ["نسائي", "فستان", "عباية", "حجاب", "طرحة", "بلوزة", "تنورة", "جيب", "نقاب", "شيله", "كاب نسائي", "تيشيرت نسائي", "جينز نسائي", "women", "women's", "ladies", "نساء", "حريم", "حجاب"],
    brands: ["Zara", "H&M", "Mango", "Max", "Shein", "LC Waikiki"],
    price: { min: 3500, max: 75000 },
    unit: "قطعة",
    features: ["خامة فاخرة", "تصميم أنيق", "مقاسات مدمجة", "ألوان راقية", "مريحة طوال اليوم", "تفاصيل دقيقة"],
  },
  {
    slug: "shoes",
    name: "أحذية",
    keywords: ["حذاء", "حذاء", "جزمة", "صندل", "كوتشي", "سبورت", "نعال", "بوت", "سنيكر", "sneaker", "shoe", "shoes", "boot", "sandal", "نعال", "كلاسيك", "رياضي"],
    brands: ["Nike", "Adidas", "Puma", "New Balance", "Vans", "Converse", "Timberland"],
    price: { min: 8000, max: 90000 },
    unit: "زوج",
    features: ["نعل مريح", "خامة جلدية", "تقويم القدم", "خفيفة الوزن", "تصميم رياضي", "متانة عالية"],
  },
  {
    slug: "bags",
    name: "حقائب",
    keywords: ["حقيبة", "شنطة", "محفظة", "شنطة يد", "شنطة ظهر", "لابتوب", "سفر", "bag", "handbag", "backpack", "wallet", "purse", "حقيبة يد", "حقيبة ظهر"],
    brands: ["Louis Vuitton", "Gucci", "Michael Kors", "Coach", "Herschel", "Eastpak"],
    price: { min: 5000, max: 120000 },
    unit: "قطعة",
    features: ["مساحة واسعة", "خامة جلد طبيعي", "جيوب متعددة", "حزام قابل للتعديل", "تصميم عملي", "خفيفة ومتينة"],
  },
  {
    slug: "watches-jewelry",
    name: "ساعات ومجوهرات",
    keywords: ["ساعة", "watch", "ساعة يد", "ساعة ذكية", "smartwatch", "ذهب", "فضة", "خاتم", "سلسلة", "قلادة", "حلق", "أسورة", "ذهبي", "خاتم", "مجوهرات", "jewelry", "ring", "necklace", "bracelet", "earring", "سوار"],
    brands: ["Rolex", "Casio", "Apple", "Citizen", "Omega", "Daniel Wellington"],
    price: { min: 10000, max: 400000 },
    unit: "قطعة",
    features: ["مقاوم للماء", "تصميم فاخر", "حركة دقيقة", "خامة ستانلس ستيل", "بطارية طويلة", "إطلالة راقية"],
  },
  {
    slug: "beauty-care",
    name: "جمال وعناية",
    keywords: ["عطر", "دخون", "بخور", "كريم", "شامبو", "صابون", "مكياج", "روج", "كحل", "ماسك", "عناية", "بشرة", "شعر", "لوشن", "perfume", "cream", "makeup", "lotion", "shampoo", "care", "تجميل", "كريم وجه"],
    brands: ["Dior", "Chanel", "L'Oréal", "Nivea", "Garnier", "Calvin Klein"],
    price: { min: 2000, max: 60000 },
    unit: "قطعة",
    features: ["تركيبة طبيعية", "مناسب لكل أنواع البشرة", "رائحة تدوم طويلاً", "ترطيب عميق", "نتائج ملحوظة", "خالٍ من المواد الضارة"],
  },
  {
    slug: "sports",
    name: "رياضة ولياقة",
    keywords: ["رياضي", "رياضة", "جمب", "دمبل", "كرة", "مضرب", "دراجة", "لياقة", "يوجا", " treadmill", "جري", "تمرين", "sport", "fitness", "gym", "ball", "racket", "bike", "yoga", "كمال أجسام", "بروتين"],
    brands: ["Nike", "Adidas", "Reebok", "Under Armour", "Decathlon", "Optimum Nutrition"],
    price: { min: 5000, max: 150000 },
    unit: "قطعة",
    features: ["تحسين الأداء", "خامة عالية الجودة", "مريح أثناء التمرين", "متين", "تصميم احترافي", "مناسب للاستخدام اليومي"],
  },
  {
    slug: "kids",
    name: "مستلزمات أطفال",
    keywords: ["أطفال", "طفل", "رضيع", "بيبي", "لعبة", "كرسي", "حفاضات", "ملابس أطفال", "kids", "baby", "child", "toy", "diaper", "كرسي سيارة", "عربة"],
    brands: ["Pampers", "Fisher-Price", "Lego", "Chicco", "Nuk", "Mee Mee"],
    price: { min: 3000, max: 80000 },
    unit: "قطعة",
    features: ["آمن للأطفال", "خامة لطيفة على البشرة", "تصميم ممتع", "تعليمي", "سهل التنظيف", "مقاسات مناسبة"],
  },
  {
    slug: "furniture",
    name: "أثاث وديكور",
    keywords: ["أثاث", "كنبة", "كرسي", "طاولة", "مكتب", "خزانة", "سرير", "مرتبة", "سجاد", "ديكور", "مزهرية", "أباجورة", "furniture", "sofa", "chair", "table", "desk", "bed", "carpet", "decor", "lamp"],
    brands: ["IKEA", "Ashley", "Home Centre", "West Elm", "Wayfair"],
    price: { min: 15000, max: 600000 },
    unit: "قطعة",
    features: ["خشب طبيعي", "تصميم عصري", "مساحة عملية", "تجميع سهل", "مريح", "يضفي لمسة أنيقة"],
  },
  {
    slug: "groceries",
    name: "أغذية وتموين",
    keywords: ["أكل", "طعام", "قهوة", "شاي", "عسل", "زيت", "سكر", "تمر", "مكسرات", "حلوى", "شوكولاتة", "بسكويت", "مشروب", "food", "coffee", "tea", "honey", "oil", "sugar", "dates", "snack"],
    brands: ["Lavazza", "Nestlé", "Almarai", "Nadec", "Twinky", "Maestro"],
    price: { min: 1000, max: 30000 },
    unit: "قطعة",
    features: ["جودة عالية", "طعم مميز", "تغليف محكم", "صلاحية طويلة", "منتج طبيعي", "قيمة ممتازة"],
  },
  {
    slug: "other",
    name: "منتجات متنوعة",
    keywords: [],
    brands: ["K-Store"],
    price: { min: 2000, max: 50000 },
    unit: "قطعة",
    features: ["جودة مضمونة", "تصميم أنيق", "قيمة رائعة", "مناسب للاستخدام اليومي"],
  },
];

function detectCatalog(text) {
  const t = " " + (text || "").toLowerCase() + " ";
  let best = null;
  let bestScore = 0;
  for (const cat of CATALOG) {
    let score = 0;
    for (const kw of cat.keywords) {
      if (!kw) continue;
      if (t.includes(kw.toLowerCase())) score += kw.length > 4 ? 3 : 2;
    }
    if (score > bestScore) {
      bestScore = score;
      best = cat;
    }
  }
  return best || CATALOG[CATALOG.length - 1];
}

function detectBrand(text, cat) {
  const t = " " + (text || "").toLowerCase() + " ";
  for (const b of cat.brands) {
    if (t.includes(b.toLowerCase())) return b;
  }
  // مرشح علامة محايدة
  return "";
}

function cleanProductName(desc, cat) {
  let name = (desc || "").trim();
  // إزالة الكلمات الزائدة
  const filler = ["هذا", "هذه", "منتج", "المنتج", "صورة", "اريد", "أريد", "بيع", "للبيع", "جديد", "this", "is", "a", "an", "product", "image", "photo"];
  name = name
    .split(/\s+/)
    .filter((w) => !filler.includes(w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "")))
    .join(" ")
    .trim();
  if (!name) name = cat.name.replace(/.$/, "ة");
  // تحديد طول مناسب
  if (name.length > 55) name = name.slice(0, 55).trim() + "…";
  // تكبير أول حرف عربي
  name = name.charAt(0).toUpperCase() + name.slice(1);
  // إضافة وحدة
  const cleanCat = cat.slug === "other" ? "" : ` ${cat.unit}`;
  if (name.length < 18 && cat.slug !== "other") {
    name = name + cleanCat;
  }
  return name.trim();
}

function suggestPrice(cat, text) {
  const t = (text || "").toLowerCase();
  const { min, max } = cat.price;
  let factor = 0.45; // نقطة منتصف-منخفضة كاقتراح افتراضي
  if (/فاخر|premium|luxury|بريميوم|ذهبي|pro|max|ultra|احترافي|original|اصلي|أصلي/.test(t)) factor = 0.85;
  else if (/اقتصادي|economic|بسيط| basic|عادي|رخيص|cheap/.test(t)) factor = 0.22;
  else if (/كبير|large|big|ضخم|مزدوج|double|family|عائلي|كامل|set|طقم/.test(t)) factor = 0.7;
  // قراءة رقم موجود في الوصف كتلميح
  const numMatch = t.match(/(\d[\d,]{3,})/);
  if (numMatch) {
    const n = parseFloat(numMatch[1].replace(/,/g, ""));
    if (n >= min * 0.4 && n <= max * 2.5) return Math.round(n / 100) * 100;
  }
  const price = Math.round((min + (max - min) * factor) / 100) * 100;
  return price;
}

function buildDescription(name, cat, text) {
  const feats = [...cat.features].sort(() => Math.random() - 0.5).slice(0, 4);
  const lines = [
    `${name} — منتج مختار بعناية من فئة ${cat.name}، يجمع بين الجودة العالية والتصميم الأنيق ليمنحك تجربة استثنائية.`,
    "أبرز المميزات:",
    ...feats.map((f) => `• ${f}`),
    "",
    "لماذا تختاره من K-Store؟",
    "• منتج أصلي 100% ومعتمد.",
    "• جودة مضمونة وأسعار تنافسية بالريال اليمني.",
    "• توصيل سريع وخدمة عملاء متجاوبة على الرقم 771717913.",
    "• إمكانية الدفع الإلكتروني الآمن عند الطلب.",
  ];
  return lines.join("\n");
}

function buildTags(cat, text) {
  const base = [cat.name, "k-store", "جودة عالية"];
  const t = (text || "").toLowerCase();
  if (/جديد|new/.test(t)) base.push("جديد");
  if (/عرض|تخفيض|discount|sale/.test(t)) base.push("عرض");
  if (/فاخر|luxury|premium/.test(t)) base.push("فاخر");
  return Array.from(new Set(base)).slice(0, 6);
}

function suggestStock(cat) {
  return cat.slug === "groceries" ? 50 : 15 + Math.floor(Math.random() * 35);
}

async function generateProduct({ description = "", imageFilename = "", imageType = "" } = {}) {
  const combined = `${description} ${imageFilename} ${imageType}`;
  const cat = detectCatalog(combined);

  // مطابقة الفئة مع قاعدة البيانات الحقيقية، أو إنشاء نمط مقبول
  const dbCat = Category.bySlug(cat.slug);
  const categoryId = dbCat ? dbCat.id : null;

  const name = cleanProductName(description, cat);
  const price = suggestPrice(cat, combined);
  // سعر للمقارنة أعلى قليلاً لإظهار الخصم
  const comparePrice = Math.round((price * (1.15 + Math.random() * 0.2)) / 100) * 100;
  const brand = detectBrand(combined, cat);
  const short_description = `${cat.name} • ${cat.features[0]} • جودة مضمونة`;
  const fullDescription = buildDescription(name, cat, combined);
  const tags = buildTags(cat, combined);
  const stock = suggestStock(cat);
  const sku = "KS-" + cat.slug.slice(0, 3).toUpperCase() + "-" + Math.floor(1000 + Math.random() * 9000);

  return {
    name,
    category_id: categoryId,
    category_slug: cat.slug,
    category_name: cat.name,
    price,
    compare_price: comparePrice,
    short_description,
    description: fullDescription,
    brand,
    tags,
    stock,
    sku,
    featured: false,
    status: "active",
    confidence: dbCat ? "عالية" : "متوسطة",
  };
}

module.exports = { generateProduct, CATALOG, detectCatalog };
