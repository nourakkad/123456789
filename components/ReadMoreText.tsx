"use client"
import { useState } from "react"

export default function ReadMoreText({ text, maxLines = 3, lang = 'en' }: { text: string, maxLines?: number, lang?: 'en' | 'ar' }) {
  const [isExpanded, setIsExpanded] = useState(false)
  if (!text) return null
  // Always show full text if expanded, otherwise clamp
  return (
    <div>
      <p
        className={`text-black whitespace-pre-line ${!isExpanded ? `line-clamp-${maxLines}` : ""}`}
        style={!isExpanded ? { display: '-webkit-box', WebkitLineClamp: maxLines, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}}
      >
        {text}
      </p>
      {/* Only show button if text is actually clamped */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-primary hover:text-green-800 font-medium mt-2 transition-colors"
      >
        {isExpanded ? lang === 'ar' ? 'عرض أقل' : 'Show Less' : lang === 'ar' ? 'اقرأ المزيد' : 'Read More'}
      </button>
    </div>
  )
} 