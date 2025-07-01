import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/data";
import ReadMoreText from "@/components/ReadMoreText";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface Benefit {
  image?: string;
  description_en?: string;
  description_ar?: string;
}

interface Color {
  image?: string;
  name?: string;
  code?: string;
}

interface Props {
  searchParams?: { lang?: string; categorySlug?: string };
}

const translations = {
  back: { en: 'Back', ar: 'العودة' },
  systemFeatures: { en: 'System Features', ar: 'مميزات النظام' },
  infinityProfileTitle: {
    en: 'VISTACLAD USING AN INFINITY PROFILE MAKE-UP',
    ar: 'ألواح فيستاكلاد للإكساء من نوع إنفينيتي',
  },
  infinityProfileDesc: {
    en: 'VistaClad cladding boards in Infinity co-extruded capped bamboo composite offer exceptional durability. The hardy bamboo PE (polyethylene) composite core is wrapped in a robustly engineered polymer cap for a resilient composite. Infinity offers a low-maintenance, eco-friendly alternative to conventional cladding in a selection of natural finishes. Enjoy its resistance features, such as protection against scratches, fading, moisture, insects, and weather, all backed by a 25-year warranty.',
    ar: 'تتميز ألواح فيستاكلاد للإكساء من نوع إنفينيتي المصنوعة من الخيزران المركب المغطى والمُبثوق بمتانة استثنائية. يُغلَّف قلب الخيزران المركب بغطاء بوليمري هندسي متين للحصول على مركب مرن. تُقدم إنفينيتي بديلاً صديقًا للبيئة وسهل الصيانة للألواح التقليدية، بمجموعة متنوعة من التشطيبات الطبيعية. استمتع بمزاياها المقاومة، مثل الحماية من الخدوش والبهتان والرطوبة والحشرات والعوامل الجوية، وجميعها مدعومة بضمان لمدة 25 عامًا.'
  },
  takeHomeBenefits: { en: 'TAKE HOME THE BENEFITS', ar: 'استمتع بالمزايا' },
  systemComponents: { en: 'VISTACLAD SYSTEM COMPONENTS', ar: 'مكونات نظام فيستاكلاد' },
  systemComponentsDesc: {
    en: 'The VistaClad system combines Eva-Last composite technologies with an innovative installation process to provide a robust and convenient cladding solution. The resultant hidden fixing generates an unblemished finish and avoids the limitations or inconvenience of fastening through composite.',
    ar: 'يجمع نظام فيستاكلاد بين تقنيات إيفا-لاست المركبة وعملية تركيب مبتكرة لتوفير حل إكساء قوي ومريح. ينتج عن التثبيت المخفي تشطيبًا خاليًا من العيوب ويتجنب القيود أو الإزعاج الناتج عن التثبيت من خلال المواد المركبة.'
  },
  compositeCladdingBoards: { en: 'COMPOSITE CLADDING BOARDS', ar: 'ألواح الإكساء المركبة' },
  clipStrip: { en: 'CLIP STRIP', ar: 'شريط التثبيت' },
  adaptersTrim: { en: 'ADAPTERS & TRIM PROFILES', ar: 'الملحقات وبروفيلات التشطيب' },
  infinityBambooTitle: { en: 'INFINITY BAMBOO COMPOSITE CLADDING', ar: 'إكساء إنفينيتي من الخيزران المركب' },
  infinityBambooDesc: {
    en: 'VistaClad cladding boards are available in Infinity bamboo composite material technologies, designed for long-lasting weather resistance, including protection against insects, moisture, and fading. The tongue and groove profile design interlocks the boards, supplying system tolerance whilst improving load distribution and reduction of moisture ingress.',
    ar: 'ألواح فيستاكلاد متوفرة بتقنية إنفينيتي من الخيزران المركب، مصممة لمقاومة الطقس طويلة الأمد، بما في ذلك الحماية من الحشرات والرطوبة والبهتان. يعمل تصميم اللسان والأخدود على تداخل الألواح، مما يوفر تحمل النظام مع تحسين توزيع الحمل وتقليل تسرب الرطوبة.'
  },
  crossSection: { en: 'Cross section', ar: 'المقطع العرضي' },
  productDescription: { en: 'Product description', ar: 'وصف المنتج' },
  dimensions: { en: 'Dimensions', ar: 'الأبعاد' },
  coverageWidth: { en: 'Coverage width', ar: 'عرض التغطية' },
  mass: { en: 'Mass', ar: 'الكتلة' },
  standardInfinity: { en: 'Standard (Infinity)', ar: 'قياسي (إنفينيتي)' },
  dimensionsValue: { en: '159.5 x 22.5 mm\n(5.45 m lengths)', ar: '159.5 × 22.5 مم\n(أطوال 5.45 م)' },
  coverageValue: { en: '6.6 m²/m²', ar: '6.6 م²/م²' },
  massValue: { en: '2.2 kg/m', ar: '2.2 كجم/م' },
  colourRange: { en: 'COLOUR RANGE – BRUSHED SOFTWOOD FINISH', ar: 'مجموعة الألوان - تشطيب الخشب الناعم المصقول' },
  technology: { en: 'TECHNOLOGY:', ar: 'التقنية:' },
  warranty: { en: 'Reliable durability with a 25-year warranty', ar: 'متانة موثوقة مع ضمان لمدة 25 سنوات' },
  colourRangeDesc: {
    en: 'The Infinity colour range offers specialised streaked colour technology to ensure that no two cladding boards are identical and to give your exterior walls the look of natural timber cladding. The brushed finish applied to the VistaClad Infinity cladding boards further enhances the natural tones, allowing you to enjoy the look of timber cladding in a more durable, hassle-free, and sustainable bamboo composite.',
    ar: 'توفر مجموعة ألوان إنفينيتي تقنية ألوان مخططة متخصصة لضمان عدم تطابق أي لوحين من ألواح الإكساء ومنح جدرانك الخارجية مظهر الخشب الطبيعي. يعزز التشطيب المصقول المطبق على ألواح فيستاكلاد إنفينيتي النغمات الطبيعية، مما يتيح لك الاستمتاع بمظهر الإكساء الخشبي في منتج أكثر متانة وسهولة في الصيانة واستدامة.'
  },
  cuttingEdgeTitle: { en: 'CUTTING-EDGE, SUSTAINABLE CLADDING', ar: 'إكساء متطور ومستدام' },
  cuttingEdgeDesc: {
    en: 'VistaClad bamboo composite cladding breathes vibrancy into your home or office space and enhances your walls with the attractive look of natural hardwoods. Let routine maintenance and premature replacement be things of the past as you look to the future with one of the most cutting-edge cladding systems available, complete with complementary trim for a neat and tidy finish.',
    ar: 'يمنح إكساء فيستاكلاد من الخيزران المركب الحيوية لمساحتك المنزلية أو المكتبية ويعزز جدرانك بمظهر الخشب الطبيعي الجذاب. اجعل الصيانة الدورية والاستبدال المبكر من الماضي مع أحد أكثر أنظمة الإكساء تطورًا، والمزود بملحقات تشطيب متكاملة لمظهر أنيق ومرتب.'
  },
};

export default async function VistacladPage({ searchParams }: Props) {
  const lang = searchParams?.lang === "ar" ? "ar" : "en";
  const categorySlug = searchParams?.categorySlug;
  const hardcodedPageSlug = "vistaclad";

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

  // TODO: Replace with dynamic data if needed
  const featureImages = [
    { src: "/Vistaclad Cladding _ A Smart Cladding Solution - Eva-Last SA_files/1.-VistaClad-garage-cladding.jpg", alt: "Garage Cladding" },
    { src: "/Vistaclad Cladding _ A Smart Cladding Solution - Eva-Last SA_files/Resident-Lucy-Vistaclad-interior.jpg", alt: "Interior" },
    { src: "/Vistaclad Cladding _ A Smart Cladding Solution - Eva-Last SA_files/3.-VistaClad-enerance-way.jpg", alt: "Entrance Way" },
    { src: "/Vistaclad Cladding _ A Smart Cladding Solution - Eva-Last SA_files/Resident-Lucy-Vistaclad.jpg", alt: "Vistaclad" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center">
          <Link
            href={`/products/${category.slug}?lang=${lang}`}
            className="hidden md:inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary bg-white/50 backdrop-blur-sm text-primary font-medium shadow-sm hover:bg-primary/10 hover:shadow-md transition-all duration-150 mr-4 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <ArrowLeft className="w-5 h-5" />
            {translations.back[lang]}
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
        <h2 className={`text-2xl font-bold mb-4 text-primary ${lang === 'ar' ? 'text-right' : ''}`}>{translations.systemFeatures[lang]}</h2>
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
              {translations.infinityProfileTitle[lang]}
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
              {translations.infinityProfileDesc[lang]}
            </p>
          </div>
        </div>
        </div>
        <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mt-6">
  <div className="flex flex-col items-center gap-6 w-full">
    {/* Top row: two small images side by side on all screens */}
    <div className="flex flex-row w-full gap-4 justify-center items-center">
      <Image
        src="/uploads/Infinity-logo-black.webp"
        alt="Infinity logo"
        width={120}
        height={60}
        className="rounded  w-[120px] h-auto"
      />
      <Image
        src="/uploads/Layer-16@2x.png"
        alt="Layer 16"
        width={120}
        height={60}
        className="rounded  w-[120px] h-auto"
      />
    </div>
    {/* Bottom row: single image centered */}
    <div className="w-full flex justify-center">
      <Image
        src="/uploads/vistaclad-infinity-makeup[1].png"
        alt="Vistaclad Infinity Makeup"
        width={350}
        height={180}
        className="rounded  w-full h-auto max-w-lg"
      />
    </div>
  </div>
</div>
      {/* Cutting-edge, sustainable cladding section */}
      <section className="w-full flex flex-col md:flex-row items-center justify-center gap-8 my-12">
        {/* Image left */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/uploads/Group-3585-595x1024.jpg"
            alt="VistaClad garage cladding"
            width={600}
            height={400}
            className="object-cover rounded-lg shadow-lg max-w-full h-auto"
          />
        </div>
        {/* Text right */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">{translations.cuttingEdgeTitle[lang]}</h2>
          <div className=" w-24 h-1 bg-green-900 mb-6 mx-auto md:mx-0" />
          <p className=" bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mt-6 text-lg text-black-800 max-w-xl">
            {translations.cuttingEdgeDesc[lang]}
          </p>
        </div>
      </section>
      {/* Benefits Section */}
{Array.isArray(subcategory.benefits) && subcategory.benefits.length > 0 && (() => {
  const fullRowCount = Math.floor(subcategory.benefits.length / 5) * 5;
  const fullRows = subcategory.benefits.slice(0, fullRowCount);
  const lastRow = subcategory.benefits.slice(fullRowCount);

  return (
    <div className="my-8">
        <h2 className={`text-2xl font-bold mb-4 text-primary ${lang === 'ar' ? 'text-right' : ''}`}>
  {translations.takeHomeBenefits[lang]}
</h2>


      {/* 🔹 Mobile & Tablet (Default Grid) */}
      <div className="grid grid-cols-3 sm:grid-cols-2 lg:hidden gap-6 justify-items-center">
        {subcategory.benefits.map((benefit, idx) => (
          <div key={idx} className=" flex flex-col items-center text-center">
            {benefit.image && (
              <img
                src={`/api/images/${benefit.image}`}
                alt="Benefit"
                className="w-24 h-24 object-contain mb-2"
              />
            )}
            <p className=" text-black whitespace-pre-line">
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
                <p className=" text-black whitespace-pre-line">
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

      {/* VISTACLAD SYSTEM COMPONENTS section */}
      <section className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mt-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">{translations.systemComponents[lang]}</h2>
        <p className="text-lg text-center text-gray-800 mb-10 max-w-3xl mx-auto">
          {translations.systemComponentsDesc[lang]}
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          {/* Composite Cladding Boards */}
          <div className="flex flex-col items-center">
            <div className="w-56 h-56 rounded-full border-8 border-gray-200 overflow-hidden flex items-center justify-center mb-4">
              <Image
                src="/uploads/Group-5071.png"
                alt="Composite Cladding Boards"
                width={220}
                height={220}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="text-lg font-bold uppercase text-center">{translations.compositeCladdingBoards[lang]}</div>
          </div>
          {/* Clip Strip */}
          <div className="flex flex-col items-center">
            <div className="w-56 h-56 rounded-full border-8 border-gray-200 overflow-hidden flex items-center justify-center mb-4">
              <Image
                src="/uploads/Group-5072.webp"
                alt="Clip Strip"
                width={220}
                height={220}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="text-lg font-bold uppercase text-center">{translations.clipStrip[lang]}</div>
          </div>
          {/* Adapters & Trim Profiles */}
          <div className="flex flex-col items-center">
            <div className="w-56 h-56 rounded-full border-8 border-gray-200 overflow-hidden flex items-center justify-center mb-4">
              <Image
                src="/uploads/Group-5073.png"
                alt="Adapters & Trim Profiles"
                width={220}
                height={220}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="text-lg font-bold uppercase text-center">{translations.adaptersTrim[lang]}</div>
          </div>
        </div>
      </section>

        {/* INFINITY BAMBOO COMPOSITE CLADDING section */}
        <section className="max-w-5xl mx-auto my-16 px-4">
          {/* Logos */}
          <div className="flex flex-row justify-center items-center gap-8 mb-4">
            <Image
              src="/uploads/Infinity-logo-black.webp"
              alt="Infinity logo"
              width={180}
              height={60}
              className="object-contain"
            />
            <Image
              src="/uploads/25yr-Warranty-2022.webp"
              alt="25 Year Warranty"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-4">{translations.infinityBambooTitle[lang]}</h2>
          {/* Description */}
          <p className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mt-6 text-lg text-center text-gray-800 mb-8 max-w-3xl mx-auto">
            {translations.infinityBambooDesc[lang]}
          </p>
          {/* Table */}
          <div className="overflow-x-auto">
            <div className="grid grid-cols-5 text-center text-white text-lg font-semibold">
              <div className="bg-green-800 py-4 px-2 border-r border-white">{translations.crossSection[lang]}</div>
              <div className="bg-green-800 py-4 px-2 border-r border-white">{translations.productDescription[lang]}</div>
              <div className="bg-green-800 py-4 px-2 border-r border-white">{translations.dimensions[lang]}</div>
              <div className="bg-green-800 py-4 px-2 border-r border-white">{translations.coverageWidth[lang]}</div>
              <div className="bg-green-800 py-4 px-2">{translations.mass[lang]}</div>
            </div>
            <div className="grid grid-cols-5 text-center text-black text-base font-medium">
              <div className="bg-gray-100 py-6 px-2 flex items-center justify-center border-r border-white">
                <Image
                  src="/uploads/vistaclad-infinity-profiles-1024x145.png"
                  alt="Cross section"
                  width={120}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="bg-gray-100 py-6 px-2 border-r border-white flex items-center justify-center">{translations.standardInfinity[lang]}</div>
              <div className="bg-gray-100 py-6 px-2 border-r border-white flex items-center justify-center">{translations.dimensionsValue[lang].replace(/\\n/g, '\n')}</div>
              <div className="bg-gray-100 py-6 px-2 border-r border-white flex items-center justify-center">{translations.coverageValue[lang]}</div>
              <div className="bg-gray-100 py-6 px-2 flex items-center justify-center">{translations.massValue[lang]}</div>
            </div>
          </div>
        </section>
      {/* Colors Section */}
      {Array.isArray(colors) && colors.length > 0 && (
        <div className="my-8">
          
          <div className="w-full flex flex-col md:flex-row items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold text-primary text-center md:text-left w-full md:w-auto">
              {translations.colourRange[lang]}
            </h2>
            <div className="flex flex-col items-center gap-4 w-full md:w-auto">
        
  <div className="flex items-center gap-4">
    <span className="text-lg font-semibold text-black">
      {translations.technology[lang]}
    </span>
    <Image
      src="/uploads/Infinity-logo-black.webp"
      alt="Eva-tech Logo"
      width={180}
      height={60}
      className="object-contain"
    />
  </div>

  <p className="text-center text-black text-sm md:text-base leading-snug">
    {translations.warranty[lang]}
  </p>
</div>
          </div>
          <p className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mt-6">{translations.colourRangeDesc[lang]}</p>
            
          <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-4  grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
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
