"use client"
import Image from "next/image"
import { Award, CheckCircle, Quote } from "lucide-react"
import ReadMoreText from "@/components/ReadMoreText"
import { motion } from "framer-motion"
import { LightBulbIcon, FlagIcon, SparklesIcon } from "@heroicons/react/24/outline"

interface HomepageSectionsProps {
  homepageSettings: any
  lang: string
  values: string[]
  whyChooseUs: string[]
  vision: string
  mission: string
}

export default function HomepageSections({ homepageSettings, lang, values, whyChooseUs, vision, mission }: HomepageSectionsProps) {
  return (
    <div className="overflow-x-hidden">
      <div className="container mx-auto px-4 md:px-8 py-6 md:py-12 space-y-8 md:space-y-16 overflow-x-hidden">
        {/* Our Company Card */}
        <section className="flex flex-col md:flex-row items-center bg-gradient-to-br from-primary/25 to-white rounded-2xl shadow-lg p-4 md:p-8 gap-4 md:gap-8 animate-fade-in">
          <div className="flex-1 space-y-4">

            <h1 className="text-2xl md:text-5xl font-extrabold text-primary mb-2 flex items-center justify-center gap-2">
            <SparklesIcon className="h-10 w-10" /> {lang === "ar" ? "من نحن" : "Who We Are"} <SparklesIcon className="h-10 w-10" />
            </h1>
            <div className="block md:hidden text-black">
              <ReadMoreText text={homepageSettings?.ourCompany?.[lang] || "We provide high-quality products and services to meet all your needs. Explore our catalog and discover what makes us different."} maxLines={4} lang={lang as 'en' | 'ar'} />
            </div>
            <p className="hidden md:block text-black text-lg">
              {homepageSettings?.ourCompany?.[lang] || "We provide high-quality products and services to meet all your needs. Explore our catalog and discover what makes us different."}
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <Image
              alt="Company Hero"
              className="rounded-full shadow-lg w-full max-w-xs md:max-w-md aspect-square object-cover"
              height={400}
              width={400}
              src="/uploads/gardian.jpg"
            />
          </div>
        </section>

        {/* Our Values Section */}
        <section>
          
          <h2 className="text-3xl font-bold mb-8 text-center text-primary flex items-center justify-center gap-2">
          <Award className="h-8 w-8 text-primary" /> {lang === "ar" ? "قيمنا" : "Our Values"} <Award className="h-8 w-8 text-primary" /> 
          </h2>
          <div className="flex flex-col gap-4 md:gap-6 relative">
            {(homepageSettings.ourValues ?? []).map((val: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ x: idx % 2 === 0 ? -200 : 200, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                className={`bg-white border border-primary rounded-xl shadow p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6
                  w-full max-w-full md:w-[40rem] min-h-32 md:min-h-48
                  ${idx % 2 === 0 ? 'md:self-start md:ml-2' : 'md:self-end md:mr-2'}
                  ${idx > 0 ? 'md:mt-[-2rem]' : ''}`}
              >
                <div className="flex-1">
                  <div className="text-xl font-bold text-primary mb-2">{val.title?.[lang] || ''}</div>
                  <div className="text-black whitespace-pre-line break-words">{val.description?.[lang] || ''}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="bg-gray-20 rounded-xl shadow-md p-8 mb-8 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-4 text-primary border-b-2 border-primary/20 pb-2 ">
            {lang === "ar" ? "لماذا تختار تيمبكس؟" : "Why Choose Timbex?"}
          </h2>
          <ul className="space-y-6">
            {whyChooseUs.map((reason: string, idx: number) => (
              <li key={idx} className="flex items-start gap-4 text-lg">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <CheckCircle className="text-primary" size={28} />
                </span>
                <span className="text-black leading-relaxed">{reason}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Founder Quote Section */}
        <section className="flex justify-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-gradient-to-br from-primary/25 to-white rounded-2xl shadow-lg p-4 md:p-10 max-w-full md:max-w-2xl text-center"
          >
            <Quote className="h-10 w-10 mx-auto mb-4 text-primary" />
            <blockquote className="text-lg md:text-2xl italic font-light text-black mb-4">
              "{homepageSettings?.foundersQuote?.[lang] || "Founded in 2010, our company has been dedicated to providing exceptional products and services to our customers."}"
            </blockquote>
            <div className="text-secondary">"—Shady Alsamman, Co-Founder /CEO"</div>
          </motion.div>
        </section>

        {/* Vision & Mission Section */}
        <section className="flex flex-col md:flex-row gap-8">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1 bg-white border border-primary rounded-xl shadow p-4 md:p-8 text-center"
          >
           
            <h3 className="text-3xl font-bold mb-8 text-center text-primary flex items-center justify-center gap-2">
            <LightBulbIcon className="h-12 w-12 text-primary" /> {lang === "ar" ? "رؤيتنا" : "Our Vision"} <LightBulbIcon className="h-12 w-12 text-primary" />
            </h3>
            <p className="text-black whitespace-pre-line text-center">{vision}</p>
          </motion.div>
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1 bg-white border border-primary rounded-xl shadow p-4 md:p-8 text-center"
          >
            
              
            
            <h3 className="text-3xl font-bold mb-8 text-center text-primary flex items-center justify-center gap-2">
               <FlagIcon className="h-12 w-12 text-primary" /> {lang === "ar" ? "مهماتنا" : "Our Mission"} <FlagIcon className="h-12 w-12 text-primary" />
            </h3>
            <p className="text-black whitespace-pre-line text-center">{mission}</p>
          </motion.div>
        </section>

        {/* Accreditations & Partnerships Section - hidden on mobile, visible on md+ */}
        <section className="py-16 bg-gradient-to-br from-primary/10 to-white hidden md:block">
          <div className="container mx-auto px-4">
            <div className="max-w-full md:max-w-4xl mx-auto bg-gradient-to-br from-primary/25 to-white rounded-lg shadow-lg p-4 md:p-8 animate-fade-in border border-primary">
              <div className="flex flex-col items-center mb-8">
                <Award className="h-10 w-10 text-primary mb-2" />
                <h2 className="text-3xl  text-black text-center">{homepageSettings?.accreditations?.[lang] || "Accreditations & Partnerships"}</h2>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 list-disc list-inside text-black text-lg">
                {(homepageSettings?.accreditationsList?.[lang] || []).map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 
