"use client"
import { usePathname, useSearchParams } from "next/navigation"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

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
    <Button variant="ghost" size="icon" asChild>
      <a
        href={href}
        aria-label="Switch language"
        className="relative"
      >
        <Globe className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        <span className="sr-only">{lang === "en" ? "العربية" : "English"}</span>
      </a>
    </Button>
  );
} 