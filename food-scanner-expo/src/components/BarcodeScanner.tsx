import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Alert,
  Platform,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button } from './ui/Button';
import { Navigation } from './Navigation';
import { ScannerControl } from './ScannerControl';
import { CornerDecorations } from './ui/CornerDecorations';
import { ProductCardSlider } from './ProductCardSlider';
import Svg, { Defs, Mask, Rect, Path } from 'react-native-svg';

export function BarcodeScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [scannedBarcodes, setScannedBarcodes] = useState<string[]>([]);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [isManualEntryActive, setIsManualEntryActive] = useState(false);

  // Track last scanned barcode to prevent duplicates
  const lastScanRef = useRef<{ barcode: string; timestamp: number } | null>(null);
  const SCAN_COOLDOWN_MS = 2000; // 2 seconds cooldown for same barcode

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

  const [scanCardDimensions, setScanCardDimensions] = useState(getScanCardDimensions());

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setScanCardDimensions(getScanCardDimensions());
    });

    return () => subscription?.remove();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    // Don't scan while manual entry is active (iOS prompt or Android modal)
    if (isManualEntryActive) {
      return;
    }

    const now = Date.now();
    const lastScan = lastScanRef.current;

    // Check if this is a duplicate scan within the cooldown period
    if (lastScan && lastScan.barcode === data) {
      const timeSinceLastScan = now - lastScan.timestamp;
      if (timeSinceLastScan < SCAN_COOLDOWN_MS) {
        console.log(`Ignoring duplicate scan of ${data} (${timeSinceLastScan}ms since last scan)`);
        return;
      }
    }

    console.log('Scanned barcode:', { type, data, length: data.length });

    // Update last scan reference
    lastScanRef.current = { barcode: data, timestamp: now };

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

  const addManualBarcode = (barcode: string) => {
    if (barcode && barcode.trim()) {
      setScannedBarcodes((prev) => {
        if (!prev.includes(barcode.trim())) {
          return [...prev, barcode.trim()];
        }
        return prev;
      });
    }
  };

  const handleModalSubmit = () => {
    addManualBarcode(manualBarcode);
    setShowBarcodeModal(false);
    setManualBarcode('');
    setIsManualEntryActive(false);
  };

  const handleManualEntry = () => {
    setIsManualEntryActive(true);

    if (Platform.OS === 'ios') {
      // iOS native prompt
      Alert.prompt(
        'Enter Barcode',
        'Enter the product barcode manually',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              setIsManualEntryActive(false);
            },
          },
          {
            text: 'Search',
            onPress: (barcode?: string) => {
              if (barcode && barcode.trim()) {
                addManualBarcode(barcode.trim());
              }
              setIsManualEntryActive(false);
            },
          },
        ],
        'plain-text',
        '',
        'numeric'
      );
    } else {
      // Android custom modal
      setManualBarcode('');
      setShowBarcodeModal(true);
    }
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

  const viewportHeight = Dimensions.get('window').height;
  const viewportWidth = Dimensions.get('window').width;

  // Scanner layout constants
  const scannerPadding = 8; // Padding inside corners
  const cornerRadius = 24; // Top corner radius for camera area
  const cornerStrokeWidth = 4; // Thickness of corner decoration lines
  const cameraButtonGap = 4; // Gap between camera area and buttons
  const verticalOffset = 120; // Offset from center (move up)
  const cornerSize = 100; // Size of the corner decorations
  // Calculate centered position for scanner window, slightly above center
  const scannerTop = (viewportHeight - scanCardDimensions.h - controlHeight) / 2 - verticalOffset;

  // Camera area dimensions
  const cameraLeft = (viewportWidth - scanCardDimensions.w) / 2 + scannerPadding;
  const cameraRight = (viewportWidth + scanCardDimensions.w) / 2 - scannerPadding;
  const cameraTop = scannerTop + scannerPadding + cornerStrokeWidth;
  const cameraBottom = scannerTop + scanCardDimensions.h - scannerPadding * 2;
  const cameraWidth = scanCardDimensions.w - scannerPadding * 2;
  const cameraHeight = scanCardDimensions.h - scannerPadding;

  return (
    <>
      {/* Android Barcode Entry Modal */}
      <Modal
        visible={showBarcodeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBarcodeModal(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-4/5 bg-white rounded-2xl p-6">
            <Text className="text-lg font-semibold text-center mb-2">Enter Barcode</Text>
            <Text className="text-sm text-gray-600 text-center mb-4">
              Enter the product barcode manually
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
              placeholder="Barcode"
              value={manualBarcode}
              onChangeText={setManualBarcode}
              keyboardType="numeric"
              autoFocus
              onSubmitEditing={handleModalSubmit}
            />
            <View className="flex-row gap-2">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-lg py-3"
                onPress={() => {
                  setShowBarcodeModal(false);
                  setManualBarcode('');
                  setIsManualEntryActive(false);
                }}
              >
                <Text className="text-center font-semibold text-gray-800">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-blue-500 rounded-lg py-3"
                onPress={handleModalSubmit}
              >
                <Text className="text-center font-semibold text-white">Search</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View className="relative flex-1 bg-black">
        {/* Camera View */}
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'code93'],
          }}
          enableTorch={isFlashOn}
        />

        {/* Overlay with SVG mask - single element like web app */}
        <Svg
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
          width={viewportWidth}
          height={viewportHeight}
        >
          <Defs>
            <Mask id="scannerMask">
              {/* White fills the entire screen */}
              <Rect x="0" y="0" width={viewportWidth} height={viewportHeight} fill="white" />
              {/* Black punches a hole for the camera view only (rounded top, gap before buttons) */}
              <Path
                d={`
                M ${cameraLeft} ${cameraTop + cornerRadius}
                L ${cameraLeft} ${cameraTop + cornerRadius}
                A ${cornerRadius} ${cornerRadius} 0 0 1 ${cameraLeft + cornerRadius} ${cameraTop}
                L ${cameraRight - cornerRadius} ${cameraTop}
                A ${cornerRadius} ${cornerRadius} 0 0 1 ${cameraRight} ${cameraTop + cornerRadius}
                L ${cameraRight} ${cameraBottom}
                L ${cameraLeft} ${cameraBottom}
                Z
              `}
                fill="black"
              />
            </Mask>
          </Defs>
          {/* Dark overlay everywhere except the masked area */}
          <Rect
            x="0"
            y="0"
            width={viewportWidth}
            height={viewportHeight}
            fill="rgba(0, 0, 0, 0.6)"
            mask="url(#scannerMask)"
          />
        </Svg>

        {/* Scanner Interface */}
        <View
          className="absolute inset-0 flex-col items-center gap-8"
          style={{ paddingTop: scannerTop }}
        >
          <View
            className="relative w-full flex-col items-center justify-center  p-6"
            style={{ height: scanCardDimensions.h + controlHeight, padding: scannerPadding }}
          >
            {/* Corner decorations positioned at screen edges */}
            <CornerDecorations strokeWidth={cornerStrokeWidth} cornerSize={cornerSize} />
            <View className="flex-1 w-full items-center justify-center"></View>

            <View className="w-full px-[24px] pb-1 ">
              <ScannerControl
                onKeyboardClick={handleManualEntry}
                onFlashClick={toggleFlash}
                isFlashOn={isFlashOn}
                controlHeight={controlHeight}
              />
            </View>
          </View>
          {/* Navigation */}
          <View className="px-6">
            <Navigation navigationHeight={controlHeight} />
          </View>

          {/* Product Result Cards - Horizontal scrolling */}
          <View className="w-full">
            <ProductCardSlider barcodes={scannedBarcodes} height={resultCardHeight} />
          </View>
        </View>
      </View>
    </>
  );
}
