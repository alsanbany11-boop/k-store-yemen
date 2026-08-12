import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
  display: "swap",
  weight: ["400", "500", "700", "800", "900"],
});

export const metadata = {
  title: "K-Store | متجرك الفاخر",
  description: "K-Store — متجر متنوع المنتجات، جودة عالية وأسعار تنافسية بالريال اليمني. توصيل سريع ودفع إلكتروني آمن. للطلب: 771717913",
  keywords: ["متجر", "تسوق", "K-Store", "اليمن", "تعز", "إلكترونيات", "أزياء"],
};

export const viewport = {
  themeColor: "#0a0908",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable}`}>
      <body className="min-h-screen bg-ink-950 font-sans antialiased">
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
