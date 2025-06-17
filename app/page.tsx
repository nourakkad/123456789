import HomepageSections from "@/components/HomepageSections"
import Image from "next/image"

async function getHomepageSettings() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_SITE_URL
      ? process.env.NEXT_PUBLIC_SITE_URL
      : "https://your-site-name.netlify.app"; // Replace with your actual Netlify site URL
  const res = await fetch(`${baseUrl}/api/admin/homepage-settings`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export default async function Home({ searchParams }: { searchParams?: { lang?: string } }) {
  const homepageSettings = await getHomepageSettings()
  const lang = searchParams?.lang === "ar" ? "ar" : "en"
  const values = (homepageSettings?.ourValue?.[lang] || "").split(/\r?\n/).filter(Boolean)
  const whyChooseUs = (homepageSettings?.whyChooseUs?.[lang] || "").split(/\r?\n/).filter(Boolean)
  const vision = homepageSettings?.ourVision?.[lang] || "Our Vision"
  const mission = homepageSettings?.ourMissions?.[lang] || "Our Mission"

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"}>
      <HomepageSections
        homepageSettings={homepageSettings}
        lang={lang}
        values={values}
        whyChooseUs={whyChooseUs}
        vision={vision}
        mission={mission}
      />
    </div>
  )
}
