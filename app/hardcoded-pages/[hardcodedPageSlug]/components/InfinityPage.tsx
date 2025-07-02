"use client"

import { Category, Product } from "@/lib/data"
import { notFound, useSearchParams } from "next/navigation"
import ProductCard from "@/components/product-card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ReadMoreText from "@/components/ReadMoreText"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface SubcategoryPageClientProps {
  category: Category
  subcategory: {
    id: string;
    name: { en: string; ar: string };
    slug: string;
    description?: { en: string; ar: string };
    logo?: string;
    slogan?: { en: string; ar: string };
    benefits?: { image?: string; description_en?: string; description_ar?: string }[];
    colors?: { image?: string }[];
  }
  products: Product[]
}
const galleryImages = [
    { src: "/uploads/Layer-32-3.jpg", alt: "Steyn City HQ" },
    { src: "/uploads/Layer-34-2.jpg", alt: "Jardim Residence Infinity" },
    { src: "/uploads/Layer-30-2.jpg", alt: "Sherwood Village" },
    { src: "/uploads/Layer-31-1.jpg", alt: "Lifespan Example" },
  
  ];

const translations = {
  lightweightTitle: {
    en: 'LIGHTWEIGHT, CAPPED BAMBOO COMPOSITE',
    ar: 'ألواح الخيزران المركب الخفيف الوزن والمغطاة',
  },
  lightweightDesc: {
    en: 'Infinity bamboo composite adds value and good looks to your outdoor space and to your lifestyle by giving you steadfast decking that lasts for decades.',
    ar: 'تُضفي ألواح الخيزران المركب إنفينيتي قيمةً ومظهرًا رائعًا على مساحتك الخارجية وأسلوب حياتك من خلال توفير سطح متين يدوم لعقود.',
  },
};

// Translations for the new I-Series Added Benefits section
const iSeriesTranslations = {
  heading: {
    en: 'INFINITY I-SERIES ADDED BENEFITS',
    ar: 'مزايا إضافية لسلسلة إنفينيتي I',
  },
  benefits: [
    {
      icon: '/uploads/infinity113-cost-effective.png',
      title: { en: 'COST-EFFECTIVE', ar: 'فعّال من حيث التكلفة' },
      
    },
    {
      icon: '/uploads/infinity113-lightweight.png',
      title: { en: 'LIGHTWEIGHT', ar: 'خفيف الوزن' },
      
    },
    {
      icon: '/uploads/infinity113-optimised-design.png',
      title: { en: 'OPTIMISED DESIGN', ar: 'تصميم محسّن' },
      
    },
    {
      icon: '/uploads/infinity113-installation.png',
      title: { en: 'INSTALLATION', ar: 'التركيب' },
      
    },
  ],
};

// Add translations for the INFINITY PROFILES section
const infinityProfilesTranslations = {
  heading: {
    en: 'INFINITY PROFILES',
    ar: 'ألواح إنفينيتي'
  },
  desc: {
    en: `Infinity capped bamboo composite adds durability and functionality to your outdoor space in a range of profile designs. Grooved decking boards install easily with hidden clips while square edge boards install with conveniently colour matched top fixing screws. The ultra-lightweight Infinity IS (I-Series) range utilises the classic I-beam shape to create an even lighter weight profile available in grooved, square edge, and starter profile options. Fascia, screen, and stair tread profiles add matching finishing touches to complete your outdoor space.`,
    ar: `تُضفي إنفينيتي ألواح الخيزران المركب والمُغطى المتانة والفعالية على مساحتك الخارجية بمجموعة متنوعة من التصاميم. تُركّب ألواح الأرضيات المُحززة بسهولة باستخدام اكسسوارات مخفية، بينما تُركّب ألواح الحواف المربعة باستخدام براغي تثبيت علوية مُتناسقة الألوان. تستخدم مجموعة إنفينيتي آي إس (سلسلة I) خفيفة الوزن للغاية شكل العارضة I الكلاسيكي لإنشاء لوح أخف وزنًا، مُتاح بخيارات مُحززة، وحواف مربعة، وألواح بداية. تُضفي ألواح الواجهة ومداسات الدرج لمسات نهائية مُتناسقة تُكمل مساحتك الخارجية.`
  }
};

export default function InfinityPage({ category, subcategory, products }: SubcategoryPageClientProps) {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") === "ar" ? "ar" : "en";

  if (!category || !subcategory) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center">
          <Link
            href={`/products/${category.slug}?lang=${lang}`}
            className="hidden md:inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary bg-white/50 backdrop-blur-sm text-primary font-medium shadow-sm hover:bg-primary/10 hover:shadow-md transition-all duration-150 mr-4 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <ArrowLeft className="w-5 h-5" />
            {lang === 'ar' ? 'العودة' : 'Back'}
          </Link>

          <div>
            <h1 className="text-3xl font-bold">
              {lang === "ar" ? subcategory.name.ar : subcategory.name.en}
            </h1>
            <p className={`text-gray-600 mt-2 ${lang === "ar" ? "text-right" : ""}`}>
              {lang === "ar" ? category.name.ar : category.name.en}
            </p>
          </div>
        </div>
        <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mb-8 flex flex-col items-center" >
          <Image
            src={`/api/images/${subcategory.logo}`}
            alt="Logo"
            width={300}
            height={80}
            className="mb-4"
          />
          {subcategory.slogan && (
            <p className="text-xl font-semibold text-center text-primary mb-2">
              {lang === "ar" ? subcategory.slogan.ar : subcategory.slogan.en}
            </p>
          )}
        </div>
        {subcategory.description && (subcategory.description[lang] || subcategory.description.en) && (
          <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mt-6">
            {/* Mobile: ReadMoreText with 4 lines */}
            <div className="block md:hidden">
              <ReadMoreText text={subcategory.description[lang] || subcategory.description.en} maxLines={4} lang={lang} />
            </div>
            {/* Desktop: Full text */}
            <p className="hidden md:block text-black whitespace-pre-line" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              {subcategory.description[lang] || subcategory.description.en}
            </p>
          </div>
        )}

        {/* Image Carousel (static for now) */}
        <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mb-8 my-6">
          <h2 className={`text-2xl font-bold mb-4 text-primary ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'معرض الصور' : 'Image Gallery'}</h2>
          <div className="relative w-full">
            <Carousel opts={{ loop: true }}>
              <CarouselContent className="">
                {galleryImages.map((img, idx) => (
                  <CarouselItem key={idx} className="px-2 carousel-slide">
                    <img src={img.src} alt={img.alt} className="w-full h-64 object-cover rounded" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:block" />
              <CarouselNext className="hidden sm:block" />
            </Carousel>
          </div>
        </div>

        {/* Infinity Composite Info Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-4 md:p-8 mb-8">
          {/* Left: Text and Logos */}
          <div className="w-full md:max-w-sm flex flex-col items-center md:items-start text-center md:text-left mb-6 md:mb-0 mx-auto">
            <div className="flex flex-row items-center justify-center md:justify-start gap-4 mb-4">
              <img src="/uploads/Infinity-logo-black.webp" alt="Infinity logo" className="h-12 w-auto" />
              <img src="/uploads/25yr-Warranty-2022.webp" alt="25 Year Warranty" className="h-12 w-auto" />
            </div>
            <h2
              className="text-2xl md:text-3xl font-extrabold mb-4"
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              style={lang === 'ar' ? { textAlign: 'right' } : {}}
            >
              {translations.lightweightTitle[lang]}
            </h2>
            <p
              className="text-base md:text-lg text-gray-800 mb-4 max-w-md"
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              style={lang === 'ar' ? { textAlign: 'right' } : {}}
            >
              {translations.lightweightDesc[lang]}
            </p>
          </div>
          {/* Right: Board Image */}
          <div className="w-full md:max-w-md flex flex-col items-center md:items-end mx-auto">
            <div className="relative w-full flex justify-center">
              <img src="/uploads/infinity-board-profile-1.jpg" alt="Infinity Board" className="w-full max-w-[1200px] h-auto object-contain" />
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        {Array.isArray(subcategory.benefits) && subcategory.benefits.length > 0 && (() => {
          const fullRowCount = Math.floor(subcategory.benefits.length / 5) * 5;
          const fullRows = subcategory.benefits.slice(0, fullRowCount);
          const lastRow = subcategory.benefits.slice(fullRowCount);

          return (
            <div className="my-8">
              <h2 className={`text-2xl md:text-3xl font-bold mb-4 text-primary ${lang === 'ar' ? 'text-right' : ''}`}>
                {lang === 'ar' ? 'استمتع بالمزايا' : 'TAKE HOME THE BENEFITS'}
              </h2>

              {/* 🔹 Mobile & Tablet (Default Grid) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:hidden gap-6 justify-items-center">
                {subcategory.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center">
                    {benefit.image && (
                      <img
                        src={`/api/images/${benefit.image}`}
                        alt="Benefit"
                        className="w-24 h-24 object-contain mb-2"
                      />
                    )}
                    <p className="text-black whitespace-pre-line">
                      {lang === 'ar' ? benefit.description_ar : benefit.description_en}
                    </p>
                  </div>
                ))}
              </div>

              {/* 🔹 Desktop (Custom Centered Last Row) */}
              <div className="hidden lg:block">
                {/* Full 5-column rows */}
                {fullRows.length > 0 && (
                  <div className="grid grid-cols-5 gap-6 justify-items-center">
                    {fullRows.map((benefit, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center">
                        {benefit.image && (
                          <img
                            src={`/api/images/${benefit.image}`}
                            alt="Benefit"
                            className="w-24 h-24 object-contain mb-2"
                          />
                        )}
                        <p className="text-black whitespace-pre-line">
                          {lang === 'ar' ? benefit.description_ar : benefit.description_en}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Centered last row */}
                {lastRow.length > 0 && (
                  <div
                    className="grid gap-1 justify-center mt-6"
                    style={{
                      display: 'grid ',
                      gridTemplateColumns: `repeat(${lastRow.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {lastRow.map((benefit, idx) => (
                      <div key={idx + fullRowCount} className="flex flex-col items-center text-center">
                        {benefit.image && (
                          <img
                            src={`/api/images/${benefit.image}`}
                            alt="Benefit"
                            className="w-24 h-24 object-contain mb-2"
                          />
                        )}
                        <p className="text-black whitespace-pre-line">
                          {lang === 'ar' ? benefit.description_ar : benefit.description_en}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* I-Series Added Benefits Section */}
        <div className="my-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-12">
            {iSeriesTranslations.heading[lang]}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {iSeriesTranslations.benefits.map((benefit, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="  p-6 mb-4 flex items-center justify-center" style={{ minHeight: 120, minWidth: 120 }}>
                  <img src={benefit.icon} alt={benefit.title[lang]} className="h-24 w-24 object-contain" />
                </div>
                <div className="text-xl font-bold mb-2">{benefit.title[lang]}</div>
               
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mt-6 mb-6">
          <h2 className={`text-2xl font-bold mb-4 text-primary ${lang === 'ar' ? 'text-center' : ''}`}>
            {infinityProfilesTranslations.heading[lang]}
          </h2>
          <p className="text-black whitespace-pre-line" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {infinityProfilesTranslations.desc[lang]}
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 && (
          <div className="text-red-600 text-center my-8 text-lg font-bold">
            No products found for this category/subcategory.
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang}
              small
              fromHardcodedPage={true}
            />
          ))}
        </div>

        {/* Colors Section */}
        {Array.isArray(subcategory.colors) && subcategory.colors.length > 0 && (
          <div className="my-8">
            
            <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mt-6 mb-6">
            <h2 className={`text-2xl md:text-3xl font-bold mb-4 text-primary ${lang === 'ar' ? 'text-right' : ''}`}>
              {lang === 'ar' ? 'ألوان إنفينيتي' : 'INFINITY COLOURS'}
            </h2>
          <p className="text-black whitespace-pre-line" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {lang === 'ar' ? 'صُممت مجموعة إنفينيتي لتعزيز جمال مساحتك الخارجية وجاذبيتها. فهي رائدة في سوق المواد المركبة من حيث المتانة وسهولة الصيانة، كما تُضفي لمسةً مميزة على منزلك. سواءً اخترت استخدامها كأرضيات خشبية أو كسوة أو ستارة أو غيرها من الاستخدامات الإبداعية، فإن إنفينيتي تُكمل ذوقك وتُضفي لمسةً نهائيةً مثاليةً على مساحتك. اختر من بين مجموعتنا من الألوان الطبيعية الجميلة لتجد الدرجة المثالية لمشروعك.' : 'The Infinity range is designed to enhance the beauty and liveability of your outdoor area. It leads the composite market in terms of durability and low-maintenance features, and it elevates the look of your home. Whether you choose to use it as decking, cladding, screening, or in other imaginative ways, Infinity complements your style and provides the perfect finish for your space. Choose from our range of beautiful, natural colours to find the ideal shade for your project.'}
          </p>
        </div>

            <div className="overflow-x-auto">
              <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-4  grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                {subcategory.colors.map((color, idx) => (
                  color.image && (
                    <img
                      key={idx}
                      src={`/api/images/${color.image}`}
                      alt="Color"
                      className="w-auto h-auto object-contain "
                    />
                  )
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 