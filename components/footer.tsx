"use client"
import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { useSearchParams } from "next/navigation"
import FooterOurStory from "./FooterOurStory"
import { useState, useEffect } from "react"

type FooterProps = {
  siteName: { en: string; ar: string }
  address: string
  contactEmail: string
  contactPhone: string
  ourStory: { en: string; ar: string }
  lang: 'en' | 'ar'
}

export default function Footer({ siteName, address, contactEmail, contactPhone, ourStory, lang: initialLang }: FooterProps) {
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : undefined;
  let lang = initialLang;
  if (searchParams) {
    const urlLang = searchParams.get("lang");
    if (urlLang === "ar" || urlLang === "en") lang = urlLang;
  }

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="border-t bg-black text-white">
      <div className="container px-4 py-8 md:py-12">
        {/* Mobile Layout */}
        <div className="block lg:hidden">
          <div className="flex flex-row justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold mb-2">{siteName.en}</h3>
              <div className="text-sm">
                <p className="mb-1 block break-words whitespace-normal w-full">{address}</p>
                <p className="mb-1 truncate">{contactEmail}</p>
                <p className="truncate">{contactPhone}</p>
              </div>
            </div>
            <div className="flex flex-col items-center min-w-fit space-y-2">
              <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
              
              <Link href="#" className="flex items-center gap-2 hover:text-primary focus:text-primary text-white transition-colors">  
                  <Facebook className="h-5 w-5" />
                  <span>Facebook</span>
                </Link>
                
                <Link href="#" className="flex items-center gap-2 hover:text-primary focus:text-primary text-white transition-colors">  
                  <Instagram className="h-5 w-5" />
                  <span>Instagram</span>
                </Link>
                <Link href="#" className="flex items-center gap-2 hover:text-primary focus:text-primary text-white transition-colors">  
                  <FaWhatsapp className="h-5 w-5" />
                  <span>WhatsApp</span>
                </Link>
              
            </div>
          </div>
          <div className="flex flex-row flex-wrap gap-4 justify-center border-t pt-6">
            {mounted && (
              <>
                <Link href={{ pathname: "/", query: lang === "ar" ? { lang } : undefined }} className="hover:text-primary text-white py-2 px-2 rounded-md transition-colors">
                  {lang === "ar" ? "الرئيسية" : "Home"}
                </Link>
                <Link href={{ pathname: "/products", query: lang === "ar" ? { lang } : undefined }} className="hover:text-primary text-white py-2 px-2 rounded-md transition-colors">
                  {lang === "ar" ? "المنتجات" : "Products"}
                </Link>
                <Link href={{ pathname: "/gallery", query: lang === "ar" ? { lang } : undefined }} className="hover:text-primary text-white py-2 px-2 rounded-md transition-colors">
                  {lang === "ar" ? "المعرض" : "Gallery"}
                </Link>
                <Link href={{ pathname: "/contact", query: lang === "ar" ? { lang } : undefined }} className="hover:text-primary text-white py-2 px-2 rounded-md transition-colors">
                  {lang === "ar" ? "تواصل معنا" : "Contact"}
                </Link>
              </>
            )}
          </div>
        </div>
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-3 gap-8 items-stretch">
            {/* Left: Company details and Quick Links with divider */}
            <div className="col-span-2 flex flex-row border-b border-white/50 pb-4">
              <div className="flex-1 pr-8 border-r border-white/50">
                <h3 className="text-lg font-semibold mb-4">{siteName.en}</h3>
                <div className="text-sm">
                  <p className="mb-2">{address}</p>
                  <p className="mb-2">{contactEmail}</p>
                  <p>{contactPhone}</p>
                </div>
              </div>
              <div className="flex-1 pl-8">
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <nav className="flex flex-col space-y-2 text-sm">
                  {mounted && (
                    <>
                      <Link href={{ pathname: "/", query: lang === "ar" ? { lang } : undefined }} className="hover:text-primary text-white py-2 px-2 rounded-md transition-colors">{lang === "ar" ? "الرئيسية" : "Home"}</Link>
                      <Link href={{ pathname: "/products", query: lang === "ar" ? { lang } : undefined }} className="hover:text-primary text-white py-2 px-2 rounded-md transition-colors">{lang === "ar" ? "المنتجات" : "Products"}</Link>
                      <Link href={{ pathname: "/gallery", query: lang === "ar" ? { lang } : undefined }} className="hover:text-primary text-white py-2 px-2 rounded-md transition-colors">{lang === "ar" ? "المعرض" : "Gallery"}</Link>
                      <Link href={{ pathname: "/contact", query: lang === "ar" ? { lang } : undefined }} className="hover:text-primary text-white py-2 px-2 rounded-md transition-colors">{lang === "ar" ? "تواصل معنا" : "Contact"}</Link>
                    </>
                  )}
                </nav>
              </div>
            </div>
            {/* Our Story */}
            <div className="row-span-2 flex items-center justify-center">
              <FooterOurStory ourStory={ourStory} initialLang={lang} />
            </div>
            {/* Follow Us section below left columns */}
            <div className="col-span-2 flex flex-col items-center w-full pt-8 border-t border-white/50">
              <h3 className="text-3xl font-extrabold mb-4 text-white">Follow Us</h3>
              <div className="flex flex-row items-center justify-center gap-16 w-full">
                <Link href="#" className="hover:text-primary focus:text-primary text-white transition-colors flex flex-col items-center text-xl font-bold">
                  <FaWhatsapp className="h-8 w-8 mb-2" />
                  <span>WhatsApp</span>
                </Link>
                <Link href="#" className="hover:text-primary focus:text-primary text-white transition-colors flex flex-col items-center text-xl font-bold">
                  <Facebook className="h-8 w-8 mb-2" />
                  <span>Facebook</span>
                </Link>
                <Link href="#" className="hover:text-primary focus:text-primary text-white transition-colors flex flex-col items-center text-xl font-bold">
                  <Instagram className="h-8 w-8 mb-2" />
                  <span>Instagram</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm">
  <p>&copy; {new Date().getFullYear()} {siteName.en}. All rights reserved.</p>
  <p className="mt-2 text-white">
    Powered by{" "}
    <a
      href="https://www.elyptek.com"
      target="_blank"
      rel="noopener noreferrer"
      className="text-orange-500 underline hover:text-orange-400"
    >
      Elyptek®
    </a>
  </p>
</div>

      </div>
    </footer>
  )
}
