'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { BarcodeDetector } from 'barcode-detector/ponyfill';
import { Navigation } from './Navigation';
import { ScannerControl } from './ScannerControl';
import { CornerDecorations } from './ui/CornerDecorations';

interface BarcodeScannerProps {
  onBarcodeDetected: (barcode: string) => void;
}

export function BarcodeScanner({ onBarcodeDetected }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const scannerRef = useRef<BarcodeDetector | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const streamRef = useRef<MediaStream | null>(null);

  // Window geometry - responsive to viewport
  const getWindowDimensions = () => {
    const viewportWidth = window.innerWidth;

    // Control button height (h-16 = 64px)
    const controlHeight = 64;

    // Window takes up roughly 70% of viewport width, maintaining aspect ratio
    const windowWidth = Math.min(viewportWidth * 0.7, 320);

    // Height needs to accommodate the control buttons at the bottom
    // Add some padding above and below the controls
    const windowHeight = controlHeight + 32; // 64px controls + 16px padding top + 16px padding bottom

    // Corner radius should be circular and match corner decorations (24px)
    const cornerRadius = 24;

    return { w: windowWidth, h: windowHeight, r: cornerRadius };
  };

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stopScanning = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    // Clean up video stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Clean up video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.load(); // Reset the video element
    }

    setIsScanning(false);
  }, []);

  const scanForBarcodes = useCallback(async () => {
    if (!videoRef.current || !scannerRef.current || !isScanning) return;

    try {
      const barcodes = await scannerRef.current.detect(videoRef.current);

      if (barcodes.length > 0) {
        const barcode = barcodes[0].rawValue;
        onBarcodeDetected(barcode);
        stopScanning();
        return;
      }
    } catch (err) {
      console.error('Scanning error:', err);
    }

    if (isScanning) {
      animationFrameRef.current = requestAnimationFrame(scanForBarcodes);
    }
  }, [isScanning, onBarcodeDetected, stopScanning]);

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
      stopScanning();
    };
  }, [stopScanning]);

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
    } catch (err) {
      console.error('Camera access error:', err);
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
    } catch (err) {
      console.error('Flash error:', err);
    }
  };

  // Generate SVG mask for the scanning window
  const generateMaskSVG = () => {
    const { w, h, r } = windowDimensions;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Convert to percentage coordinates for SVG
    const centerX = 50;
    const centerY = 50;
    const widthPercent = (w / viewportWidth) * 100;
    const heightPercent = (h / viewportHeight) * 100;

    // Use a fixed radius in pixels, convert to percentage
    // This ensures the radius is circular and consistent
    const radiusPercentY = (r / viewportHeight) * 100;
    const radiusPercentX = (r / viewportWidth) * 100;

    return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 100 100' preserveAspectRatio='none'><defs><mask id='cut' maskUnits='userSpaceOnUse' x='0' y='0' width='100%' height='100%'><rect x='0' y='0' width='100%' height='100%' fill='white'/><rect x='${centerX - widthPercent / 2}' y='${centerY - heightPercent / 2}' width='${widthPercent}' height='${heightPercent}' rx='${radiusPercentX}' ry='${radiusPercentY}' fill='black'/></mask></defs><rect x='0' y='0' width='100%' height='100%' fill='white' mask='url(%23cut)'/></svg>`;
  };

  return (
    <div className='relative w-full h-full bg-black overflow-hidden'>
      {/* Single video element */}
      <video ref={videoRef} className='absolute inset-0 w-full h-full object-cover' playsInline muted autoPlay />

      {/* Blur/dim overlay with hard-edged rounded-rect hole using SVG mask */}
      <div
        className='pointer-events-none absolute inset-0'
        style={{
          backdropFilter: 'blur(14px) saturate(1.05) brightness(0.5)',
          WebkitBackdropFilter: 'blur(14px) saturate(1.05) brightness(0.5)',
          maskImage: `url("${generateMaskSVG()}")`,
          WebkitMaskImage: `url("${generateMaskSVG()}")`,
        }}
      />

      {/* Corner decorations positioned at screen edges */}
      <CornerDecorations />

      {/* Scanner controls positioned inside the unblurred area */}
      <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30'>
        <ScannerControl onKeyboardClick={() => {}} onFlashClick={toggleFlash} />
      </div>

      {/* Navigation */}
      <Navigation />
    </div>
  );
}
