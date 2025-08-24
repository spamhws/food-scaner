'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { BarcodeDetector } from 'barcode-detector/ponyfill';
import { Navigation } from './Navigation';
import { ScannerControl } from './ScannerControl';
import { CornerDecorations } from './ui/CornerDecorations';
import { generateMaskSVG } from '@/lib/utils/videoMaskSVG';
import { ProductResult } from './ProductResult';

export function BarcodeScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [searchBarcode, setSearchBarcode] = useState<string | null>(null);
  const scannerRef = useRef<BarcodeDetector | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const streamRef = useRef<MediaStream | null>(null);
  const controlHeight = 64;
  const resultCardHeight = 120;

  // Window geometry - responsive to viewport
  const getScanCardDimensions = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const windowWidth = viewportWidth - 48;

    // Add some padding above and below the controls
    const windowHeight = Math.min((windowWidth / 4) * 3, viewportHeight - controlHeight - resultCardHeight - 64 - 48);

    // Corner radius should be circular and match corner decorations (24px)
    const cornerRadius = 16;

    return { w: windowWidth, h: windowHeight, r: cornerRadius };
  };

  const [scanCardDimensions, setScanCardDimensions] = useState<{ w: number; h: number; r: number } | null>(null);

  useEffect(() => {
    // Only calculate dimensions after component mounts on client
    setScanCardDimensions(getScanCardDimensions());

    const handleResize = () => {
      setScanCardDimensions(getScanCardDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scanForBarcodes = useCallback(async () => {
    if (!videoRef.current || !scannerRef.current || !isScanning) return;

    try {
      const barcodes = await scannerRef.current.detect(videoRef.current);

      if (barcodes.length > 0) {
        setSearchBarcode(barcodes[0].rawValue);
        // Removed return to allow continuous scanning
      }
    } catch {
      // Silently handle scanning errors
    }

    if (isScanning) {
      animationFrameRef.current = requestAnimationFrame(scanForBarcodes);
    }
  }, [isScanning]);

  useEffect(() => {
    if (isScanning) {
      scanForBarcodes();
    }
  }, [isScanning, scanForBarcodes]);

  useEffect(() => {
    const initializeScanner = async () => {
      const { prepareZXingModule } = await import('barcode-detector/ponyfill');
      await prepareZXingModule({
        overrides: {
          locateFile: (path) => {
            if (path.endsWith('.wasm')) {
              return `/zxing/${path}`;
            }
            return path;
          },
        },
      });

      scannerRef.current = new BarcodeDetector({
        formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'code_93', 'databar', 'databar_expanded'],
      });

      startScanning();
    };

    initializeScanner();

    return () => {
      // Clean up video stream on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920, max: 3840 },
          height: { ideal: 1080, max: 2160 },
          aspectRatio: { ideal: 16 / 9 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Add error handling for play() promise
        try {
          await videoRef.current.play();
          setIsScanning(true);
        } catch (playError) {
          if (playError instanceof Error && playError.name === 'AbortError') {
            console.log('Video play was interrupted, cleaning up...');
            // Clean up the stream if play was interrupted
            stream.getTracks().forEach((track) => track.stop());
            return;
          }
          throw playError;
        }
      }
    } catch {
      console.error('Camera access error');
    }
  };

  const toggleFlash = async () => {
    if (!streamRef.current) return;

    const track = streamRef.current.getVideoTracks()[0];

    try {
      await track.applyConstraints({
        // @ts-expect-error - torch is a non-standard feature supported on mobile devices
        advanced: [{ torch: !isFlashOn }],
      });
      setIsFlashOn(!isFlashOn);
    } catch {
      console.error('Flash error');
    }
  };

  // Generate SVG mask for the scanning window

  return (
    <div className='relative w-full h-full bg-black overflow-hidden flex flex-col'>
      {/* Single video element */}
      <video ref={videoRef} className='absolute inset-0 w-full h-full object-cover' playsInline muted autoPlay />

      {/* Blur/dim overlay with hard-edged rounded-rect hole using SVG mask */}
      <div
        className='pointer-events-none absolute inset-0'
        style={{
          backdropFilter: 'blur(14px) brightness(0.5)',
          WebkitBackdropFilter: 'blur(14px) brightness(0.5)',
          maskImage: `url("${generateMaskSVG(scanCardDimensions, controlHeight, resultCardHeight)}")`,
          WebkitMaskImage: `url("${generateMaskSVG(scanCardDimensions, controlHeight, resultCardHeight)}")`,
        }}
      />

      {/* Scanner Interface */}
      {scanCardDimensions && (
        <div className='relative w-full flex-1 p-6 border border-green-60 z-30 flex flex-col items-center justify-center gap-8'>
          <div className='w-full p-2.5 relative h-full z-30 flex border border-red-60 flex-col items-center justify-center' style={{ height: `${Math.round(scanCardDimensions.h)}px` }}>
            {/* Corner decorations positioned at screen edges */}
            <CornerDecorations />
            <div className='flex-1 flex items-center justify-center w-full'>
              <ScannerControl onKeyboardClick={() => {}} onFlashClick={toggleFlash} controlHeight={controlHeight} />
            </div>
          </div>

          {/* Navigation */}
          <Navigation navigationHeight={controlHeight} />

          {/* Product Result Card - Shows below scanner when product is found */}
          <div className='w-full h-full z-30 flex border border-blue-50 flex-col' style={{ height: `${resultCardHeight}px` }}>
            <ProductResult barcode={searchBarcode} />
          </div>
        </div>
      )}
    </div>
  );
}
