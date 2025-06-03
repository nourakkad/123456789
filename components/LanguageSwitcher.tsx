"use client"
import { usePathname, useSearchParams } from "next/navigation"
import { Globe } from "lucide-react"

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") === "ar" ? "ar" : "en";

  let href = pathname;
  if (lang === "en") {
    // Switch to Arabic
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("lang", "ar");
    href = `${pathname}?${params.toString()}`;
  } else {
    // Switch to English (remove lang param)
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete("lang");
    href = params.toString() ? `${pathname}?${params.toString()}` : pathname;
  }

  return (
    <a
      href={href}
      aria-label="Switch language"
      className="group flex items-center gap-2 px-3 py-2 rounded-full bg-white shadow hover:bg-black transition-colors border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <Globe className="h-5 w-5 text-black group-hover:text-white transition-colors" />
      <span className="hidden sm:inline text-black group-hover:text-white text-sm font-medium transition-colors">
        {lang === "en" ? "العربية" : "English"}
      </span>
    </a>
  );
} 