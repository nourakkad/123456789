"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function FeatureCarousel({ images }: { images: { src: string; alt: string }[] }) {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [dragX, setDragX] = useState(0); // Track drag offset
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    // Check window width on mount and on resize
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const total = images.length;

  // Helper to get the indices of the images to show
  const getVisibleIndices = () => {
    if (isMobile) {
      if (total === 1) return [current];
      if (total === 2) return [current, (current + 1) % 2];
      const prevIdx = (current - 1 + total) % total;
      const nextIdx = (current + 1) % total;
      return [prevIdx, current, nextIdx];
    }
    if (total <= 3) {
      return [0, 1, 2].slice(0, total);
    }
    // Centered on current
    const prevIdx = (current - 1 + total) % total;
    const nextIdx = (current + 1) % total;
    return [prevIdx, current, nextIdx];
  };

  const prev = () => setCurrent((c) => (c === 0 ? total - 1 : c - 1));
  const next = () => setCurrent((c) => (c === total - 1 ? 0 : c + 1));

  // Touch event handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setIsDragging(true);
    touchStartX.current = e.touches[0].clientX;
    setDragX(0);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !isDragging || touchStartX.current === null) return;
    const delta = e.touches[0].clientX - touchStartX.current;
    setDragX(delta);
  };
  const onTouchEnd = () => {
    if (!isMobile || !isDragging) return;
    setIsDragging(false);
    if (Math.abs(dragX) > 60) {
      if (dragX < 0) {
        next(); // swipe left
      } else {
        prev(); // swipe right
      }
    }
    setDragX(0);
    touchStartX.current = null;
  };

  const visibleIndices = getVisibleIndices();

  // For mobile, show prev/current/next with wheel effect
  return (
    <div
      className="w-full flex items-center justify-center relative"
      onTouchStart={isMobile ? onTouchStart : undefined}
      onTouchMove={isMobile ? onTouchMove : undefined}
      onTouchEnd={isMobile ? onTouchEnd : undefined}
    >
      {/* Hide buttons on mobile */}
      {!isMobile && (
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-primary/20 z-10"
          aria-label="Previous"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
        </button>
      )}
      <div className="w-full flex justify-center gap-0 overflow-hidden" style={{ height: 250 }}>
        {isMobile ? (
          <div
            className="flex items-center justify-center w-full h-full relative"
            style={{ width: 350, height: 250 }}
          >
            {visibleIndices.map((idx, i) => {
              // -1: prev, 0: current, 1: next
              const pos = i - 1;
              // Set sizes for main and side images
              const mainWidth = 220, mainHeight = 270, sideWidth = 120, sideHeight = 170;
              const width = pos === 0 ? mainWidth : sideWidth;
              const height = pos === 0 ? mainHeight : sideHeight;
              // Move all images together with dragX
              const baseX = pos === 0 ? 0 : (pos * (mainWidth / 2 + sideWidth / 2 + 10));
              let scale = pos === 0 ? 1 : 0.7;
              let opacity = pos === 0 ? 1 : 0.5;
              // As you drag, interpolate scale/opacity for center
              let translateX = baseX + dragX;
              if (isDragging && Math.abs(dragX) < 150) {
                if (pos === 0) {
                  // Center image shrinks as it moves away
                  scale = 1 - 0.3 * Math.abs(dragX) / 150;
                  opacity = 1 - 0.5 * Math.abs(dragX) / 150;
                } else if ((pos === -1 && dragX > 0) || (pos === 1 && dragX < 0)) {
                  // Side image grows as it moves to center
                  scale = 0.7 + 0.3 * Math.abs(dragX) / 150;
                  opacity = 0.5 + 0.5 * Math.abs(dragX) / 150;
                }
              }
              return (
                <div
                  key={idx}
                  style={{
                    width,
                    height,
                    position: 'absolute',
                    left: '50%',
                    top: pos === 0 ? 0 : 40,
                    transform: `translateX(${translateX - width / 2}px) scale(${scale})`,
                    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s',
                    opacity,
                    zIndex: pos === 0 ? 2 : 1,
                    boxShadow: pos === 0 ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                    borderRadius: 8,
                    overflow: 'hidden',
                    background: '#fff',
                  }}
                >
                  <Image
                    src={images[idx].src}
                    alt={images[idx].alt}
                    fill
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          visibleIndices.map((idx) => (
            <div key={idx} style={{ width: 350, height: 250, position: 'relative' }}>
              <Image
                src={images[idx].src}
                alt={images[idx].alt}
                fill
                style={{ objectFit: 'cover', borderRadius: 0 }}
                className="shadow"
              />
            </div>
          ))
        )}
      </div>
      {/* Hide buttons on mobile */}
      {!isMobile && (
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-primary/20 z-10"
          aria-label="Next"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      )}
    </div>
  );
} 