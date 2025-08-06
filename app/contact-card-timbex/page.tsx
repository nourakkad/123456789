'use client';
import Image from "next/image";

export default function ContactCardShady() {
  return (
    <div className="flex flex-col items-center justify-center py-12 ">
      <div className="w-full max-w-xs md:max-w-sm aspect-square mx-auto flex items-center justify-center">
        <div className="w-full h-full bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl flex flex-col items-center justify-between p-6">
          {/* Avatar inside the card */}
          <div className="flex flex-col items-center w-full">
           
            <h2 className="text-xl font-extrabold text-green-900 mt-1">TIMBEX</h2>
            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-2">Indoor Flooring & Outdoor Decking Company</span>
          </div>

          <p className="italic text-black-900/80 mb-2 text-center text-xs">“Turning your spaces into masterpieces, one floor at a time.”</p>

          {/* Quick Actions */}
          <div className="flex gap-3 justify-center mb-2">
            <a href="tel:+963968484801" className="group bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.516 2.064a2 2 0 01-.45 1.958l-1.27 1.27a16.001 16.001 0 006.586 6.586l1.27-1.27a2 2 0 011.958-.45l2.064.516A2 2 0 0121 18.72V21a2 2 0 01-2 2h-1C9.163 23 1 14.837 1 5V4a2 2 0 012-2z" />
              </svg>
            </a>
            <a href="mailto:info@timbex-sy.com" className="group bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 6l-10 7L2 6" />
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
              <span className="font-medium text-green-900 text-xs">+963 968484801</span>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <span className="font-medium text-green-900 text-xs">DAMASCUS.SYRIA</span>
            </div>
            <div className="flex items-center gap-2">
  <span className="bg-green-100 p-1 rounded-full">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 6l-10 7L2 6" />
    </svg>
  </span>
  <a href="mailto:info@timbex-sy.com" className="font-medium text-green-900 text-xs underline">
    info@timbex-sy.com
  </a>
</div>

           
            
          </div>

          <div className="mt-2 text-center text-black-900/80 text-xs font-semibold tracking-wide animate-pulse">
            <span>Let's build something amazing together! 🚀</span>
            
          </div>
          <a
  href="/timbex.vcf"
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
