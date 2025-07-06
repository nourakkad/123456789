'use client';
import Image from "next/image";

export default function ContactCardShady() {
  return (
    <div className="flex flex-col items-center justify-center py-12 ">
      <div className="w-full max-w-xs md:max-w-sm aspect-square mx-auto flex items-center justify-center">
        <div className="w-full h-full bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl flex flex-col items-center justify-between p-6">
          {/* Avatar inside the card */}
          <div className="flex flex-col items-center w-full">
            <Image
              src="/profile-shady.jpg"
              alt="Eng. Shady Samman"
              width={90}
              height={90}
              className="rounded-full border-4 border-green-400 shadow-md mb-2"
            />
            <h2 className="text-xl font-extrabold text-green-900 mt-1">Eng. Shady Samman</h2>
            <p className="text-sm text-green-800 font-semibold mb-1">CEO & Co-Founder</p>
            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-2">Indoor Flooring & Outdoor Decking Company</span>
          </div>

          <p className="italic text-black-900/80 mb-2 text-center text-xs">“Turning your spaces into masterpieces, one floor at a time.”</p>

          {/* Quick Actions */}
          <div className="flex gap-3 justify-center mb-2">
            <a href="tel:+963967777505" className="group bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.516 2.064a2 2 0 01-.45 1.958l-1.27 1.27a16.001 16.001 0 006.586 6.586l1.27-1.27a2 2 0 011.958-.45l2.064.516A2 2 0 0121 18.72V21a2 2 0 01-2 2h-1C9.163 23 1 14.837 1 5V4a2 2 0 012-2z" />
              </svg>
            </a>
            <a href="mailto:shady.samman@timbex-sy.com" className="group bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 6l-10 7L2 6" />
             </svg>
            </a>
            <a href="https://wa.me/963967777505" target="_blank" rel="noopener noreferrer" className="group bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.52 3.48A11.77 11.77 0 0012.02 0C5.61 0 .25 5.35.25 11.74c0 2.07.55 4.1 1.6 5.9L0 24l6.52-1.7a11.68 11.68 0 005.49 1.4h.01c6.41 0 11.77-5.36 11.77-11.75 0-3.15-1.22-6.11-3.47-8.47zm-8.5 18.2c-1.7 0-3.39-.46-4.86-1.33l-.35-.2-3.87 1.01 1.03-3.77-.23-.39a9.72 9.72 0 01-1.46-5.1c0-5.4 4.4-9.8 9.81-9.8a9.72 9.72 0 016.94 2.87 9.63 9.63 0 012.87 6.93c0 5.4-4.4 9.8-9.8 9.8zm5.45-7.42c-.3-.15-1.76-.87-2.03-.96-.27-.1-.47-.15-.66.15-.19.3-.76.95-.93 1.14-.17.2-.34.22-.64.07a7.88 7.88 0 01-2.3-1.42 8.62 8.62 0 01-1.6-2.03c-.17-.3-.02-.47.13-.62.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.19.05-.37-.02-.52-.08-.15-.66-1.6-.91-2.18-.24-.57-.48-.49-.66-.5h-.57c-.2 0-.52.07-.79.35-.27.3-1.03 1-1.03 2.43s1.05 2.82 1.2 3.01c.15.19 2.06 3.16 5 4.43.7.3 1.24.48 1.67.61.7.22 1.34.19 1.84.11.56-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.18-1.42-.07-.13-.27-.2-.57-.34z"/>
  </svg>
</a>

          </div>

          {/* Contact Info List */}
          <div className="w-full bg-white/90 rounded-2xl shadow-inner p-3 space-y-2 mt-2">
            <div className="flex items-center gap-2">
              <span className="bg-green-100 p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.516 2.064a2 2 0 01-.45 1.958l-1.27 1.27a16.001 16.001 0 006.586 6.586l1.27-1.27a2 2 0 011.958-.45l2.064.516A2 2 0 0121 18.72V21a2 2 0 01-2 2h-1C9.163 23 1 14.837 1 5V4a2 2 0 012-2z" />
                </svg>
              </span>
              <span className="font-medium text-green-900 text-xs">+963 967777505</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-green-100 p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.516 2.064a2 2 0 01-.45 1.958l-1.27 1.27a16.001 16.001 0 006.586 6.586l1.27-1.27a2 2 0 011.958-.45l2.064.516A2 2 0 0121 18.72V21a2 2 0 01-2 2h-1C9.163 23 1 14.837 1 5V4a2 2 0 012-2z" />
                </svg>
              </span>
              <span className="font-medium text-green-900 text-xs">+963 968484808</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-green-100 p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h1a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7a2 2 0 012-2zm0 0V7a4 4 0 014-4h6a4 4 0 014 4v3" />
                </svg>
              </span>
              <span className="font-medium text-green-900 text-xs">+963 11 4419591</span>
            </div>
            <div className="flex items-center gap-2">
  <span className="bg-green-100 p-1 rounded-full">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 6l-10 7L2 6" />
    </svg>
  </span>
  <a href="mailto:shady.samman@timbex-sy.com" className="font-medium text-green-900 text-xs underline">
    shady.samman@timbex-sy.com
  </a>
</div>

            <div className="flex items-center gap-2">
              <span className="bg-green-100 p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 7v7m0 0h7m-7 0H5" />
                </svg>
              </span>
              <a href="https://timbex-sy.com" target="_blank" rel="noopener noreferrer" className="font-medium text-green-900 text-xs underline">
                timbex-sy.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-green-100 p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="font-medium text-green-900 text-xs">CEO & Co-Founder</span>
            </div>
          </div>

          <div className="mt-2 text-center text-black-900/80 text-xs font-semibold tracking-wide animate-pulse">
            <span>Let's build something amazing together! 🚀</span>
            
          </div>
          <a
  href="/shady-samman.vcf"
  download
  className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-full shadow transition"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4m-6 4h8" />
  </svg>
  Add Contact
</a>
        </div>
      </div>
    </div>
  );
}
