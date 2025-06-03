"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FooterOurStory({ ourStory, initialLang }: { ourStory: { en: string; ar: string }, initialLang: "en" | "ar" }) {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<"en" | "ar">(initialLang);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const urlLang = searchParams.get("lang");
    if (urlLang === "ar" || urlLang === "en") setLang(urlLang);
  }, [searchParams]);

  const displayLang = mounted ? lang : initialLang;

  if (!mounted) return null;

  return (
    <div className="flex flex-col md:flex-row items-center bg-gradient-to-br from-green-800 to-white rounded-2xl shadow-lg p-4 md:p-8 gap-4 md:gap-8 animate-fade-in">
      <div className="flex-1 w-full">
        <h3 className="text-lg font-bold text-white mb-4 text-center">{displayLang === "ar" ? "قصتنا" : "Our Story"}</h3>
        <p className={`text-black whitespace-pre-line ${displayLang === 'ar' ? 'text-right' : 'text-left'}`}>{ourStory?.[displayLang] || ""}</p>
      </div>
    </div>
  );
} 