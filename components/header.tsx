"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, ShoppingCart } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import MobileNav from "./mobile-nav"
import { ThemeToggle } from "./theme-toggle"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import type { Category } from "@/lib/data"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import Image from "next/image"

type HeaderProps = {
  siteName: { en: string; ar: string }
  siteDescription: { en: string; ar: string }
  categories: Category[]
  logo?: string
}

export default function Header({ siteName, siteDescription, categories, logo }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") === "ar" ? "ar" : "en";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY === 0) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className={`fixed top-0 z-50 w-full transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container flex h-16 items-center backdrop-blur-md bg-green-100/40 border-b border-green-200/50">
        <Popover open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-black hover:text-primary bg-transparent">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" sideOffset={8} className="p-0 w-64 mt-2 bg-transparent border-none shadow-none">
            <MobileNav categories={categories} closeMenu={() => setMobileMenuOpen(false)} />
          </PopoverContent>
        </Popover>

        <Link href="/" className="mr-2 md:mr-6 flex items-center space-x-2">
          {logo ? (
            <div className="relative w-40 h-16">
              <Image
                src={logo}
                alt={siteName.en}
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          ) : (
            <span className="font-bold text-xl text-black">{siteName.en}</span>
          )}
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            href={{ pathname: "/", query: lang === "ar" ? { lang } : undefined }}
            className={cn(
              "transition-all duration-300 hover:bg-green-100 hover:text-black px-4 py-2 rounded-md",
              isActive("/") ? "bg-green-100 text-black" : "text-black"
            )}
          >
            {lang === "ar" ? "الرئيسية" : "Home"}
          </Link>
          <Link
            href={{ pathname: "/products", query: lang === "ar" ? { lang } : undefined }}
            className={cn(
              "transition-all duration-300 hover:bg-green-100 hover:text-black px-4 py-2 rounded-md",
              isActive("/products") || pathname.startsWith("/products/") ? "bg-green-100 text-black" : "text-black"
            )}
          >
            {lang === "ar" ? "المنتجات" : "Products"}
          </Link>
          <Link
            href={{ pathname: "/gallery", query: lang === "ar" ? { lang } : undefined }}
            className={cn(
              "transition-all duration-300 hover:bg-green-100 hover:text-black px-4 py-2 rounded-md",
              isActive("/gallery") || pathname.startsWith("/gallery/") ? "bg-green-100 text-black" : "text-black"
            )}
          >
            {lang === "ar" ? "المعرض" : "Gallery"}
          </Link>
          <Link
            href={{ pathname: "/contact", query: lang === "ar" ? { lang } : undefined }}
            className={cn(
              "transition-all duration-300 hover:bg-green-100 hover:text-black px-4 py-2 rounded-md",
              isActive("/contact") ? "bg-green-100 text-black" : "text-black"
            )}
          >
            {lang === "ar" ? "تواصل معنا" : "Contact Us"}
          </Link>
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          
          <div className="ml-2 ">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}
