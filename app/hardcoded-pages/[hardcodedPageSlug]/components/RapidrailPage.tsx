import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCategoryBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import ReadMoreText from "@/components/ReadMoreText";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface Benefit {
  image?: string;
  description_en?: string;
  description_ar?: string;
}

interface Color {
  image?: string;
}

interface Props {
  searchParams?: { lang?: string; categorySlug?: string };
}

export default async function RapidrailPage({ searchParams }: Props) {
  const lang = searchParams?.lang === "ar" ? "ar" : "en";
  const categorySlug = searchParams?.categorySlug;
  const hardcodedPageSlug = "rapidrail";

  if (!categorySlug) {
    return <div className="text-red-600">Missing categorySlug in URL.</div>;
  }

  const category = await getCategoryBySlug(categorySlug);
  if (!category) notFound();
  const subcategory = category.subcategories?.find(
    (sub: any) => sub.hardcodedPageSlug === hardcodedPageSlug
  ) as {
    name?: { en: string; ar: string };
    description?: { en: string; ar: string };
    logo?: string;
    slogan?: { en: string; ar: string };
    benefits?: Benefit[];
    colors?: Color[];
  } | undefined;
  if (!subcategory) notFound();
  const benefits: Benefit[] = subcategory.benefits || [];
  const colors: Color[] = subcategory.colors || [];

  // System features images
  const featureImages = [
    { src: "/uploads/features/Layer-30-1.jpg", alt: "Layer 30" },
   
    { src: "/uploads/features/Layer-30-3.jpg", alt: "Layer 32" },
    { src: "/uploads/features/Layer-30-4.jpg", alt: "Layer 33" },
    { src: "/uploads/features/Layer-30-5.jpg", alt: "Layer 34" },
    { src: "/uploads/features/Layer-30-6.jpg", alt: "Layer 35" },
    { src: "/uploads/features/Layer-30-7.jpg", alt: "Layer 36" },
    { src: "/uploads/features/Layer-30-8.jpg", alt: "Layer 37" },
  ];

  // Move the benefits section rendering into a variable to avoid returning a function in JSX
  let benefitsSection: React.ReactNode = null;
  if (Array.isArray(benefits) && benefits.length > 0) {
    const fullRowCount = Math.floor(benefits.length / 5) * 5;
    const fullRows = benefits.slice(0, fullRowCount);
    const lastRow = benefits.slice(fullRowCount);
    benefitsSection = (
      <div className="my-8">
        <h2 className={`text-2xl font-bold mb-4 text-primary ${lang === 'ar' ? 'text-right' : ''}`}>{lang === 'ar' ? 'استمتع بالمزايا' : 'TAKE HOME THE BENEFITS'}</h2>
        {/* Mobile & Tablet (Default Grid) */}
        <div className="grid grid-cols-3 sm:grid-cols-2 lg:hidden gap-6 justify-items-center">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              {benefit.image && (
                <img
                  src={`/api/images/${benefit.image}`}
                  alt="Benefit"
                  className="w-22 h-22 object-contain mb-2"
                />
              )}
              <p className="text-black whitespace-pre-line">
                {lang === 'ar' ? benefit.description_ar : benefit.description_en}
              </p>
            </div>
          ))}
        </div>
        {/* Desktop (Custom Centered Last Row) */}
        <div className="hidden lg:block">
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
          {lastRow.length > 0 && (
            <div
              className="grid gap-1 justify-center mt-6"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${lastRow.length}, minmax(0, 1fr))`,
              }}
            >
              {lastRow.map((benefit, idx) => (
                <div key={idx + fullRowCount} className="flex flex-col items-center text-center">
                  {benefit.image && (
                    <img
                      src={`/api/images/${benefit.image}`}
                      alt="Benefit"
                      className="w-22 h-22 object-contain mb-2"
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
              {subcategory.name ? (lang === "ar" ? subcategory.name.ar : subcategory.name.en) : ""}
            </h1>
            <p className={`text-gray-600 mt-2 ${lang === "ar" ? "text-right" : ""}`}>
              {lang === "ar" ? category.name.ar : category.name.en}
            </p>
          </div>
        </div>
        
          <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mb-8 flex flex-col items-center">
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
      {/* Features Section (carousel/grid) */}
     <div className="mb-8">
        <h2 className={`text-2xl font-bold mb-4 text-primary ${lang === 'ar' ? 'text-right' : ''}`}>{lang === 'ar' ? 'مميزات النظام' : 'System Features'}</h2>
        {/* Carousel for system features */}
        <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mb-8">
          <div className="relative w-full">
            <Carousel opts={{ loop: true }}>
              <CarouselContent>
                {featureImages.map((img, idx) => (
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
        <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mt-6 flex flex-col md:flex-row justify-center items-center gap-8 mt-6">
          <div className="flex flex-col items-center text-center w-full">
            <strong
              className={
                'text-2xl md:text-3xl font-bold mb-2 w-full font-arabic text-center'
              }
              dir={lang === 'ar' ? 'rtl' : undefined}
              lang={lang === 'ar' ? 'ar' : undefined}
            >
              {lang === 'ar' ? 'درابزين أكثر أمانًا وقوة وجمالًا' : 'SAFER, STRONGER, STUNNING RAILING'}
            </strong>
            <p
              className={
                lang === 'ar'
                  ? 'mt-2 text-lg md:text-xl text-right w-full font-arabic'
                  : 'mt-2 text-lg md:text-xl'
              }
              dir={lang === 'ar' ? 'rtl' : undefined}
              lang={lang === 'ar' ? 'ar' : undefined}
            >
              {lang === 'ar'
                ? 'يجمع RapidRail بين الأمان والفن ليقدم نظام درابزين مركب يجعل مساحتك أكثر عملية وأمانًا وجاذبية، وخاليًا تقريبًا من الصيانة. اجعل شرفتك مساحة معيشة حقيقية مع درابزين مبتكر يوفر إحساسًا قويًا بالأمان ويعزز أسلوب حياة أكثر سهولة.'
                : 'RapidRail combines safety and artistry for a composite railing system that makes your space more functional, more secure, more appealing, and virtually maintenance free. Make your deck a truly liveable space with innovative railing that provides a strong sense of security and promotes a more hassle-free way of life.'}
            </p>
          </div>
        </div>
        <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mt-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-6">
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <p><strong>{lang === 'ar' ? 'ارتفاع العمود:' : 'Post height:'}</strong> 1180 mm</p>
              <p><strong>{lang === 'ar' ? 'الطول:' : 'Length:'}</strong> 1806 mm</p>
              <p>{lang === 'ar' ? 'ملاحظة: أغطية وقواعد الأعمدة متوفرة' : 'Note: Matching post caps and skirting available'}</p>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src="/uploads/Rapidrail-composition.jpg"
                alt="Rapidrail composition"
                width={350}
                height={180}
                className="rounded shadow w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      {benefitsSection}

      {/* Railing Options Section */}
      <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mt-6 flex flex-col md:flex-row items-center justify-center my-12 w-full max-w-6xl mx-auto gap-12">
        {/* Left: Description */}
        <div
          className={
            lang === 'ar'
              ? 'flex-1 flex flex-col items-center md:items-end text-center md:text-right'
              : 'flex-1 flex flex-col items-center md:items-start text-center md:text-left'
          }
          dir={lang === 'ar' ? 'rtl' : undefined}
        >
          {/* Logo */}
          <Image
            src={`/api/images/${subcategory.logo}`}
            alt="RapidRail Logo"
            width={300}
            height={80}
            className="mb-4"
          />
          {/* Heading */}
          <h2 className="text-3xl font-bold mb-2">
            {lang === 'ar' ? 'خيارات الدرابزين' : 'RAILING OPTIONS'}
          </h2>
          {/* Red underline */}
          <div className="w-24 h-1 bg-red-500 mb-6"></div>
          {/* Description */}
          <p className="max-w-2xl text-lg mb-8">
            {lang === 'ar'
              ? 'اختر من مجموعة من أنماط الدرابزين المركب من الخيزران لتناسب مظهر ووظيفة مساحتك الخارجية مع RapidRail. تم تصميم RapidRail ليكون سهل التخصيص، ويمكن دمجه مع أنظمة درابزين مختلفة لتوفير مزيد من التنوع. تستوعب أعمدة RapidRail المركبة الدرابزين المركب أو كابل الفولاذ المقاوم للصدأ عالي الوضوح. يمكن لـ RapidRail أن يتطابق تمامًا أو يكمل سطحك المركب.'
              : 'Choose from a range of bamboo composite balustrade styles to suit the look and functionality of your outdoor space with RapidRail. RapidRail is designed to be easily customisable, and can be paired with different railing systems to provide greater versatility. The RapidRail composite posts accommodate composite railing or high visibility stainless steel cable. RapidRail can perfectly match or complement your composite deck.'}
          </p>
        </div>
        {/* Right: Images */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="flex flex-col items-center">
            <Image
              src="/uploads/Rapidrail-Composite-railing.png"
              alt={lang === 'ar' ? 'درابزين مركب' : 'Composite railing'}
              width={300}
              height={120}
              className="mb-2"
            />
            <span className="text-center text-base">
              {lang === 'ar' ? 'درابزين مركب' : 'Composite railing'}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/uploads/Rapidrail-Stainless-steel-cable-railing.webp"
              alt={lang === 'ar' ? 'درابزين كابل فولاذ مقاوم للصدأ' : 'Stainless steel cable railing'}
              width={300}
              height={120}
              className="mb-2"
            />
            <span className="text-center text-base">
              {lang === 'ar' ? 'درابزين كابل فولاذ مقاوم للصدأ' : 'Stainless steel cable railing'}
            </span>
          </div>
        </div>
      </div>

      {/* Colors Section */}
      {Array.isArray(colors) && colors.length > 0 && (
        <div className="my-8">
          
          <div className="w-full flex flex-col md:flex-row items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold text-primary text-center md:text-left w-full md:w-auto">
              {lang === 'ar' ? 'مجموعة الألوان - تشطيب الخشب الناعم المصقول' : 'COLOUR RANGE – BRUSHED SOFTWOOD FINISH'}
            </h2>
            <div className="flex flex-col items-center gap-4 w-full md:w-auto">
  <div className="flex items-center gap-4">
    <span className="text-lg font-semibold text-black">
      {lang === 'ar' ? 'التقنية:' : 'TECHNOLOGY:'}
    </span>
    <Image
      src="/uploads/Eva-tech-Logo-Black.png"
      alt="Eva-tech Logo"
      width={180}
      height={60}
      className="object-contain"
    />
  </div>

  <p className="text-center text-black text-sm md:text-base leading-snug">
    {lang === 'ar'
      ? 'متانة موثوقة مع ضمان لمدة 10 سنوات'
      : 'Reliable durability with a 10-year warranty'}
  </p>
</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-4  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
            {colors.map((color, idx) => (
              color.image && (
                <img
                  key={idx}
                  src={`/api/images/${color.image}`}
                  alt="Color"
                  className="w-full max-w-lg h-auto object-contain mx-auto"
                />
              )
            ))}
          </div>
        </div>
      )}

  
    </div>
  );
} 