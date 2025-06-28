import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCategoryBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import ReadMoreText from "@/components/ReadMoreText";

interface Benefit {
  image?: string;
  description_en?: string;
  description_ar?: string;
}

interface Props {
  searchParams?: { lang?: string; categorySlug?: string };
}

// Hardcoded feature icons row with placeholder images
const featureIcons = [
  { icon: "https://via.placeholder.com/48", label: "STABLE" },
  { icon: "https://via.placeholder.com/48", label: "WATER RESISTANT" },
  { icon: "https://via.placeholder.com/48", label: "HEAT RESISTANT" },
  { icon: "https://via.placeholder.com/48", label: "SOUND SUPPRESSION" },
  { icon: "https://via.placeholder.com/48", label: "CLICK INSTALLATION" },
  { icon: "https://via.placeholder.com/48", label: "VOC FREE" },
];

// Hardcoded applications grid with placeholder images
const applications = [
  { img: "https://via.placeholder.com/128x96", label: "HOME" },
  { img: "https://via.placeholder.com/128x96", label: "OFFICE" },
  { img: "https://via.placeholder.com/128x96", label: "RETAIL" },
  { img: "https://via.placeholder.com/128x96", label: "HOSPITALITY" },
];

export default async function TierclassicPage({ searchParams }: Props) {
  const lang = searchParams?.lang === "ar" ? "ar" : "en";
  const categorySlug = searchParams?.categorySlug;
  const hardcodedPageSlug = "tierclassic";

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
    colors?: { image?: string; name?: string; code?: string }[];
  } | undefined;
  if (!subcategory) notFound();
  const benefits: Benefit[] = subcategory.benefits || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Logo, Slogan, and Title */}
      <div className="mb-8">
        <div className={`flex items-center `}> 
          <Link
            href={`/products/${category.slug}?lang=${lang}`}
            className={`hidden md:inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary bg-white/50 backdrop-blur-sm text-primary font-medium shadow-sm hover:bg-primary/10 hover:shadow-md transition-all duration-150 mr-4 focus:outline-none focus:ring-2 focus:ring-primary ${lang === 'ar' ? 'ml-4' : 'mr-4'}`}
          >
            <ArrowLeft className="w-5 h-5" />
            {lang === 'ar' ? 'العودة' : 'Back'}
          </Link>
          <div className={lang === 'ar' ? 'text-right' : 'text-left'} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <h1 className="text-3xl font-bold">
              {subcategory.name ? (lang === "ar" ? subcategory.name.ar : subcategory.name.en) : ""}
            </h1>
            <p className={`text-gray-600 mt-2`}>
              {lang === "ar" ? category.name.ar : category.name.en}
            </p>
          </div>
        </div>
        <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mb-8 flex flex-col items-center">
          {subcategory.logo && (
            <Image
              src={`/api/images/${subcategory.logo}`}
              alt={lang === 'ar' ? 'شعار' : 'Logo'}
              width={300}
              height={80}
              className="mb-4"
            />
          )}
          {subcategory.slogan && (
            <p className="text-xl font-semibold text-center text-primary mb-2" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              {lang === "ar" ? subcategory.slogan.ar : subcategory.slogan.en}
            </p>
          )}
        </div>
      </div>

      {/* RELIABLE, DURABLE SPC FLOORING Section (from DB) */}
      {subcategory.description && (subcategory.description[lang] || subcategory.description.en) && (
        <div className={`bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mb-8 text-center`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <h2 className="text-2xl font-bold text-primary mb-2">{lang === 'ar' ? 'أرضيات SPC متينة وموثوقة' : 'RELIABLE, DURABLE SPC FLOORING'}</h2>
          <p className="text-gray-700">
            {subcategory.description[lang] || subcategory.description.en}
          </p>
        </div>
      )}

      
      {/* Benefits Section (dynamic) */}
      {Array.isArray(benefits) && benefits.length > 0 && (
        <div className={`my-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <h2 className={`text-2xl font-bold mb-4 text-primary text-center`}>{lang === 'ar' ? 'استمتع بالمزايا' : 'Take Home The Benefits'}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                {benefit.image && (
                  <img
                    src={`/api/images/${benefit.image}`}
                    alt={lang === 'ar' ? 'ميزة' : 'Benefit'}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2"
                  />
                )}
                <p className="text-black whitespace-pre-line">
                  {lang === 'ar' ? benefit.description_ar : benefit.description_en}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
     

      {/* DIVERSE APPLICATIONS Section */}
<div className={`bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mb-8 text-center ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
  <h2 className="text-2xl font-bold text-primary mb-1">{lang === 'ar' ? 'تطبيقات متنوعة' : 'DIVERSE APPLICATIONS'}</h2>
  <p className="italic text-primary mb-4">{lang === 'ar' ? 'جميلة في أي منزل أو مكان عمل' : 'Beautiful in any home or business setting'}</p>

  {/* Responsive Grid */}
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4">
    <div>
      <img src="/tierclassic/classic-bathroom-1.jpg" alt={lang === 'ar' ? 'حمام' : 'Bathroom'} className="w-full h-full object-cover rounded mb-2" />
    </div>
    <div>
      <img src="/tierclassic/classic-bedroom-1.jpg" alt={lang === 'ar' ? 'غرفة نوم' : 'Bedroom'} className="w-full h-full object-cover rounded mb-2" />
    </div>
    <div>
      <img src="/tierclassic/classic-commercial-hospitality-1.jpg" alt={lang === 'ar' ? 'ضيافة' : 'Hospitality'} className="w-full h-full object-cover rounded mb-2" />
    </div>
    <div>
      <img src="/tierclassic/classic-commercial-retail.jpg" alt={lang === 'ar' ? 'تجزئة' : 'Retail'} className="w-full h-full object-cover rounded mb-2" />
    </div>
    <div>
      <img src="/tierclassic/classic-commercial-restaurant.jpg" alt={lang === 'ar' ? 'مطعم' : 'Restaurant'} className="w-full h-full object-cover rounded mb-2" />
    </div>
    <div>
      <img src="/tierclassic/classic-commercial-corporate-1.jpg" alt={lang === 'ar' ? 'شركات' : 'Corporate'} className="w-full h-full object-cover rounded mb-2" />
    </div>
  </div>

  <p className="text-gray-700">
    {lang === 'ar'
      ? 'تير كلاسيك هو خيار أرضيات داخلية موثوق ودائم ومناسب لمجموعة متنوعة من التركيبات المنزلية والتجارية. مع كل تطبيق، تضمن أرضيات تير كلاسيك التجارية الرضا.'
      : 'TIER Classic  is an indoor flooring option that is reliable, durable, and suitable for a variety of home and business installations. With every application, TIER Classic commercial flooring assures satisfaction.'}
  </p>
</div>

      

      
      {/* SPC INDOOR FLOORING Section (hardcoded) */}
      <div className={`bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mb-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <h2 className="text-2xl font-bold text-primary mb-1 text-center">{lang === 'ar' ? 'أرضيات SPC داخلية' : 'SPC INDOOR FLOORING'}</h2>
        <p className="italic text-primary text-center mb-4">{lang === 'ar' ? 'بتقنية كاربيد كور' : 'With CarbideCore technology'}</p>
        <div className="flex flex-col md:flex-row items-center gap-6 mb-4">
          <div className="relative w-full max-w-xl mx-auto">
            <img src="/uploads/classic-commercial-diagram-numbers.jpg" alt={lang === 'ar' ? 'مخطط طبقات SPC' : 'SPC Layers Diagram'} className="w-full h-48 md:h-80 object-contain" />
            {/* Numbered spans, adjust top/left as needed for your image */}
           
          </div>
          <div className="flex-1 space-y-2 text-sm">
            <div><span className="font-bold text-primary">1 {lang === 'ar' ? 'طبقة الحماية' : 'WEAR LAYER'}</span> <span className="text-gray-700">{lang === 'ar' ? 'مقاومة للأشعة فوق البنفسجية والخدش والانزلاق' : 'UV, scratch, and slip resistant'}</span></div>
            <div><span className="font-bold text-primary">2 {lang === 'ar' ? 'الطبقة الزخرفية' : 'DECORATIVE LAYER'}</span> <span className="text-gray-700">{lang === 'ar' ? 'فيلم نقش الخشب' : 'Patterned woodgrain film'}</span></div>
            <div><span className="font-bold text-green-700">3 {lang === 'ar' ? 'كاربيد كور' : 'CARBIDECORE'}</span> <span className="text-gray-700">{lang === 'ar' ? 'مصنوع بالطاقة الشمسية' : 'Manufactured with solar energy'}</span></div>
            <div><span className="font-bold text-primary">4 {lang === 'ar' ? 'طبقة IXPE الكثيفة' : 'DENSE IXPE UNDERLAY'}</span> <span className="text-gray-700">{lang === 'ar' ? 'عزل صوتي وحراري مع إحساس أكثر نعومة تحت القدم.' : 'Enhanced sound & thermal insulation and a softer feeling underfoot.'}</span></div>
          </div>
        </div>
        <p className="text-gray-700 text-center mb-2">
          {lang === 'ar'
            ? 'تقدم أرضيات تير كلاسيك التجارية طبقة تآكل منقوشة، مما يمنح أرضيتك إحساسًا طبيعيًا وملموسًا. توفر ميزات مقاومة الانزلاق والحماية من الأشعة فوق البنفسجية طول عمر وأمان وأسلوب أكبر. مع طبقة عازلة ومخفضة للضوضاء لمزيد من الراحة تحت القدم.'
            : 'TIER Classic commercial flooring offers an embossed wear layer, giving your floor a natural and tactile feeling. Anti-slip features and UV protection provide greater longevity, safety, and style. Together with a insulating and noise reducing underlay for a softer feeling underfoot.'}
        </p>
      </div>

     {/* PROFILE Section (hardcoded) */}
<div className={`bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mb-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
  <h2 className="text-2xl font-bold text-primary mb-2 text-center">{lang === 'ar' ? 'الملف الشخصي' : 'PROFILE'}</h2>
  <p className="text-gray-700 text-center mb-4">
    {lang === 'ar'
      ? 'يحتوي ملف تير كلاسيك التجاري على نواة بسماكة 4.00 مم مع طبقة تآكل بسماكة 0.50 مم وطبقة IXPE بسماكة 1.00 مم. تصنيف تآكل AC4، هذا المنتج مناسب لكل من المشاريع التجارية (ضمان 5 سنوات) والسكنية (ضمان 25 سنة).'
      : 'TIER Classic commercial profile has a 4.00 mm core with a 0.50mm wear layer and a 1.00mm IXPE layer. An AC4 wear rating, this product is suitable for both commercial (5 year warranty) and residential (25 year warranty).'}
  </p>

  <div className="flex justify-center items-center gap-4">
    {/* 5.5 mm text on the left */}
    <span className="text-primary font-semibold whitespace-nowrap">5.5 {lang === 'ar' ? 'مم' : 'mm'}</span>

    {/* Image and dimensions */}
    <div className="flex flex-col items-center">
      <img 
        src="/uploads/file_2025-06-24_14.28.55.png" 
        alt={lang === 'ar' ? 'مخطط الملف الشخصي' : 'Profile Diagram'}
        className="mb-2 object-contain w-full max-w-xs h-auto md:max-w-full md:h-10" 
      />
      <div className="flex gap-8 text-primary font-semibold text-sm">
        <span>181 {lang === 'ar' ? 'مم' : 'mm'}</span>
      </div>
    </div>
  </div>
</div>


      {/* 2G CLICK SYSTEM Section (hardcoded) */}
      <div className={`bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mb-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <h2 className="text-2xl font-bold text-primary mb-2 text-center">{lang === 'ar' ? 'نظام النقر 2G' : '2G CLICK SYSTEM'}</h2>
        <p className="text-gray-700 text-center mb-4">
          {lang === 'ar'
            ? 'توفر تقنية النقر 2G طريقة قوية وموثوقة لتركيب الأرضيات. يتضمن هذا النظام زاوية الألواح لربط آلية القفل، مما ينتج عنه قفل أفقي قوي وموثوق يمنع الفجوات بين الألواح، بالإضافة إلى قفل رأسي يمنع أي اختلافات غير مرغوب فيها في الارتفاع عبر الأرضية.'
            : '2G Angling technology offers a strong, robust, and reliable method for installing flooring. This type of click system involves angling flooring panels to engage the locking mechanism. This results in sturdy and dependable horizontal locking, preventing gaps between planks, as well as vertical locking which ensures no unwanted height differences across the floor.'}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <img src="/uploads/2G-clip.webp" alt={lang === 'ar' ? 'مخطط قفل 2G' : 'Locking Diagram 1'} className="w-full max-w-xs h-auto object-cover mx-auto"/>
        </div>
      </div>
      {/* SPECIFICATIONS AND WARRANTY Section (exact layout) */}
      <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mb-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">{lang === 'ar' ? 'المواصفات والضمان' : 'SPECIFICATIONS AND WARRANTY'}</h2>
        <div className="w-full flex flex-col items-center">
          <div className="flex flex-col md:flex-row w-full gap-0 md:gap-4 justify-center">
            {/* TIER CLASSIC SPECIFICATIONS TABLE */}
            <table className="w-full text-[11px] sm:text-xs md:text-sm text-center border-collapse mb-2 md:mb-0 shadow-sm">
              <thead>
                <tr>
                  <th colSpan={3} className="bg-primary text-white py-2 px-1 sm:px-2 text-base font-bold whitespace-normal break-words">{lang === 'ar' ? 'مواصفات  تير الكلاسيكي' : 'TIER CLASSIC SPECIFICATIONS'}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100 font-bold">
                  <td className="py-2 px-1 sm:px-2 whitespace-normal break-words">{lang === 'ar' ? 'السماكة الكلية' : 'Total thickness'}</td>
                  <td className="py-2 px-1 sm:px-2 whitespace-normal break-words">{lang === 'ar' ? 'الأبعاد' : 'Dimensions'}</td>
                  <td className="py-2 px-1 sm:px-2 whitespace-normal break-words">{lang === 'ar' ? 'عدد الألواح في الصندوق' : 'Boards per box'}</td>
                </tr>
                <tr>
                  <td className="py-2 px-1 sm:px-2">5.50 {lang === 'ar' ? 'مم' : 'mm'}</td>
                  <td className="py-2 px-1 sm:px-2">181 × 1 220 {lang === 'ar' ? 'مم' : 'mm'}</td>
                  <td className="py-2 px-1 sm:px-2">10</td>
                </tr>
                <tr className="bg-gray-100 font-bold">
                  <td className="py-2 px-1 sm:px-2 whitespace-normal break-words">{lang === 'ar' ? 'سماكة الطبقة السفلية' : 'Underlay thickness'}</td>
                  <td className="py-2 px-1 sm:px-2 whitespace-normal break-words">{lang === 'ar' ? 'سماكة اللب' : 'Core thickness'}</td>
                  <td className="py-2 px-1 sm:px-2 whitespace-normal break-words">{lang === 'ar' ? 'وزن اللوح' : 'Mass per board'}</td>
                </tr>
                <tr>
                  <td className="py-2 px-1 sm:px-2">1.00 {lang === 'ar' ? 'مم' : 'mm'}</td>
                  <td className="py-2 px-1 sm:px-2">4.00 {lang === 'ar' ? 'مم' : 'mm'}</td>
                  <td className="py-2 px-1 sm:px-2">2.08 {lang === 'ar' ? 'كجم' : 'kg'}</td>
                </tr>
                <tr className="bg-gray-100 font-bold">
                  <td className="py-2 px-1 sm:px-2 whitespace-normal break-words">{lang === 'ar' ? 'سماكة طبقة الخارجية' : 'Wear layer thickness'}</td>
                  <td className="py-2 px-1 sm:px-2 whitespace-normal break-words">{lang === 'ar' ? 'مساحة اللوح' : 'm² per board'}</td>
                  <td className="py-2 px-1 sm:px-2 whitespace-normal break-words">{lang === 'ar' ? 'مساحة الصندوق' : 'm² per box'}</td>
                </tr>
                <tr>
                  <td className="py-2 px-1 sm:px-2">0.50 {lang === 'ar' ? 'مم' : 'mm'}</td>
                  <td className="py-2 px-1 sm:px-2">0.22 {lang === 'ar' ? 'م²' : 'm²'}</td>
                  <td className="py-2 px-1 sm:px-2">2.21 {lang === 'ar' ? 'م²' : 'm²'}</td>
                </tr>
                <tr className="bg-gray-200 font-bold">
                  <td className="py-2 px-1 sm:px-2 whitespace-normal break-words">{lang === 'ar' ? 'نوع طبقة الخارجية' : 'Wear layer type'}</td>
                  <td className="py-2 px-1 sm:px-2 whitespace-normal break-words">{lang === 'ar' ? 'نظام التثبيت' : 'Click system'}</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="py-2 px-1 sm:px-2">{lang === 'ar' ? 'بوليمير معالج هندسياً' : 'Engineered polymer'}</td>
                  <td className="py-2 px-1 sm:px-2">2G Groove</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            {/* WARRANTY CLASS TABLE */}
            <table className="w-full text-[11px] sm:text-xs md:text-sm text-center border-collapse shadow-sm md:border-l md:border-gray-300">
              <thead>
                <tr>
                  <th colSpan={2} className="bg-primary text-white py-2 px-1 sm:px-2 text-base font-bold whitespace-normal break-words">{lang === 'ar' ? 'فئة الضمان' : 'WARRANTY CLASS'}</th>
                </tr>
                <tr className="bg-white">
                  <th className="py-2 px-1 sm:px-2 font-bold border-r border-gray-300 whitespace-normal break-words">{lang === 'ar' ? 'تجاري' : 'Commercial'}</th>
                  <th className="py-2 px-1 sm:px-2 font-bold whitespace-normal break-words">{lang === 'ar' ? 'سكني' : 'Domestic'}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="py-2 px-1 sm:px-2 border-r border-gray-300">
                    <img src="/uploads/5-year-warranty.png" alt={lang === 'ar' ? 'ضمان 5 سنوات' : '5 Year Warranty'} className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-1" />
                    <div className="text-xs font-bold">
                      {lang === 'ar' ? 'ضمان 5 سنوات' : '5 YEAR WARRANTY'}
                    </div>
                  </td>
                  <td className="py-2 px-1 sm:px-2">
                    <img src="/uploads/25-year-warranty.png" alt={lang === 'ar' ? 'ضمان 25 سنة' : '25 Year Warranty'} className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-1" />
                    <div className="text-xs font-bold">{lang === 'ar' ? 'ضمان 25 سنة' : '25 YEAR WARRANTY'}</div>
                  </td>
                </tr>
                <tr className="bg-gray-100 font-bold">
                  <td className="py-2 px-1 sm:px-2 border-r border-gray-300 whitespace-normal break-words">{lang === 'ar' ? 'فئة مقاومة التآكل' : 'Abrasion class*'}</td>
                  <td className="py-2 px-1 sm:px-2 whitespace-normal break-words">{lang === 'ar' ? 'فئة مقاومة التآكل' : 'Abrasion class*'}</td>
                </tr>
                <tr>
                  <td className="py-2 px-1 sm:px-2 border-r border-gray-300">AC4</td>
                  <td className="py-2 px-1 sm:px-2">AC4</td>
                </tr>
                <tr className="bg-gray-100 font-bold">
                  <td className="py-2 px-1 sm:px-2 border-r border-gray-300 whitespace-normal break-words">{lang === 'ar' ? 'فئة الاستعمال' : 'Use class'}</td>
                  <td className="py-2 px-1 sm:px-2 whitespace-normal break-words">{lang === 'ar' ? 'فئة الاستعمال' : 'Use class'}</td>
                </tr>
                <tr>
                  <td className="py-2 px-1 sm:px-2 border-r border-gray-300">23</td>
                  <td className="py-2 px-1 sm:px-2">23</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-full flex flex-row mt-2">
            <div className="flex-1 h-2 bg-primary"></div>
            <div className="flex-1 h-2 bg-primary"></div>
          </div>
        </div>
        <div className="text-xs text-gray-500 text-center mb-4">*{lang === 'ar' ? 'كما هو محدد في BS EN 13329' : 'As defined in BS EN 13329'} &nbsp;&nbsp; **{lang === 'ar' ? 'كما هو محدد في BS EN ISO 10582' : 'As defined in BS EN ISO 10582'}</div>
      </div>

      {/* COLOUR RANGE Section (styled like Rapidrail) */}
      {Array.isArray(subcategory.colors) && subcategory.colors.length > 0 && (
        <div className="my-8">
          <div className={`w-full flex flex-col md:flex-row items-center justify-between mb-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <h2 className={`text-3xl font-extrabold text-primary text-center md:text-left w-full md:w-auto ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              {lang === 'ar' ? 'مجموعة الألوان' : 'COLOUR RANGE'}
            </h2>
            
          </div>
          <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
            {subcategory.colors.map((color, idx) => (
              color.image && (
                <img
                  key={idx}
                  src={`/api/images/${color.image}`}
                  alt={color.name || 'Color'}
                  className="w-full max-w-xs sm:max-w-md lg:max-w-lg h-auto object-contain mx-auto"
                />
              )
            ))}
          </div>
        </div>
      )}
      

    </div>
  );
}
