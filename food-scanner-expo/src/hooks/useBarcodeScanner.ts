import { useState, useRef, useCallback } from 'react';
import { transformBarcodeCoordinates, arePointsInBounds } from '@/lib/utils/barcode-coordinates';

interface Point {
  x: number;
  y: number;
}

interface BarcodeScanResult {
  type: string;
  data: string;
  cornerPoints?: Point[];
}

interface UseBarcodeConfig {
  viewportWidth: number;
  viewportHeight: number;
  cameraBounds: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  scanCooldownMs?: number;
  outlineClearDelayMs?: number;
  onBarcodeScanned: (barcode: string) => void;
  isDisabled?: boolean;
}

export function useBarcodeScanner({
  viewportWidth,
  viewportHeight,
  cameraBounds,
  scanCooldownMs = 2000,
  outlineClearDelayMs = 300,
  onBarcodeScanned,
  isDisabled = false,
}: UseBarcodeConfig) {
  const [barcodeCorners, setBarcodeCorners] = useState<Point[] | null>(null);
  const lastScanRef = useRef<{ barcode: string; timestamp: number } | null>(null);
  const barcodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleBarCodeScanned = useCallback(
    ({ type, data, cornerPoints }: BarcodeScanResult) => {
      // Don't scan if disabled
      if (isDisabled) return;

      // Transform coordinates for platform differences
      const transformedCornerPoints = cornerPoints
        ? transformBarcodeCoordinates({
            cornerPoints,
            viewportWidth,
            viewportHeight,
          })
        : null;

      // Check if all corner points are within the camera view area
      const allPointsInView = transformedCornerPoints
        ? arePointsInBounds(transformedCornerPoints, cameraBounds)
        : false;

      // Update outline position continuously while barcode is visible
      if (transformedCornerPoints) {
        if (allPointsInView) {
          setBarcodeCorners(transformedCornerPoints);

          // Clear previous timeout
          if (barcodeTimeoutRef.current) {
            clearTimeout(barcodeTimeoutRef.current);
          }

          // Set new timeout to clear outline when barcode disappears
          barcodeTimeoutRef.current = setTimeout(() => {
            setBarcodeCorners(null);
          }, outlineClearDelayMs);
        } else {
          // Clear outline if barcode is outside camera view
          setBarcodeCorners(null);
          if (barcodeTimeoutRef.current) {
            clearTimeout(barcodeTimeoutRef.current);
          }
        }
      }

      // Only process barcode if it's fully within camera view
      if (!allPointsInView) {
        return;
      }

      const now = Date.now();
      const lastScan = lastScanRef.current;

      // Check duplicate within cooldown
      if (lastScan?.barcode === data) {
        const timeSinceLastScan = now - lastScan.timestamp;
        if (timeSinceLastScan < scanCooldownMs) {
          return;
        }
      }

      // Update last scan
      lastScanRef.current = { barcode: data, timestamp: now };

      // Trigger callback
      onBarcodeScanned(data);
    },
    [
      isDisabled,
      viewportWidth,
      viewportHeight,
      cameraBounds,
      scanCooldownMs,
      outlineClearDelayMs,
      onBarcodeScanned,
    ]
  );

  const clearOutline = useCallback(() => {
    setBarcodeCorners(null);
    if (barcodeTimeoutRef.current) {
      clearTimeout(barcodeTimeoutRef.current);
    }
  }, []);

  return {
    barcodeCorners,
    handleBarCodeScanned,
    clearOutline,
  };
}

