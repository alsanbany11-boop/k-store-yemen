const STORE = {
  name: "K-Store",
  phone: "771717913",
  phoneIntl: "+967771717913",
  whatsapp: "967771717913",
  email: "info@k-store.ye",
  city: "تعز",
  country: "اليمن",
  currency: "ر.ي",
  currencyEn: "YER",
};

function formatPrice(n) {
  if (n == null || isNaN(n)) return "—";
  const v = Math.round(Number(n));
  return v.toLocaleString("en-US") + " ر.ي";
}

function formatNumber(n) {
  return Number(n || 0).toLocaleString("en-US");
}

function discountPercent(price, comparePrice) {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T") + "Z");
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return "الآن";
  const min = Math.floor(sec / 60);
  if (min < 60) return `قبل ${min} دقيقة`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `قبل ${hr} ساعة`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `قبل ${day} يوم`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `قبل ${mo} شهر`;
  return `قبل ${Math.floor(mo / 12)} سنة`;
}

const ORDER_STATUS = {
  pending: { label: "قيد المراجعة", color: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  confirmed: { label: "مؤكد", color: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  shipped: { label: "تم الشحن", color: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" },
  delivered: { label: "تم التوصيل", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  cancelled: { label: "ملغي", color: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
};

module.exports = { STORE, formatPrice, formatNumber, discountPercent, timeAgo, ORDER_STATUS };
