"use client"
import React, { createContext, useContext, useState, useEffect } from "react"

export type Language = "en" | "ar"

interface LanguageContextProps {
  lang: Language
  setLang: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Language>("en")

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("lang") : null
    if (stored === "en" || stored === "ar") setLangState(stored)
  }, [])

  const setLang = (l: Language) => {
    setLangState(l)
    if (typeof window !== "undefined") localStorage.setItem("lang", l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider")
  return ctx
} 