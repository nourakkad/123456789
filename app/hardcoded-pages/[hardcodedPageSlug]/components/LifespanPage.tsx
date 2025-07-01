import React from "react";
import { getCategoryBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import ReadMoreText from "@/components/ReadMoreText";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface Props {
  searchParams?: { lang?: string; categorySlug?: string };
}

interface Benefit {
  image?: string;
  description_en?: string;
  description_ar?: string;
}

interface Color {
  image?: string;
}

export default async function LifespanPage({ searchParams }: Props) {
  const lang = searchParams?.lang === "ar" ? "ar" : "en";
  const categorySlug = searchParams?.categorySlug;
  const hardcodedPageSlug = "lifespan";

  if (!categorySlug) {
    return <div className="text-red-600">Missing categorySlug in URL.</div>;
  }

  const category = await getCategoryBySlug(categorySlug);
  if (!category) notFound();
  const subcategory = category.subcategories?.find(
    (sub: any) => sub.hardcodedPageSlug === hardcodedPageSlug
  ) as {
    name?: { en: string; ar: string };
    description?: { en: string; ar: string } | string;
    logo?: string;
    slogan?: { en: string; ar: string };
    benefits?: Benefit[];
    colors?: Color[];
    [key: string]: any;
  } | undefined;
  if (!subcategory) notFound();
  const benefits: Benefit[] = subcategory.benefits || [];
  const colors: Color[] = subcategory.colors || [];

  // Carousel images array for easier mapping
  const galleryImages = [
    { src: "/uploads/features1/Steyn-City_HQ-51.jpg", alt: "Steyn City HQ" },
    { src: "/uploads/features1/Jardim-Residence-Infinity1.jpg", alt: "Jardim Residence Infinity" },
    { src: "/uploads/features1/1063-Sherwood-Village-4.jpg", alt: "Sherwood Village" },
    { src: "/uploads/features1/Lifespan-image.jpg", alt: "Lifespan Example" },
    { src: "/uploads/features1/Lifespan-1.jpg", alt: "Lifespan" },
  ];

  // Helper to get the correct description
  function getSubcategoryDescription(sub: any, lang: string) {
    if (!sub) return "";
    if (sub.description && typeof sub.description === "object") {
      return sub.description[lang] || sub.description.en || "";
    }
    if (sub["description_" + lang]) {
      return sub["description_" + lang];
    }
    if (sub.description && typeof sub.description === "string") {
      return sub.description;
    }
    return "";
  }

  const subcategoryDescription = getSubcategoryDescription(subcategory, lang);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top Bar: Back Link, Title, Category */}
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
            <h1 className={`text-3xl font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              {subcategory.name ? (lang === "ar" ? subcategory.name.ar : subcategory.name.en) : ""}
            </h1>
            <p className={`text-gray-600 mt-2 ${lang === "ar" ? "text-right" : "text-left"}`}>
              {lang === "ar" ? category.name.ar : category.name.en}
            </p>
          </div>
        </div>
        {/* Logo & Slogan */}
        <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mb-8 flex flex-col items-center">
          {subcategory.logo && (
            <Image
              src={`/api/images/${subcategory.logo}`}
              alt="Logo"
              width={300}
              height={80}
              className="mb-4"
            />
          )}
          {subcategory.slogan && (
            <p className={`text-xl font-semibold text-center text-primary mb-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              {lang === "ar" ? subcategory.slogan.ar : subcategory.slogan.en}
            </p>
          )}
        </div>
        {/* Description */}
        {subcategoryDescription && (
          <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mt-6">
            <div className="block md:hidden">
              <ReadMoreText text={subcategoryDescription} maxLines={4} lang={lang} />
            </div>
            <p className={`hidden md:block text-black whitespace-pre-line ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              {subcategoryDescription}
            </p>
          </div>
        )}
      </div>

      {/* Image Carousel (static for now) */}
      <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mb-8">
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

      {/* Features Section */}
      <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mb-8">
        <h2 className={`text-2xl font-bold mb-4 text-primary ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'عوارض معمارية متينة ومتينة' : 'REINFORCED MODULAR COMPOSITE'}</h2>
        <p className={`mb-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {lang === 'ar'
            ? 'توفر عوارض لايف سبان المعمارية مرونة في التصميم وامتدادًا أكبر بفضل قلبها المصنوع من الألومنيوم المتخصص، مما يُسهّل تركيبها في الأماكن المرتفعة. الطبقة الخارجية من عوارض الخيزران المركبة سهلة الصيانة تقاوم التحلل البيولوجي والتآكل والحشرات والظروف الجوية القاسية، وتوفر حماية مدمجة من الأشعة فوق البنفسجية لمتانة فائقة. استمتع بمظهر العوارض الخشبية دون عناء الصيانة.'
            : 'Lifespan architectural beams offer design versatility and increased span thanks to their specialised aluminium core that makes for easier installation at height. The outer coating of low-maintenance bamboo composite resists biodegradation, corrosion, insects, and harsh weather, and offers built-in UV protection for beautiful durability. Enjoy the look of timber beams without the upkeep.'}
        </p>
        <img
          src="/uploads/Lifespan-beams-breakdown.webp"
          alt="Lifespan Beams Breakdown"
          className="w-full max-w-3xl mx-auto rounded-lg mb-4"
        />
        <h3 className={`text-lg font-semibold mb-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'امتداد أوسع' : 'INCREASED SPAN'}</h3>
        <p className={`mb-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {lang === 'ar'
            ? 'توفر عوارض لايف سبان المعمارية قدرة امتداد عوارض أثقل وأكثر صلابة بفضل قلبها المصنوع من الألومنيوم. يعزز هذا القلب بشكل كبير ثبات العوارض من حيث الأبعاد والانحناء، بينما يوفر طلاء إيفا-تيك المركب المصنوع من الخيزران مظهرًا طبيعيًا للخشب، بالإضافة إلى مقاومته للظروف المناخية القاسية والتدهور البيولوجي.'
            : 'Lifespan architectural beams offer the span capability of much heavier, solid beams thanks to their built-in aluminium core. This core significantly enhances the dimensional and flexural stability of the beam, while the Eva-tech bamboo composite coating provides a realistic timber aesthetic, as well as resistance to severe climatic and biodeterioration conditions.'}
        </p>
        <h3 className={`text-lg font-semibold mb-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'أداء عالٍ لتوقعات عالية' : 'HIGH PERFORMANCE FOR HIGH EXPECTATIONS'}</h3>
        <p className={`mb-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {lang === 'ar'
            ? 'تضفي عوارض لايف سبان الأناقة والوظائف في مجموعة متنوعة من التطبيقات. استمتع بظل وخصوصية العريشة أو الستارة، أو عزز جمالية واجهة منزلك الخارجية بعوارض تمنح مظهر الخشب دون عناء الصيانة. لا يضاهي جمال عوارض لايف سبان المعمارية الزخرفية تنوع استخداماتها.'
            : 'Lifespan beams add style and functionality in a diverse range of applications. Enjoy the shade and privacy of a pergola or screen, or enhance the appeal of your home exterior with beams that give the look of wood without the maintenance hassles. The versatility of Lifespan decorative architectural beams is matched only by their beauty.'}
        </p>
      </div>

      {/* Application Options */}
      <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mb-8">
        <h2 className={`text-2xl font-bold mb-4 text-primary ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'خيارات التطبيق' : 'Application Options'}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center">
              <img src="/uploads/Group-3849.jpg" alt="Pergolas" className="w-80 h-80 object-cover rounded mb-2" />
            <h3 className={`font-semibold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'برجولات' : 'PERGOLAS'}</h3>
          </div>
          <div className="flex flex-col items-center">
            <img src="/uploads/Group-3857.jpg" alt="Privacy Screens" className="w-80 h-80 object-cover rounded mb-2" />
            
            <h3 className={`font-semibold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'شاشات الخصوصية' : 'PRIVACY SCREENS'}</h3>
          </div>
          <div className="flex flex-col items-center">
              <img src="/uploads/Group-3853.jpg" alt="Cladding & Soffits" className="w-80 h-80 object-cover rounded mb-2" />
            <h3 className={`font-semibold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'التكسية والسقوف' : 'CLADDING & SOFFITS'}</h3>
          </div>
          <div className="flex flex-col items-center">
              <img src="/uploads/Group-3861.jpg" alt="Decorative Architecture" className="w-80 h-80 object-cover rounded mb-2" />
            <h3 className={`font-semibold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'العمارة الزخرفية' : 'DECORATIVE ARCHITECTURE'}</h3>
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
        <h2 className={`text-2xl font-bold mb-4 text-primary ${lang === 'ar' ? 'text-right' : ''}`}>
  {lang === 'ar' ? 'استمتع بالمزايا' : 'TAKE HOME THE BENEFITS'}
</h2>


      {/* 🔹 Mobile & Tablet (Default Grid) */}
      <div className="grid grid-cols-3 sm:grid-cols-2 lg:hidden gap-6 justify-items-center">
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

      {/* Profile Size Options */}
      <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mb-8">
        <h2 className={`text-2xl font-bold mb-4 text-primary ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'خيارات قياسات المقطع' : 'PROFILE SIZE OPTIONS'}</h2>
        <p className={`mb-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {lang === 'ar'
            ? 'تتوفر عوارض لايف سبان الهجينة المصنوعة من الألومنيوم المركب بمجموعة متنوعة من القياسات والأشكال لتناسب تصميم مشروعك الخارجي. صُممت لايف سبان لتلبية المعايير الصناعية. مع ذلك، قد تختلف قوانين ومعايير البناء باختلاف المناطق أو البلدان. يُرجى مراجعة قوانين البناء المحلية قبل تركيب عوارض لايف سبان المركبة.'
            : 'Lifespan hybrid aluminium composite beams are available in a range of sizes and shapes to suit your outdoor project design. Lifespan has been designed to meet industrial norms. However, building codes and standards may differ between jurisdictions or countries. Be sure to consult your local building codes before installing Lifespan composite beams.'}
        </p>
        {/* 50x30 mm Decorative Beam */}
        <div className="flex flex-col md:flex-row gap-8 mb-8 items-center">
          <img src="/uploads/50x30.webp" alt="50x30 mm Decorative Beam" className="w-80 h-80 object-contain rounded" />
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'عارضة ديكورية 50 × 30 مم' : '50 X 30 mm DECORATIVE BEAM'}</h3>
            <p className={`mb-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>{lang === 'ar' ? 'يُضفي قالب لايف سبان الزخرفي، مقاس 50 × 30 مم، لمسةً جماليةً على مساحتك الخارجية بمظهر درابزين خشبي تقليدي. يُعد هذا القالب الصغير ذو الحجم العريض خيارًا شائعًا لإنشاء حواجز وبوابات وشرفات متينة وغيرها من العناصر المعمارية الخارجية سهلة الصيانة.' : 'The 50 x 30 mm Lifespan decorative profile enhances your outdoor space with the look of a traditional timber baluster. This compact batten-sized profile is a popular choice for creating durable screens, gates, pergolas and other low-maintenance outdoor architectural features.'}</p>
            <ul className={`list-disc pl-5 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <li>{lang === 'ar' ? 'الأبعاد: 50 × 30 مم' : 'Dimensions: 50 x 30 mm'}</li>
              <li>{lang === 'ar' ? 'الأطوال القياسية: 5.8 م' : 'Standard Lengths: 5.8m'}</li>
              <li>{lang === 'ar' ? 'الوزن: 0.8 كجم/م' : 'Weight: 0.8 kg/m'}</li>
            </ul>
          </div>
        </div>
        {/* 100x30 mm Decorative Beam */}
        <div className="flex flex-col md:flex-row gap-8 mb-8 items-center">
          <img src="/uploads/100x30.png" alt="100x30 mm Decorative Beam" className="w-80 h-80 object-contain rounded" />
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'عارضة ديكورية 100 × 30 مم' : '100 X 30 mm DECORATIVE BEAM'}</h3>
            <p className={`mb-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>{lang === 'ar' ? 'يُعد قطاع لايف سبان الزخرفي، مقاس 100 × 30 مم، من أكثر منتجات لايف سبان رواجًا، وهو مثالي لإنشاء شرفات خارجية رائعة ومتينة، وعوارض خشبية، وحواجز خصوصية، أو غيرها من العناصر المعمارية الجذابة. استمتع بمظهر العوارض الخشبية دون عناء الصيانة أو التأثير على البيئة.' : 'The 100 x 30 mm Lifespan decorative profile is a fan favourite in the Lifespan range, ideal for creating striking and durable outdoor pergolas, beams, privacy screens, or other attractive architectural features. Enjoy the look of timber beams without the upkeep and environmental toll.'}</p>
            <ul className={`list-disc pl-5 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <li>{lang === 'ar' ? 'الأبعاد: 100 × 30 مم' : 'Dimensions: 100 x 30 mm'}</li>
              <li>{lang === 'ar' ? 'الأطوال القياسية: 5.8 م' : 'Standard Lengths: 5.8 m'}</li>
              <li>{lang === 'ar' ? 'الوزن: 1.3 كجم/م' : 'Weight: 1.3 kg / m'}</li>
            </ul>
          </div>
        </div>
        {/* 150x50 mm Decorative Beam */}
        <div className="flex flex-col md:flex-row gap-8 mb-8 items-center">
          <img src="/uploads/150x50.webp" alt="150x50 mm Decorative Beam" className="w-80 h-80 object-contain rounded" />
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'عارضة ديكورية 150 × 50 مم' : '150 X 50 mm DECORATIVE BEAM'}</h3>
            <p className={`mb-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>{lang === 'ar' ? 'عارضة لايف سبان الزخرفية 150 × 50 مم هي عارضة مستطيلة أكبر حجمًا ضمن مجموعة لايف سبان، وتضفي لمسة جمالية فخمة على مساحتك الخارجية. مثالية للاستخدام كعارضة مظلة كبيرة، أو ستارة للخصوصية، أو كداعم لعوارض لايف سبان الأصغر حجمًا ضمن النظام.' : 'The 150 x 50 mm Lifespan decorative beam is a larger rectangular profile in the Lifespan range and creates a stately aesthetic for your outdoor space, ideal for use as an oversized pergola beam, privacy screen, or as a support for smaller Lifespan beams within the system.'}</p>
            <ul className={`list-disc pl-5 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <li>{lang === 'ar' ? 'الأبعاد: 150 × 30 مم' : 'Dimensions: 150 x 30 mm'}</li>
              <li>{lang === 'ar' ? 'الأطوال القياسية: 5.8 م' : 'Standard Lengths: 5.8 m'}</li>
              <li>{lang === 'ar' ? 'الوزن: 3.3 كجم/م' : 'Weight: 3.3 kg / m'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* END CAPS to LIFESPAN CONNECTORS Section */}
      <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
          <img
            src="/uploads/end-caps-2.webp"
            alt="End Caps"
            className="w-80 h-80 object-contain rounded "
          />
          <div className={`${lang === 'ar' ? 'w-full flex flex-col items-end' : ''}`}>
            <h2 className={`text-2xl font-bold mb-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'أغطية النهايات' : 'END CAPS'}</h2>
            <p className={`mb-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>{lang === 'ar' ? 'تتوفر أغطية النهايات وأغطية الأعمدة لإضفاء لمسة نهائية أنيقة على عوارض لايف سبان المركبة.' : 'End caps and post caps are available allowing for a neat finish to your Lifespan composite beams.'}</p>
            <ul className={`list-disc pl-5 mb-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <li>{lang === 'ar' ? 'الأبعاد: 150 × 50 مم، 100 × 30 مم و150 × 50 مم' : 'Dimensions: 150 x 50 mm, 100 x 30 mm and 150 x 50 mm'}</li>
            </ul>
          </div>
        </div>
        {/* Colour Range & Colors Section (merged) */}
        {(Array.isArray(colors) && colors.length > 0) && (
          <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-center mb-4">
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 text-primary ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'مجموعة الألوان: لمسة نهائية مصقولة' : 'COLOUR RANGE: BRUSHED FINISH'}</h2>
                <p className={`mb-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>{lang === 'ar' ? 'تُضفي عوارض لايف سبان المعمارية مظهرًا أخّاذًا لعوارض الخشب بتصميم ذكي، مما يمنحكم خيارًا مستدامًا يدوم طويلًا، ويتطلب صيانة أقل، لمشاريعكم الخارجية. تتوفر عوارض لايف سبان ضمن مجموعة ألوان إيفا-تيك. تُقدّم هذه الألوان الكلاسيكية بلمسة نهائية مصقولة غير لامعة خالدة، وهي مصممة خصيصًا لتُجسّد جوهر نوع خشب مُحدّد. حسّنوا مساحتكم الخارجية مع عوارض لايف سبان، واختاروا اللون الذي يُناسب ذوقكم.' : 'Lifespan architectural beams provide the look of impressive wood beams in a smart design to give you a longer lasting, lower maintenance, and more sustainable alternative for your outdoor projects. Lifespan beams are available in the Eva-tech colour range. These classic colours are offered in a timeless matte brushed finish and are specially designed to evoke the essence of a particular timber type. Enhance your outdoor space with Lifespan beams and choose the colour that best suits your style.'}</p>
              </div>
              <div className={`flex-1 flex items-center gap-2 ${lang === 'ar' ? 'justify-center' : 'justify-center'}`} {...(lang === 'ar' ? { dir: 'rtl' } : {})}>
                <span className="text-lg font-semibold">{lang === 'ar' ? 'تكنولوجيا:' : 'Technology:'}</span>
                <img src="/uploads/Eva-tech-Logo-Black.png" alt="Eva-tech Logo" className="w-48 h-auto" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
              {colors.map((color, idx) => (
                color.image && (
                  <img
                    key={idx}
                    src={`/api/images/${color.image}`}
                    alt="Color"
                    className="w-auto h-auto object-contain rounded shadow"
                  />
                )
              ))}
            </div>
          </div>
        )}
        {/* Hybrid Aluminium Bamboo Composite Beam */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'عارضة هجينة من الألمنيوم والخيزران المركب' : 'HYBRID ALUMINIUM BAMBOO COMPOSITE BEAM'}</h2>
          <img src="/uploads/lifespan-group.jpg" alt="Hybrid Beam Group" className="w-full max-w-2xl mx-auto rounded-lg mb-4" />
        </div>
        {/* LIFESPAN CONNECTORS heading (end boundary) */}
        <div>
          <h2 className={`text-2xl font-bold mb-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
            {lang === 'ar' ? (<>
              وصلات لايف سبان
            </>) : 'LIFESPAN CONNECTORS'}
          </h2>
        </div>
        {/* LIFESPAN CONNECTORS Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Concealed U-Bracket Kit */}
          <div className="bg-gray-50 p-6 rounded-lg shadow flex flex-col items-center">
            <h3 className={`text-xl font-semibold mb-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'مجموعة حامل U مخفي' : 'Concealed U-Bracket Kit'}</h3>
            <p className={`mb-2 text-center ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>{lang === 'ar' ? (<>يتضمن ملحقًا واحدًا للعارضة وحاملًا واحدًا على الحائط. للتثبيت المخفي لعوارض لايف سبان مقاس 150 × 50 مم.</>) : (
              'Comprises 1 Beam Insert and 1 Wall Mount.\nFor concealed fixing of 150 x 50 mm Lifespan beams.'
            )}
            </p>
            <img
              src="/uploads/Screenshot-2024-10-04-at-12.01.48.png"
              alt="Concealed U-Bracket Kit"
              className="w-80 h-80 object-contain mb-2"
            />
            <h4 className={`font-semibold mb-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'مثال على التثبيت المخفي النهائي' : 'Example of finished concealed fixing'}</h4>
            <img
              src="/uploads/Screenshot-2024-10-04-at-12.webp"
              alt="Concealed Fixing Example"
              className="w-80 h-80 object-contain"
            />
          </div>
          {/* Concealed Cross Connection Plate */}
          <div className="bg-gray-50 p-6 rounded-lg shadow flex flex-col items-center">
            <h3 className={`text-xl font-semibold mb-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'لوحة التوصيل المتقاطعة المخفية' : 'Concealed Cross Connection Plate'}</h3>
            <p className={`mb-2 text-center ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>{lang === 'ar' ? (<> يتضمن ملحقًا واحدًا للعارضة وحاملًا واحدًا على الحائط. للتثبيت المخفي لعوارض لايف سبان مقاس 150 × 50 مم.</>) : (
              'Comprises 1 Beam Insert and 1 Wall Mount.\nFor concealed fixing of 150 x 50 mm Lifespan beams.'
            )}
            </p>
            <img
              src="/uploads/Screenshot-2024-10-04-at-12.02.01.png"
              alt="Concealed Cross Connection Plate"
              className="w-80 h-80 object-contain mb-2"
            />
            <h4 className={`font-semibold mb-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'مثال على التوصيل المتقاطع النهائي' : 'Example of finished cross connection'}</h4>
            <img
              src="/uploads/Screenshot-2024-10-04-at-12.02.04.png"
              alt="Cross Connection Example"
              className="w-80 h-80 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 