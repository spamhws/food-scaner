import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button } from './ui/Button';
import { Navigation } from './Navigation';
import { ScannerControl } from './ScannerControl';
import { CornerDecorations } from './ui/CornerDecorations';
import { ProductCardSlider } from './ProductCardSlider';

export function BarcodeScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [scannedBarcodes, setScannedBarcodes] = useState<string[]>([]);

  const controlHeight = 64;
  const resultCardHeight = 112;
  const tabBarHeight = 60; // Height of the bottom tab bar

  // Window geometry - responsive to viewport
  const getScanCardDimensions = () => {
    const viewportWidth = Dimensions.get('window').width;
    const viewportHeight = Dimensions.get('window').height;

    const windowWidth = viewportWidth - 48;

    // Add some padding above and below the controls, accounting for tab bar
    const windowHeight = Math.min(
      (windowWidth / 4) * 3,
      viewportHeight - controlHeight - resultCardHeight - tabBarHeight - 48
    );

    const cornerRadius = 16;

    return { w: windowWidth, h: windowHeight, r: cornerRadius };
  };

  const [scanCardDimensions, setScanCardDimensions] = useState(
    getScanCardDimensions()
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setScanCardDimensions(getScanCardDimensions());
    });

    return () => subscription?.remove();
  }, []);

  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
    // Only add if not already in the array
    setScannedBarcodes((prev) => {
      if (!prev.includes(data)) {
        return [...prev, data];
      }
      return prev;
    });
  };

  const toggleFlash = () => {
    setIsFlashOn(!isFlashOn);
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Text className="text-white text-center mb-4">
          We need your permission to access the camera to scan barcodes
        </Text>
        <Button onPress={requestPermission}>Grant Permission</Button>
      </View>
    );
  }

  return (
    <View className="relative flex-1 bg-black">
      {/* Camera View */}
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: [
            'ean13',
            'ean8',
            'upc_a',
            'upc_e',
            'code128',
            'code39',
            'code93',
          ],
        }}
        enableTorch={isFlashOn}
      />

      {/* Overlay with blur effect (simulated with dark overlay) */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {/* Top overlay */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: (Dimensions.get('window').height - scanCardDimensions.h) / 2 - controlHeight / 2,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          }}
        />

        {/* Bottom overlay */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: (Dimensions.get('window').height - scanCardDimensions.h) / 2 + controlHeight / 2 + resultCardHeight + 48,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          }}
        />

        {/* Left overlay */}
        <View
          style={{
            position: 'absolute',
            top: (Dimensions.get('window').height - scanCardDimensions.h) / 2 - controlHeight / 2,
            left: 0,
            width: 24,
            height: scanCardDimensions.h + controlHeight,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          }}
        />

        {/* Right overlay */}
        <View
          style={{
            position: 'absolute',
            top: (Dimensions.get('window').height - scanCardDimensions.h) / 2 - controlHeight / 2,
            right: 0,
            width: 24,
            height: scanCardDimensions.h + controlHeight,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          }}
        />
      </View>

      {/* Scanner Interface */}
      <View className="absolute inset-0 flex-1 flex-col items-center justify-center gap-8 p-6">
        <View
          className="relative flex-1 flex-col items-center justify-center p-2.5"
          style={{ height: scanCardDimensions.h }}
        >
          {/* Corner decorations positioned at screen edges */}
          <CornerDecorations />
          <View className="flex-1 w-full items-center justify-center">
            <ScannerControl
              onFlashClick={toggleFlash}
              isFlashOn={isFlashOn}
              controlHeight={controlHeight}
            />
          </View>
        </View>

        {/* Navigation */}
        <Navigation navigationHeight={controlHeight} />

        {/* Product Result Cards - Horizontal scrolling */}
        <ProductCardSlider
          barcodes={scannedBarcodes}
          height={resultCardHeight}
        />
      </View>
    </View>
  );
}

