# 🚀 دليل نشر ونشر K-Store على الإنترنت

هذا الدليل يشرح كيف تنشر متجر K-Store على الإنترنت برابط مجاني دائم، ثم كيف تربطه بدومين خاص بك (مثل k-store.com).

---

## ✅ الطريقة الأسهل: النشر على Render (مجاني + يدعم قاعدة البيانات)

> Render يدعم قاعدة بيانات SQLite بشكل دائم ومجاني — الأنسب لهذا المتجر.

### الخطوة 1: ارفع الكود إلى GitHub

1. اذهب إلى [github.com](https://github.com) وأنشئ حساباً (مجاني) إذا لم يكن لديك
2. اضغط زر **＋ New repository** (مستودع جديد)
3. سمّه `k-store` واضغط **Create repository**
4. الآن ارفع الكود. إذا استخدمت GitHub Desktop أو المتصفح:
   - اسحب كل ملفات مجلد `k-store` (عدا `node_modules` و `.next` و `data`) وارفعها
   - أو من سطر الأوامر:
     ```bash
     git remote add origin https://github.com/اسم-حسابك/k-store.git
     git push -u origin main
     ```

### الخطوة 2: انشر على Render

1. اذهب إلى [render.com](https://render.com) وسجّل الدخول بحساب GitHub
2. اضغط **New +** ← **Web Service**
3. اختر مستودع `k-store` من GitHub
4. املأ الإعدادات:
   - **Name:** `k-store`
   - **Runtime:** Docker (سيقرأ Dockerfile تلقائياً)
   - **Instance Type:** Free
5. في قسم **Environment Variables** (متغيرات البيئة)، أضف:
   | المفتاح | القيمة |
   |---------|--------|
   | `ADMIN_USERNAME` | `owner` |
   | `ADMIN_PASSWORD` | `كلمة-مرور-قوية-هنا` |
   | `JWT_SECRET` | (اكتب أي نص عشوائي طويل) |
6. اضغط **Create Web Service** ✅

Render سيبني التطبيق ويمنحك رابطاً مثل:
```
https://k-store.onrender.com
```

> 🎉 هذا الرابط دائم ومجاني! شاركه مع أي شخص.

### الخطوة 3 (مهم): أضف قرصاً دائماً للبيانات

> لكي لا تضيع المنتجات والطلبات عند إعادة النشر:

1. في لوحة Render، افتح خدمتك ← **Disks** ← **Add Disk**
2. اضبط:
   - **Name:** `data`
   - **Mount Path:** `/app/data`
   - **Size:** 1 GB
3. احفظ

*(ملاحظة: القرص الدائم قد يتطلب الخطة المدفوعة. على الخطة المجانية، البيانات تُحفظ لكن قد تُمسح عند إعادة النشر — يمكنك إعادة زرعها عبر `npm run seed`.)*

---

## 🔄 الطريقة البديلة: النشر على Railway

> Railway أسهل ويدعم SQLite دائماً، مع رصيد مجاني تجريبي.

1. اذهب إلى [railway.app](https://railway.app) ← سجّل بـ GitHub
2. **New Project** ← **Deploy from GitHub repo** ← اختر `k-store`
3. Railway سيكتشف Dockerfile تلقائياً ويبني التطبيق
4. أضف **Volume** (قرص دائم) بمسار `/app/data`
5. أضف متغيرات البيئة (نفس التي بالأعلى)
6. ستحصل على رابط مثل: `https://k-store-production.up.railway.app`

---

## 🌐 ربط دومين خاص (k-store.com) — بعد النشر

بعد أن يصبح المتجر منشوراً على Render أو Railway:

### 1. اشترِ الدومين
- من [Namecheap](https://namecheap.com) أو [GoDaddy](https://godaddy.com) أو أي مسجّل
- ابحث عن `k-store.com` واشتره

### 2. اربطه بالخدمة
**على Render:**
- لوحة التحكم ← خدمتك ← **Settings** ← **Custom Domains** ← أضف `k-store.com`
- Render سيعطيك سجلات DNS (A record أو CNAME) لتضيفها عند مسجّل الدومين

**على Railway:**
- لوحة التحكم ← خدمتك ← **Settings** ← **Networking** ← **Generate Domain** أو أضف Custom Domain
- ستحصل على سجلات DNS لتضيفها

### 3. حدّث DNS عند مسجّل الدومين
- اذهب لإدارة DNS في موقع شراء الدومين
- أضف السجل الذي أعطتك إياه المنصة (مثلاً):
  ```
  Type:  CNAME
  Name:  @  (أو www)
  Value: k-store.onrender.com
  ```
- انتظر من دقائق إلى 24 ساعة حتى ينتشر الدومين

### 4. مبروك! 🎉
متجرك الآن على `https://k-store.com`

---

## 🔐 متغيرات البيئة (Environment Variables)

| المتغير | الوصف | مثال |
|---------|-------|------|
| `ADMIN_USERNAME` | اسم مستخدم المالك | `owner` |
| `ADMIN_PASSWORD` | كلمة مرور المالك (غيّرها!) | `MyStr0ngP@ss` |
| `JWT_SECRET` | مفتاح تشفير الجلسات | نص عشوائي طويل |
| `PORT` | منفذ التشغيل (تلقائي) | `3000` |

> ⚠️ **مهم:** غيّر كلمة المرور الافتراضية `kstore2024` فور نشر المتجر عبر متغير `ADMIN_PASSWORD`.

---

## 📞 الدعم
رقم المتجر: **771717913**
