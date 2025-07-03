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
    { src: "/uploads/Layer-30-1.jpg", alt: "Steyn City HQ" },
    { src: "/uploads/Layer-31.jpg", alt: "Jardim Residence Infinity" },
    { src: "/uploads/Layer-32-1.jpg", alt: "Sherwood Village" },
    { src: "/uploads/Layer-34-1.jpg", alt: "Lifespan Example" },
  
  ];

const translations = {
  lightweightTitle: {
    en: 'LIGHTWEIGHT BAMBOO COMPOSITE',
    ar: 'ألواح الخيزران المركب خفيف الوزن',
  },
  lightweightDesc: {
    en: 'Design an outdoor space that’s more inspiring and more inviting with Eva-tech bamboo composite, the original classic and cost effective, composite brand by Eva-Last.',
    ar: 'صمم مساحة خارجية أكثر إلهامًا وجاذبية مع مركب الخيزران إيفا-تيك، العلامة التجارية الأصلية الكلاسيكية والفعالة من حيث التكلفة من إيفا-لاست.',
  },
};

// Translations for the new I-Series Added Benefits section
const iSeriesTranslations = {
  heading: {
    en: 'ADDED BENEFITS OF EVA-TECH IS',
    ar: 'مزايا إضافية لسلسلة إيفا-تيك I',
  },
  benefits: [
   
    {
      icon: '/uploads/eva-tech-icon-74.webp',
      title: { en: 'LIGHTWEIGHT', ar: 'خفيف الوزن' },
      
    },
    {
      icon: '/uploads/eva-tech-icon-75.webp',
      title: { en: 'SPAN', ar: 'مساحة عرضية' },
      
    },
    {
      icon: '/uploads/eva-tech-icon-76.webp',
      title: { en: 'INSTALLATION', ar: 'سهل التركيب' },
      
    },
  ],
};

// Add translations for the INFINITY PROFILES section
const evaTechDualToneProfilesTranslations = {
  heading: {
    en: 'EVA-TECH IS DUAL TONE PROFILES',
    ar: 'ألواح إيفا-تيك أي إس ثنائية اللون'
  },
  desc: {
    en: `Eva-tech IS Dual Tone combines all the low-maintenance benefits of Eva-tech eco-friendly bamboo composite with the smart, cost-effective advantages of I-Series in an enhanced dual tone finish for the look of natural timber.`,
    ar: `تجمع ألواح إيفا-تيك أي إس ثنائية اللون بين مزايا سهولة الصيانة التي توفرها ألواح إيفا-تيك المصنوعة من الخيزران الصديق للبيئة، والمزايا الذكية والفعّالة من حيث التكلفة لسلسلة أي إس، وذلك بفضل تشطيبها ثنائي اللون المحسّن الذي يمنحها مظهرًا يشبه الخشب الطبيعي.`
  }
};

const evaTechWideToneProfilesTranslations = {
    heading: {
      en: 'EVA-TECH WYDE PROFILES',
      ar: 'ألواح إيفا-تيك وايد'
    },
    desc: {
      en: `Eva-tech bamboo composite adds sophistication and durability to any outdoor space. Decking boards are available in the revolutionary I-Series design as Eva-tech IS which utilises the classic I-beam shape to create an ultra-lightweight but strong profile. Eva-tech decking profiles offer a long-lasting and cost-effective composite decking option in grooved and starter profile design options, as well as trim and clad fascia boards, to complete your outdoor project.`,
      ar: `تُضفي ألواح إيفا-تيك المصنوعة من الخيزران المُركّب لمسةً من الرقي والمتانة على أي مساحة خارجية. تتوفر ألواح الأرضيات بتصميم آي سيريس الثوري، وهو إيفا-تيك أي إس، الذي يستخدم شكل I-beam الكلاسيكي لإنشاء سطح خارجي خفيف الوزن ومتين. تُوفّر ألواح إيفا-تيك خيارًا طويل الأمد واقتصاديًا للأرضيات المركبة، بتصميمات مُخدّدة وأساسية، بالإضافة إلى ألواح واجهات مُكسوة ومُزخرفة، لإكمال مشروعك الخارجي.`
    }
  };

export default function EvatechPage({ category, subcategory, products }: SubcategoryPageClientProps) {
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
              <img src="/uploads/evatech-1.webp" alt="Infinity logo" className="h-12 w-auto" />
              <img src="/uploads/10yr-Warranty-2022@2x.webp" alt="10 Year Warranty" className="h-12 w-auto" />
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
              <img src="/uploads/evatech-profile-1.jpg" alt="Infinity Board" className="w-full max-w-[1200px] h-auto object-contain" />
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
            {evaTechDualToneProfilesTranslations.heading[lang]}
          </h2>
          <p className="text-black whitespace-pre-line" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {evaTechDualToneProfilesTranslations.desc[lang]}
          </p>
        </div>

        <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mt-6 mb-6">
          <h2 className={`text-2xl font-bold mb-4 text-primary ${lang === 'ar' ? 'text-center' : ''}`}>
            {evaTechWideToneProfilesTranslations.heading[lang]}
          </h2>
          <p className="text-black whitespace-pre-line" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {evaTechWideToneProfilesTranslations.desc[lang]}
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
              {lang === 'ar' ? 'دليل ألوان وتشطيبات إيفا-تيك' : 'EVA-TECH FINISH & COLOUR GUIDE'}
            </h2>
          <p className="text-black whitespace-pre-line" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {lang === 'ar' ? 'تُضيف مجموعة ألوان إيفا-تيك الجديدة ثنائية اللون مستوىً جديدًا من تقنية الألوان لكل لون من ألوان إيفا-تيك الكلاسيكية الأربعة، لتُضفي لمسةً طبيعيةً أكثر على سطحها المُصمم ببراعة، والذي يُجسّد مظهر الخشب الطبيعي. استمتع بألواح الخيزران المركب إيفا-تيك بهذا المظهر الجمالي ثنائي اللون المُتطور.' : 'The new Eva-tech dual tone colour range adds an extra level of colour technology to each of the four classic Eva-tech colours to provide an even more natural-looking composite in an artfully designed surface finish which embodies the look of real wood. Enjoy Eva-tech bamboo composite in this advanced dual tone aesthetic.'}
          </p>
        </div>

            <div className="overflow-x-auto">
              <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-4  grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
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