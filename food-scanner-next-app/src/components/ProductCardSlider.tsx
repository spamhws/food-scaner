"use client";

import { useRef, useEffect } from "react";
import { ProductCard } from "./ProductCard";

interface ProductCardSliderProps {
  barcodes: string[];
  height: number;
}

export function ProductCardSlider({
  barcodes,
  height,
}: ProductCardSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest card when barcodes array changes
  useEffect(() => {
    if (barcodes.length > 0 && scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.clientWidth;
      const scrollPosition = (barcodes.length - 1) * (cardWidth + 24); // 24px gap
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [barcodes.length]);

  return (
    <div
      ref={scrollContainerRef}
      className="scrollbar-hide z-30 -mr-6 -ml-6 flex h-full px-6 w-[calc(100%+48px)] snap-x snap-mandatory gap-6 overflow-x-scroll"
      style={{ height: `${height}px` }}
    >
      {barcodes.map((barcode) => (
        <ProductCard barcode={barcode} className="snap-center" key={barcode} />
      ))}
      {barcodes.length === 0 && (
        <div className="flex w-full flex-shrink-0 snap-center items-center justify-center">
          <p className="text-sm text-white/50">
            Scan a barcode to see product info
          </p>
        </div>
      )}
    </div>
  );
}
