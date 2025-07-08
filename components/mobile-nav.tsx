"use client"

import Link from "next/link"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronDown, Globe } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { Category } from "@/lib/data"

type SubcategoryNav = {
  id: string;
  name: { en: string; ar: string };
  slug: string;
  hardcodedPageSlug?: string;
};

type CategoryNav = {
  id: string;
  name: { en: string; ar: string };
  slug: string;
  subcategories?: SubcategoryNav[];
};

type MobileNavProps = { categories: CategoryNav[]; closeMenu?: () => void };
export default function MobileNav({ categories = [], closeMenu }: MobileNavProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") === "ar" ? "ar" : "en";
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [showCategories, setShowCategories] = useState(false);
  const router = useRouter();

  const isActive = (path: string) => {
    return pathname === path
  }

  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category)
  }

  const toggleLang = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (lang === "en") {
      params.set("lang", "ar");
    } else {
      params.delete("lang");
    }
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="bg-green-100/40 backdrop-blur-lg border border-green-200/50 rounded-2xl p-3 min-h-[320px] flex items-center justify-center">
      <div className="w-full max-w-xs">
        {!showCategories ? (
          <>
            <Link
              href={{ pathname: "/", query: lang === "ar" ? { lang } : undefined }}
              className={cn(
                "block py-3 px-4 rounded-lg text-lg font-bold transition-all duration-200",
                isActive("/") ? "bg-primary/10 text-primary shadow" : "text-gray-800 hover:bg-primary/10 hover:text-primary"
              )}
              onClick={closeMenu}
            >
              {lang === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <Button
              variant="ghost"
              className={cn(
                "flex w-full justify-between items-center py-3 px-4 rounded-lg text-lg font-bold transition-all duration-200",
                pathname.startsWith("/products") ? "bg-primary/10 text-primary shadow" : "text-gray-800 hover:bg-primary/10 hover:text-primary"
              )}
              onClick={() => setShowCategories(true)}
            >
              {lang === "ar" ? "المنتجات" : "Products"}
              <ChevronDown className="h-5 w-5 ml-2" />
            </Button>
            <Link
              href={{ pathname: "/gallery", query: lang === "ar" ? { lang } : undefined }}
              className={cn(
                "block py-3 px-4 rounded-lg text-lg font-bold transition-all duration-200",
                pathname.startsWith("/gallery") ? "bg-primary/10 text-primary shadow" : "text-gray-800 hover:bg-primary/10 hover:text-primary"
              )}
              onClick={closeMenu}
            >
              {lang === "ar" ? "المعرض" : "Gallery"}
            </Link>
            <Link
              href={{ pathname: "/contact", query: lang === "ar" ? { lang } : undefined }}
              className={cn(
                "block py-3 px-4 rounded-lg text-lg font-bold transition-all duration-200",
                isActive("/contact") ? "bg-primary/10 text-primary shadow" : "text-gray-800 hover:bg-primary/10 hover:text-primary"
              )}
              onClick={closeMenu}
            >
              {lang === "ar" ? "تواصل معنا" : "Contact Us"}
            </Link>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              className="flex items-center gap-2 mb-2 px-2 py-1 text-base"
              onClick={() => setShowCategories(false)}
            >
              <ChevronDown className="h-5 w-5 rotate-90" />
              {lang === "ar" ? "القائمة الرئيسية" : "Main Menu"}
            </Button>
            <div className="flex flex-col gap-2 mt-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products/${category.slug}?lang=${lang}`}
                  className={cn(
                    "block py-2 px-4 rounded-md text-base font-semibold transition-all duration-200",
                    pathname === `/products/${category.slug}` ? "bg-primary/10 text-primary" : "text-gray-800 hover:bg-primary/10 hover:text-primary"
                  )}
                  onClick={closeMenu}
                >
                  {typeof category.name === 'string' ? category.name : (category.name?.[lang] || category.name?.en || "")}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
