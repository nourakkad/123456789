"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Mail, Phone, Clock, MapPin, Sparkles } from "lucide-react"

export default function ContactFormClient({ settings, homepageSettings }: { settings: any, homepageSettings?: any }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") === "ar" ? "ar" : "en"
  const [countryCode, setCountryCode] = useState("+963")
  const [numberHint, setNumberHint] = useState("9xxxxxxxx")
  const [numberPattern, setNumberPattern] = useState("[0-9]{9}")
  const [numberMaxLength, setNumberMaxLength] = useState(9)

  // List of all countries with codes
  const countryOptions = [
    { code: "+93", name: "Afghanistan" },
    { code: "+355", name: "Albania" },
    { code: "+213", name: "Algeria" },
    { code: "+1", name: "United States" },
    { code: "+376", name: "Andorra" },
    { code: "+244", name: "Angola" },
    { code: "+1", name: "Anguilla" },
    { code: "+672", name: "Antarctica" },
    { code: "+1", name: "Antigua and Barbuda" },
    { code: "+54", name: "Argentina" },
    { code: "+374", name: "Armenia" },
    { code: "+297", name: "Aruba" },
    { code: "+61", name: "Australia" },
    { code: "+43", name: "Austria" },
    { code: "+994", name: "Azerbaijan" },
    { code: "+973", name: "Bahrain" },
    { code: "+880", name: "Bangladesh" },
    { code: "+1", name: "Barbados" },
    { code: "+375", name: "Belarus" },
    { code: "+32", name: "Belgium" },
    { code: "+501", name: "Belize" },
    { code: "+229", name: "Benin" },
    { code: "+1", name: "Bermuda" },
    { code: "+975", name: "Bhutan" },
    { code: "+591", name: "Bolivia" },
    { code: "+387", name: "Bosnia and Herzegovina" },
    { code: "+267", name: "Botswana" },
    { code: "+55", name: "Brazil" },
    { code: "+246", name: "British Indian Ocean Territory" },
    { code: "+673", name: "Brunei Darussalam" },
    { code: "+359", name: "Bulgaria" },
    { code: "+226", name: "Burkina Faso" },
    { code: "+257", name: "Burundi" },
    { code: "+855", name: "Cambodia" },
    { code: "+237", name: "Cameroon" },
    { code: "+1", name: "Canada" },
    { code: "+238", name: "Cape Verde" },
    { code: "+236", name: "Central African Republic" },
    { code: "+235", name: "Chad" },
    { code: "+56", name: "Chile" },
    { code: "+86", name: "China" },
    { code: "+61", name: "Christmas Island" },
    { code: "+61", name: "Cocos (Keeling) Islands" },
    { code: "+57", name: "Colombia" },
    { code: "+269", name: "Comoros" },
    { code: "+242", name: "Congo" },
    { code: "+243", name: "Congo, The Democratic Republic of the" },
    { code: "+682", name: "Cook Islands" },
    { code: "+506", name: "Costa Rica" },
    { code: "+225", name: "Côte d'Ivoire" },
    { code: "+385", name: "Croatia" },
    { code: "+53", name: "Cuba" },
    { code: "+357", name: "Cyprus" },
    { code: "+420", name: "Czech Republic" },
    { code: "+45", name: "Denmark" },
    { code: "+253", name: "Djibouti" },
    { code: "+1", name: "Dominica" },
    { code: "+1", name: "Dominican Republic" },
    { code: "+593", name: "Ecuador" },
    { code: "+20", name: "Egypt" },
    { code: "+503", name: "El Salvador" },
    { code: "+240", name: "Equatorial Guinea" },
    { code: "+291", name: "Eritrea" },
    { code: "+372", name: "Estonia" },
    { code: "+251", name: "Ethiopia" },
    { code: "+500", name: "Falkland Islands (Malvinas)" },
    { code: "+298", name: "Faroe Islands" },
    { code: "+679", name: "Fiji" },
    { code: "+358", name: "Finland" },
    { code: "+33", name: "France" },
    { code: "+594", name: "French Guiana" },
    { code: "+689", name: "French Polynesia" },
    { code: "+241", name: "Gabon" },
    { code: "+220", name: "Gambia" },
    { code: "+995", name: "Georgia" },
    { code: "+49", name: "Germany" },
    { code: "+233", name: "Ghana" },
    { code: "+350", name: "Gibraltar" },
    { code: "+30", name: "Greece" },
    { code: "+299", name: "Greenland" },
    { code: "+1", name: "Grenada" },
    { code: "+590", name: "Guadeloupe" },
    { code: "+1", name: "Guam" },
    { code: "+502", name: "Guatemala" },
    { code: "+224", name: "Guinea" },
    { code: "+245", name: "Guinea-Bissau" },
    { code: "+592", name: "Guyana" },
    { code: "+509", name: "Haiti" },
    { code: "+504", name: "Honduras" },
    { code: "+852", name: "Hong Kong" },
    { code: "+36", name: "Hungary" },
    { code: "+354", name: "Iceland" },
    { code: "+91", name: "India" },
    { code: "+62", name: "Indonesia" },
    { code: "+98", name: "Iran, Islamic Republic of" },
    { code: "+964", name: "Iraq" },
    { code: "+353", name: "Ireland" },
    { code: "+972", name: "Israel" },
    { code: "+39", name: "Italy" },
    { code: "+1", name: "Jamaica" },
    { code: "+81", name: "Japan" },
    { code: "+962", name: "Jordan" },
    { code: "+7", name: "Kazakhstan" },
    { code: "+254", name: "Kenya" },
    { code: "+686", name: "Kiribati" },
    { code: "+965", name: "Kuwait" },
    { code: "+996", name: "Kyrgyzstan" },
    { code: "+856", name: "Lao People's Democratic Republic" },
    { code: "+371", name: "Latvia" },
    { code: "+961", name: "Lebanon" },
    { code: "+266", name: "Lesotho" },
    { code: "+231", name: "Liberia" },
    { code: "+218", name: "Libya" },
    { code: "+423", name: "Liechtenstein" },
    { code: "+370", name: "Lithuania" },
    { code: "+352", name: "Luxembourg" },
    { code: "+853", name: "Macao" },
    { code: "+389", name: "Macedonia, The Former Yugoslav Republic of" },
    { code: "+261", name: "Madagascar" },
    { code: "+265", name: "Malawi" },
    { code: "+60", name: "Malaysia" },
    { code: "+960", name: "Maldives" },
    { code: "+223", name: "Mali" },
    { code: "+356", name: "Malta" },
    { code: "+692", name: "Marshall Islands" },
    { code: "+596", name: "Martinique" },
    { code: "+222", name: "Mauritania" },
    { code: "+230", name: "Mauritius" },
    { code: "+262", name: "Mayotte" },
    { code: "+52", name: "Mexico" },
    { code: "+691", name: "Micronesia, Federated States of" },
    { code: "+373", name: "Moldova, Republic of" },
    { code: "+377", name: "Monaco" },
    { code: "+976", name: "Mongolia" },
    { code: "+382", name: "Montenegro" },
    { code: "+1", name: "Montserrat" },
    { code: "+212", name: "Morocco" },
    { code: "+258", name: "Mozambique" },
    { code: "+95", name: "Myanmar" },
    { code: "+264", name: "Namibia" },
    { code: "+674", name: "Nauru" },
    { code: "+977", name: "Nepal" },
    { code: "+31", name: "Netherlands" },
    { code: "+599", name: "Netherlands Antilles" },
    { code: "+687", name: "New Caledonia" },
    { code: "+64", name: "New Zealand" },
    { code: "+505", name: "Nicaragua" },
    { code: "+227", name: "Niger" },
    { code: "+234", name: "Nigeria" },
    { code: "+683", name: "Niue" },
    { code: "+672", name: "Norfolk Island" },
    { code: "+850", name: "Korea, Democratic People's Republic of" },
    { code: "+47", name: "Norway" },
    { code: "+968", name: "Oman" },
    { code: "+92", name: "Pakistan" },
    { code: "+680", name: "Palau" },
    { code: "+970", name: "Palestinian Territory, Occupied" },
    { code: "+507", name: "Panama" },
    { code: "+675", name: "Papua New Guinea" },
    { code: "+595", name: "Paraguay" },
    { code: "+51", name: "Peru" },
    { code: "+63", name: "Philippines" },
    { code: "+48", name: "Poland" },
    { code: "+351", name: "Portugal" },
    { code: "+1", name: "Puerto Rico" },
    { code: "+974", name: "Qatar" },
    { code: "+40", name: "Romania" },
    { code: "+7", name: "Russia" },
    { code: "+250", name: "Rwanda" },
    { code: "+590", name: "Saint Barthelemy" },
    { code: "+290", name: "Saint Helena" },
    { code: "+1", name: "Saint Kitts and Nevis" },
    { code: "+1", name: "Saint Lucia" },
    { code: "+590", name: "Saint Martin" },
    { code: "+508", name: "Saint Pierre and Miquelon" },
    { code: "+1", name: "Saint Vincent and the Grenadines" },
    { code: "+685", name: "Samoa" },
    { code: "+378", name: "San Marino" },
    { code: "+239", name: "Sao Tome and Principe" },
    { code: "+966", name: "Saudi Arabia" },
    { code: "+221", name: "Senegal" },
    { code: "+381", name: "Serbia" },
    { code: "+248", name: "Seychelles" },
    { code: "+232", name: "Sierra Leone" },
    { code: "+65", name: "Singapore" },
    { code: "+421", name: "Slovakia" },
    { code: "+386", name: "Slovenia" },
    { code: "+677", name: "Solomon Islands" },
    { code: "+252", name: "Somalia" },
    { code: "+27", name: "South Africa" },
    { code: "+211", name: "South Sudan" },
    { code: "+34", name: "Spain" },
    { code: "+94", name: "Sri Lanka" },
    { code: "+249", name: "Sudan" },
    { code: "+597", name: "Suriname" },
    { code: "+47", name: "Svalbard and Jan Mayen" },
    { code: "+268", name: "Swaziland" },
    { code: "+46", name: "Sweden" },
    { code: "+41", name: "Switzerland" },
    { code: "+963", name: "Syria" },
    { code: "+886", name: "Taiwan" },
    { code: "+992", name: "Tajikistan" },
    { code: "+255", name: "Tanzania" },
    { code: "+66", name: "Thailand" },
    { code: "+670", name: "Timor-Leste" },
    { code: "+228", name: "Togo" },
    { code: "+690", name: "Tokelau" },
    { code: "+676", name: "Tonga" },
    { code: "+1", name: "Trinidad and Tobago" },
    { code: "+216", name: "Tunisia" },
    { code: "+90", name: "Turkey" },
    { code: "+993", name: "Turkmenistan" },
    { code: "+1", name: "Turks and Caicos Islands" },
    { code: "+688", name: "Tuvalu" },
    { code: "+256", name: "Uganda" },
    { code: "+380", name: "Ukraine" },
    { code: "+971", name: "United Arab Emirates" },
    { code: "+44", name: "United Kingdom" },
    { code: "+1", name: "United States" },
    { code: "+598", name: "Uruguay" },
    { code: "+998", name: "Uzbekistan" },
    { code: "+678", name: "Vanuatu" },
    { code: "+58", name: "Venezuela" },
    { code: "+84", name: "Vietnam" },
    { code: "+1", name: "Virgin Islands, British" },
    { code: "+1", name: "Virgin Islands, U.S." },
    { code: "+681", name: "Wallis and Futuna" },
    { code: "+212", name: "Western Sahara" },
    { code: "+967", name: "Yemen" },
    { code: "+260", name: "Zambia" },
    { code: "+263", name: "Zimbabwe" },
  ].sort((a, b) => a.name.localeCompare(b.name));

  // Update hint and pattern when country changes
  useEffect(() => {
    switch (countryCode) {
      case "+963":
        setNumberHint("9 digits: 9xxxxxxxx")
        setNumberPattern("[0-9]{9}")
        setNumberMaxLength(9)
        break
      case "+20": // Egypt
        setNumberHint("10 or 11 digits")
        setNumberPattern("[0-9]{10,11}")
        setNumberMaxLength(11)
        break
      case "+966": // Saudi Arabia
        setNumberHint("9 digits: 5xxxxxxxx")
        setNumberPattern("[0-9]{9}")
        setNumberMaxLength(9)
        break
      case "+971": // UAE
        setNumberHint("9 digits")
        setNumberPattern("[0-9]{9}")
        setNumberMaxLength(9)
        break
      case "+962": // Jordan
        setNumberHint("9 digits")
        setNumberPattern("[0-9]{9}")
        setNumberMaxLength(9)
        break
      case "+961": // Lebanon
        setNumberHint("8 digits")
        setNumberPattern("[0-9]{8}")
        setNumberMaxLength(8)
        break
      case "+965": // Kuwait
        setNumberHint("8 digits")
        setNumberPattern("[0-9]{8}")
        setNumberMaxLength(8)
        break
      case "+964": // Iraq
        setNumberHint("10 digits")
        setNumberPattern("[0-9]{10}")
        setNumberMaxLength(10)
        break
      case "+1": // USA
        setNumberHint("10 digits")
        setNumberPattern("[0-9]{10}")
        setNumberMaxLength(10)
        break
      case "+44": // UK
        setNumberHint("10 digits")
        setNumberPattern("[0-9]{10}")
        setNumberMaxLength(10)
        break
      default:
        setNumberHint("")
        setNumberPattern("[0-9]*")
        setNumberMaxLength(20)
    }
  }, [countryCode])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const number = countryCode + formData.get("number") as string
    const message = formData.get("message") as string

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, number, message }),
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
      <div className="min-h-screen w-full relative flex flex-col justify-center items-center pt-5 pb-5">
       
        {/* Main Grid Layout */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-screen-xl mx-auto px-4 lg:px-8 ${lang === 'ar' ? 'dir-rtl' : 'dir-ltr'}`}>

          {/* LEFT COLUMN: Motivation Card above Form */}
          <div className="w-full flex flex-col justify-start flex-1 gap-6">
            {/* Motivation Card */}
            <div className={`bg-white/60 backdrop-blur-md border border-primary/20 rounded-xl shadow p-4 md:p-6 mb-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <span className="text-primary font-bold text-base md:text-lg whitespace-pre-line">
                {homepageSettings?.buildSomething?.[lang] || (lang === 'ar' ? 'لنصنع شيئًا يدوم' : "Let's build something that lasts")}
              </span>
            </div>
            {/* Message Form Card */}
            <form
              onSubmit={handleSubmit}
              className={`space-y-8 bg-white/60 backdrop-blur-md border border-primary/20 rounded-2xl shadow-xl p-8 md:p-12 w-full ${lang === 'ar' ? 'dir-rtl text-right' : 'dir-ltr text-left'}`}
            >
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-primary">
                  {lang === 'ar' ? 'الاسم' : 'Name'}
                </label>
                <Input id="name" name="name" required className="bg-white/80 text-black border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/40" />
              </div>
              <div className="space-y-2">
                <label htmlFor="number" className="text-sm font-medium text-primary">
                  {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={e => setCountryCode(e.target.value)}
                    className="bg-white/80 text-black border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/40 px-2 flex-shrink-0"
                    style={{ minWidth: 80, maxWidth: 110 }}
                  >
                    {countryOptions.map((opt, idx) => (
                      <option key={opt.code + '-' + opt.name + '-' + idx} value={opt.code}>
                        {opt.name} ({opt.code})
                      </option>
                    ))}
                  </select>
                  <Input
                    id="number"
                    name="number"
                    type="tel"
                    inputMode="numeric"
                    pattern={numberPattern}
                    maxLength={numberMaxLength}
                    required
                    className="bg-white/80 text-black border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/40 flex-grow"
                    placeholder={numberHint}
                  />
                </div>
              </div>
              {/* Email field removed */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-primary">
                  {lang === 'ar' ? 'الرسالة' : 'Message'}
                </label>
                <Textarea id="message" name="message" rows={5} required className="bg-white/80 text-black border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/40" />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition">
                {isSubmitting ? (lang === 'ar' ? 'جاري الإرسال...' : 'Sending...') : (lang === 'ar' ? 'إرسال الرسالة' : 'Send Message')}
              </Button>
            </form>
          </div>

          {/* RIGHT COLUMN: Location, Contact Info, Map */}
          <div className="space-y-6 w-full flex flex-col flex-1">
            {/* Our Location Card */}
            <div className="flex-1">
              <div className={`bg-white/60 backdrop-blur-md border border-primary/20 rounded-2xl shadow-xl p-6 md:p-8 w-full ${lang === 'ar' ? 'dir-rtl text-right' : 'dir-ltr text-left'}`}>
                <div className="flex items-center gap-2 mb-4">
                  
                  <div style={{ width: '100%' }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    <h2
                      className="text-xl font-semibold text-primary"
                      style={{ textAlign: lang === 'ar' ? 'right' : 'left', width: '100%' }}
                    >
                      {lang === 'ar' ? 'موقعنا' : 'Our Location'}
                    </h2>
                  </div>
                </div>
                <div className={`flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-black">
                    {settings?.address?.[lang] || '123 Business Street, City, State 12345'}
                  </span>
                </div>
                <div className={`flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-semibold whitespace-nowrap">
                    {lang === 'ar' ? ':ساعات العمل' : 'Hours:'}
                  </span>
                  <span>
                    {lang === 'ar' ? 'السبت - الخميس، 10 صباحًا - 6 مساءً' : 'Saturday - Thursday, 10am - 6pm'}
                  </span>
                </div>
              </div>
              
            </div>

            {/* Contact Info Card */}
            <div className={`bg-white/60 backdrop-blur-md border border-primary/20 rounded-2xl shadow-xl p-6 md:p-8 w-full ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center gap-2 mb-4">
                
                <div style={{ width: '100%' }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                  <h2
                    className="text-xl font-semibold text-primary"
                    style={{ textAlign: lang === 'ar' ? 'right' : 'left', width: '100%' }}
                  >
                    {lang === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
                  </h2>
                </div>
              </div>
              <div className="text-black space-y-4">
                {/* Email */}
                <div className={`flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Mail className="w-5 h-5 text-primary" />
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
                <div className={`flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Phone className="w-5 h-5 text-primary" />
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
      
              </div>
            </div>

            {/* Map Card */}
            <div className={`border border-primary/20 rounded-2xl overflow-hidden bg-white/60 backdrop-blur-md shadow-xl w-full h-64 relative ${lang === 'ar' ? 'dir-rtl text-right' : 'dir-ltr text-left'}`}>
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
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessModal} onOpenChange={(open) => {
        setShowSuccessModal(open);
        if (!open) setTimeout(() => window.location.reload(), 100);
      }}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle>{lang === 'ar' ? 'تم إرسال الرسالة!' : 'Message sent!'}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {lang === 'ar' ? 'شكرًا لتواصلك معنا. سنعاود التواصل معك في أقرب وقت ممكن.' : 'Thank you for contacting us. We will get back to you as soon as possible.'}
          </div>
          <DialogFooter>
            <button
              type="button"
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
              onClick={() => {
                setShowSuccessModal(false);
                setTimeout(() => window.location.reload(), 100);
              }}
            >
              {lang === 'ar' ? 'حسنًا' : 'OK'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
