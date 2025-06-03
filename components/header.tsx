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

type HeaderProps = {
  siteName: { en: string; ar: string }
  siteDescription: { en: string; ar: string }
  categories: Category[]
}

export default function Header({ siteName, siteDescription, categories }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") === "ar" ? "ar" : "en";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-white">
      <div className="container flex h-16 items-center">
        <Popover open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-primary bg-transparent">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" sideOffset={8} className="p-0 w-64 mt-2">
            <MobileNav categories={categories} closeMenu={() => setMobileMenuOpen(false)} />
          </PopoverContent>
        </Popover>

        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-xl text-white">{siteName.en}</span>
        </Link>

        {mounted && (
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href={{ pathname: "/", query: lang === "ar" ? { lang } : undefined }}
              className={cn(
                "transition-colors hover:text-black bg-transparent text-white",
                isActive("/") ? "text-primary bg-white rounded px-2 py-1" : "text-white"
              )}
            >
              {lang === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <Link
              href={{ pathname: "/products", query: lang === "ar" ? { lang } : undefined }}
              className={cn(
                "transition-colors hover:text-black bg-transparent text-white",
                isActive("/products") || pathname.startsWith("/products/") ? "text-primary bg-white rounded px-2 py-1" : "text-white"
              )}
            >
              {lang === "ar" ? "المنتجات" : "Products"}
            </Link>
            <Link
              href={{ pathname: "/gallery", query: lang === "ar" ? { lang } : undefined }}
              className={cn(
                "transition-colors hover:text-black bg-transparent text-white",
                isActive("/gallery") || pathname.startsWith("/gallery/") ? "text-primary bg-white rounded px-2 py-1" : "text-white"
              )}
            >
              {lang === "ar" ? "المعرض" : "Gallery"}
            </Link>
            <Link
              href={{ pathname: "/contact", query: lang === "ar" ? { lang } : undefined }}
              className={cn(
                "transition-colors hover:text-black bg-transparent text-white",
                isActive("/contact") ? "text-primary bg-white rounded px-2 py-1" : "text-white"
              )}
            >
              {lang === "ar" ? "تواصل معنا" : "Contact Us"}
            </Link>
          </nav>
        )}

        <div className="flex items-center ml-auto">
          <ThemeToggle />
          <div className="ml-2">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}
