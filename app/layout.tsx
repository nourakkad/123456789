import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { getSettings } from "@/lib/mongodb"
import { getCategories } from "@/lib/data"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TIMBEX",
  description: "Your company description",
  generator: 'v0.dev',
  icons: {
    icon: '/timbex.ico',
    shortcut: '/timbex.ico',
    
  },
}

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getSettings();
  const categories = await getCategories();
  // Fetch homepageSettings for ourStory
  let homepageSettings = {};
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL
        ? process.env.NEXT_PUBLIC_SITE_URL
        : "https://your-site-name.netlify.app"; // Replace with your actual Netlify site URL
    const res = await fetch(`${baseUrl}/api/admin/homepage-settings`, { cache: 'no-store' });
    if (res.ok) homepageSettings = await res.json();
  } catch {}
  const siteName = settings?.siteName || { en: "Company Name", ar: "اسم الشركة" };
  const siteDescription = settings?.siteDescription || { en: "Your company description", ar: "وصف الشركة" };
  const lang = (typeof settings?.siteName === 'object' && typeof settings?.siteDescription === 'object' && typeof settings?.address === 'object' && typeof settings?.contactPhone === 'object') ? (typeof window !== 'undefined' && window.location.search.includes('lang=ar') ? 'ar' : 'en') : 'en';
  const address = settings?.address?.[lang] || settings?.address?.en || "123 Business Street, City, State 12345";
  const contactPhone = settings?.contactPhone?.[lang] || settings?.contactPhone?.en || "+1 (123) 456-7890";

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col bg-gradient-to-br from-primary/30 via-white to-primary/20">
            <Header siteName={siteName} siteDescription={siteDescription} categories={categories} />
            <main className="flex-1">{children}</main>
            <Footer 
              siteName={siteName}
              address={address}
              contactEmail={settings?.contactEmail || "info@company.com"}
              contactPhone={contactPhone}
              ourStory={homepageSettings && 'ourStory' in homepageSettings ? (homepageSettings.ourStory as { en: string; ar: string }) : { en: '', ar: '' }}
              lang={lang}
            />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
