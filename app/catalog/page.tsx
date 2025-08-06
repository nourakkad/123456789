'use client';
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

export default function CatalogDownloadPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const langParam = searchParams.get('lang');
  const isArabic = pathname.includes('/ar') || langParam === 'ar';

  const translations = {
    en: {
      title: "TIMBEX",
      subtitle: "Indoor Flooring & Outdoor Decking",
      description: "Professional Solutions for Every Space",
      catalogTitle: "Product Catalog 2025",
      catalogDescription: "Comprehensive guide to our premium flooring and decking solutions",
      updated: "Updated: Jan 2025",
      pdfFormat: "PDF Format",
      features: [
        "Complete product range with specifications",
        "High-quality images and detailed descriptions",
        "Installation guides and maintenance tips",
        "Pricing information and contact details"
      ],
      downloadButton: "Download Catalog",
      needHelp: "Need help? Contact our team",
      callUs: "Call Us",
      emailUs: "Email Us",
      copyright: "© 2025 TIMBEX. All rights reserved.",
      location: "Damascus, Syria"
    },
    ar: {
      title: "تيمبكس",
      subtitle: "أرضيات داخلية وتراس خارجي",
      description: "حلول احترافية لكل مساحة",
      catalogTitle: "كتالوج المنتجات 2025",
      catalogDescription: "دليل شامل لحلول الأرضيات والتراس المميزة",
      updated: "محدث: يناير 2025",
      pdfFormat: "صيغة PDF",
      features: [
        "مجموعة منتجات كاملة مع المواصفات",
        "صور عالية الجودة ووصف مفصل",
        "أدلة التركيب ونصائح الصيانة",
        "معلومات الأسعار وبيانات الاتصال"
      ],
      downloadButton: "تحميل الكتالوج",
      needHelp: "تحتاج مساعدة؟ اتصل بفريقنا",
      callUs: "اتصل بنا",
      emailUs: "راسلنا",
      copyright: "© 2025 تيمبكس. جميع الحقوق محفوظة.",
      location: "دمشق، سوريا"
    }
  };

  const t = translations[isArabic ? 'ar' : 'en'];

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-green-900 mb-2">{t.title}</h1>
            <p className="text-green-700 font-semibold mb-1">{t.subtitle}</p>
            <p className="text-gray-600 text-sm">{t.description}</p>
          </div>

          {/* Catalog Preview */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 mb-6 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-green-900 mb-2">{t.catalogTitle}</h2>
            <p className="text-gray-600 text-sm mb-4">{t.catalogDescription}</p>
            <div className="flex justify-center items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t.updated}
              </span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t.pdfFormat}
              </span>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-3 mb-6">
            {t.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* Download Button */}
          <div className="space-y-4">
            <a
              href="/timbex-catalog-2025.pdf"
              download
              className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t.downloadButton}
            </a>
            
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">{t.needHelp}</p>
              <div className="flex justify-center gap-4">
                <a href="tel:+963968484801" className="text-green-600 text-sm font-medium flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.516 2.064a2 2 0 01-.45 1.958l-1.27 1.27a16.001 16.001 0 006.586 6.586l1.27-1.27a2 2 0 011.958-.45l2.064.516A2 2 0 0121 18.72V21a2 2 0 01-2 2h-1C9.163 23 1 14.837 1 5V4a2 2 0 012-2z" />
                  </svg>
                  {t.callUs}
                </a>
                <a href="mailto:info@timbex-sy.com" className="text-green-600 text-sm font-medium flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 6l-10 7L2 6" />
                  </svg>
                  {t.emailUs}
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              {t.copyright}<br />
              {t.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
