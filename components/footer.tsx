"use client"
import Link from "next/link"
import { Facebook, Instagram } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { useSearchParams } from "next/navigation"
import FooterOurStory from "./FooterOurStory"
import { useState, useEffect } from "react"

type FooterProps = {
  siteName: { en: string; ar: string }
  address: { en: string; ar: string }
  contactEmail: string
  contactPhone: { en: string; ar: string }
  ourStory: { en: string; ar: string }
  lang: 'en' | 'ar'
}

export default function Footer({ siteName, address, contactEmail, contactPhone, ourStory, lang: initialLang }: FooterProps) {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [lang, setLang] = useState<'en' | 'ar'>(initialLang)

  useEffect(() => {
    setMounted(true)
    const urlLang = searchParams.get("lang")
    if (urlLang === "ar" || urlLang === "en") {
      setLang(urlLang)
    }
  }, [searchParams])

  return (
    <footer className="border-t text-white bg-black">
      <div className="container px-4 py-8 md:py-12">
        {/* Mobile Layout */}
        <div className="block lg:hidden bg-black rounded-xl p-4">
          <div className="flex flex-row justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
            <img src="/timbex2.ico" alt="Timbex Logo" width={150} height={150} className="mb-4" />
              <div className="text-sm">
                <p className="mb-1 block break-words whitespace-normal w-full">{address[lang]}</p>
                <p className="mb-1 truncate">{contactEmail}</p>
                <p className="truncate">{contactPhone[lang]}</p>
              </div>
            </div>
            <div className="flex flex-col items-center min-w-fit space-y-2">
              <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
              <Link href="https://www.facebook.com/share/14M57BDFBeA/?mibextid=wwXIfr" className="flex items-center gap-2 hover:text-primary focus:text-primary text-white transition-colors" target="_blank" rel="noopener noreferrer">  
                <Facebook className="h-5 w-5" />
                <span>Facebook</span>
              </Link>
              <Link href="https://www.instagram.com/timbex_sy" className="flex items-center gap-2 hover:text-primary focus:text-primary text-white transition-colors" target="_blank" rel="noopener noreferrer">  
                <Instagram className="h-5 w-5" />
                <span>Instagram</span>
              </Link>
              <Link href="https://wa.me/963968484801" className="flex items-center gap-2 hover:text-primary focus:text-primary text-white transition-colors" target="_blank" rel="noopener noreferrer">  
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
        <div className="hidden lg:grid grid-cols-3 gap-8 items-stretch">
          {/* Left: Company details and Quick Links with divider */}
          <div className="col-span-2 flex flex-row border-b border-white/50 pb-4" style={{ backgroundColor: "black" }}>
            <div className="flex-1 pr-8 border-r border-white/50">
              <img src="/timbex2.ico" alt="Timbex Logo" width={400} height={400} className="mb-4" />
              <div className="text-sm">
                <p className="mb-2">{address[lang]}</p>
                <p className="mb-2">{contactEmail}</p>
                <p>{contactPhone[lang]}</p>
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
          <div className="row-span-2 flex items-center justify-center bg-transparent border border-white/30 rounded-xl p-4 backdrop-blur-sm">
                <FooterOurStory ourStory={ourStory} initialLang={lang} />
          </div>

          {/* Follow Us section below left columns */}
          <div className="col-span-2 flex flex-col items-center w-full pt-8 border-t border-white/50" style={{ backgroundColor: "black" }}>
            <h3 className="text-3xl font-extrabold mb-4 text-white">Follow Us</h3>
            <div className="flex flex-row items-center justify-center gap-16 w-full">
              <Link href="https://wa.me/963968484801" className="hover:text-primary focus:text-primary text-white transition-colors flex flex-col items-center text-xl font-bold" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className="h-8 w-8 mb-2" />
                <span>WhatsApp</span>
              </Link>
              <Link href="https://www.facebook.com/share/14M57BDFBeA/?mibextid=wwXIfr" className="hover:text-primary focus:text-primary text-white transition-colors flex flex-col items-center text-xl font-bold" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-8 w-8 mb-2" />
                <span>Facebook</span>
              </Link>
              <Link href="https://www.instagram.com/timbex_sy" className="hover:text-primary focus:text-primary text-white transition-colors flex flex-col items-center text-xl font-bold" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-8 w-8 mb-2" />
                <span>Instagram</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {siteName[lang]}. All rights reserved.</p>
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
