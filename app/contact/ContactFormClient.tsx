"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function ContactFormClient({ settings }: { settings: any }) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") === "ar" ? "ar" : "en"

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to send")
      setShowSuccessModal(true)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <h1 className={`text-3xl font-bold mb-8 text-primary w-full px-4 md:px-12 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
        {lang === 'ar' ? 'اتصل بنا' : 'Contact Us'}
      </h1>

      {/* Main Grid Layout */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-screen-xl mx-auto px-4 lg:px-8 ${lang === 'ar' ? 'dir-rtl' : 'dir-ltr'}`}>

        {/* LEFT SIDE - FORM */}
        <div className="w-full flex flex-col justify-start flex-1">
          <form
            onSubmit={handleSubmit}
            className={`space-y-8 bg-white border border-primary rounded-xl shadow p-8 md:p-12 w-full ${lang === 'ar' ? 'dir-rtl text-right' : 'dir-ltr text-left'}`}
          >
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-primary">
                {lang === 'ar' ? 'الاسم' : 'Name'}
              </label>
              <Input id="name" name="name" required className="bg-white text-black border border-primary" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-primary">
                {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <Input id="email" name="email" type="email" required className="bg-white text-black border border-primary" />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-primary">
                {lang === 'ar' ? 'الرسالة' : 'Message'}
              </label>
              <Textarea id="message" name="message" rows={5} required className="bg-white text-black border border-primary" />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (lang === 'ar' ? 'جاري الإرسال...' : 'Sending...') : (lang === 'ar' ? 'إرسال الرسالة' : 'Send Message')}
            </Button>
          </form>
        </div>

        {/* RIGHT SIDE - INFO + MAP */}
        <div className="space-y-6 w-full flex flex-col flex-1">

          {/* Our Location Card */}
          <div className={`bg-white border border-primary rounded-xl shadow p-6 md:p-8 w-full ${lang === 'ar' ? 'dir-rtl text-right' : 'dir-ltr text-left'}`}>
            <h2 className="text-xl font-semibold mb-4 text-primary">{lang === 'ar' ? 'موقعنا' : 'Our Location'}</h2>
            <p className="text-black">
              {settings?.address?.[lang] || '123 Business Street, City, State 12345'}
            </p>
          </div>

          {/* Contact Info Card */}
<div className={`bg-white border border-primary rounded-xl shadow p-6 md:p-8 w-full ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
  <h2 className="text-xl font-semibold mb-4 text-primary">
    {lang === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
  </h2>
  <div className="text-black space-y-4">
    
    {/* Email */}
    <div className={`flex items-start gap-2 ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
      <span className="font-semibold whitespace-nowrap">
        {lang === 'ar' ? ':البريد الإلكتروني' : 'Email:'}
      </span>
      <a
        href={`mailto:${settings?.contactEmail || 'info@company.com'}`}
        className="font-mono underline break-all text-primary text-left"
        dir="ltr"
      >
        {settings?.contactEmail || 'info@company.com'}
      </a>
    </div>

    {/* Phone */}
    <div className={`flex items-start gap-2 ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
      <span className="font-semibold whitespace-nowrap">
        {lang === 'ar' ? ':الهاتف' : 'Phone:'}
      </span>
      <a
        href={`tel:${settings?.contactPhone?.[lang] || '+1 (123) 456-7890'}`}
        className="font-mono text-primary text-left"
        dir="ltr"
      >
        {settings?.contactPhone?.[lang] || '+1 (123) 456-7890'}
      </a>
    </div>

    {/* Hours */}
    <div className={`flex items-start gap-2 ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
      <span className="font-semibold whitespace-nowrap">
        {lang === 'ar' ? ':ساعات العمل' : 'Hours:'}
      </span>
      <span>
        {lang === 'ar' ? 'السبت - الخميس، 9 صباحًا - 5 مساءً' : 'Saturday - Thursday, 9am - 5pm'}
      </span>
    </div>
  </div>
</div>

          {/* Map Card */}
          <div className={`border border-primary rounded-lg overflow-hidden bg-white w-full h-64 relative ${lang === 'ar' ? 'dir-rtl text-right' : 'dir-ltr text-left'}`}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3329.019282651505!2d36.312139!3d33.519806!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2zMzPCsDMxJzExLjMiTiAzNsKwMTgnNDMuNyJF!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s"
              style={{ border: 0, width: '100%', height: '100%' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={lang === 'ar' ? 'خريطة الموقع' : 'Location Map'}
              className="w-full h-full rounded"
            ></iframe>
          </div>

          <div className="mb-8" />
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle>{lang === 'ar' ? 'تم إرسال الرسالة!' : 'Message sent!'}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {lang === 'ar' ? 'شكرًا لتواصلك معنا. سنعاود التواصل معك في أقرب وقت ممكن.' : 'Thank you for contacting us. We will get back to you as soon as possible.'}
          </div>
          <DialogFooter>
            <button
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
              onClick={() => window.location.reload()}
            >
              {lang === 'ar' ? 'حسنًا' : 'OK'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
