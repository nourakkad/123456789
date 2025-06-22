import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { getSettings, getHomepageSettings } from "@/lib/data"
import { getCategories } from "@/lib/data"
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from "next/navigation"

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
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()
  const homepageSettings = await getHomepageSettings()
  const categories = await getCategories()

  // Ensure we have default values for required fields
  const siteName = settings?.siteName || { en: "Company Name", ar: "اسم الشركة" }
  const siteDescription = settings?.siteDescription || { en: "Your company description", ar: "وصف الشركة" }
  const address = settings?.address || { en: "123 Business Street", ar: "شارع الأعمال 123" }
  const contactEmail = settings?.contactEmail || "info@company.com"
  const contactPhone = settings?.contactPhone || { en: "+1 (123) 456-7890", ar: "+1 (123) 456-7890" }
  const ourStory = homepageSettings?.ourStory || { en: "", ar: "" }
  const logo = settings?.logo || ""

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} force-light-mode`} style={{ position: 'relative' }}>
        {/* Gradient Light Sphere Background */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 0,
            background: 'radial-gradient(ellipse at top right, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.47) 60%, rgba(255, 255, 255, 0.28) 100%)',
            filter: 'blur(24px)',
            mixBlendMode: 'lighten',
          }}
        />
        {/* End Gradient Light Sphere */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Conditionally render Header */}
            {pathname !== "/contact-card-shady" && (
              <Header 
                siteName={siteName} 
                siteDescription={siteDescription} 
                categories={categories}
                logo={logo}
              />
            )}
            <main className="min-h-screen pt-16">
              {children}
            </main>
            <Footer 
              siteName={siteName}
              address={address}
              contactEmail={contactEmail}
              contactPhone={contactPhone}
              ourStory={ourStory}
              lang="en"
            />
            <Toaster />
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}
