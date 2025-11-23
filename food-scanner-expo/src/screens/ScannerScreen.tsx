import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { BlurView } from 'expo-blur';
import MaskedView from '@react-native-masked-view/masked-view';
import { Button } from '@/components/ui/Button';
import { NavigationButtons } from '@/components/NavigationButtons';
import { ScannerControl } from '@/components/ScannerControl';
import { CornerDecorations } from '@/components/ui/CornerDecorations';
import { ProductCardSlider, type ProductCardSliderRef } from '@/components/ProductCardSlider';
import { ProductDetailSheet } from '@/components/ProductDetailSheet/ProductDetailSheet';
import { useBarcodeScanner } from '@/hooks/useBarcodeScanner';
import { useHistory } from '@/hooks/useHistory';
import { useProduct } from '@/hooks/useProduct';
import Svg, { Path } from 'react-native-svg';

// Helper to build a rounded-rect path for SVG (only top corners rounded)
const rrectPath = (x: number, y: number, w: number, h: number, r: number) => `
  M ${x + r},${y}
  H ${x + w - r}
  A ${r},${r} 0 0 1 ${x + w},${y + r}
  V ${y + h}
  H ${x}
  V ${y + r}
  A ${r},${r} 0 0 1 ${x + r},${y}
  Z
`;

export function ScannerScreen() {
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [scannedBarcodes, setScannedBarcodes] = useState<string[]>([]);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [isManualEntryActive, setIsManualEntryActive] = useState(false);
  const [selectedBarcode, setSelectedBarcode] = useState<string | null>(null);
  const productSliderRef = useRef<ProductCardSliderRef>(null);

  // History management
  const { addItem: addToHistory } = useHistory();

  // Fetch selected product data (from cache for quick display)
  const { data: selectedProduct } = useProduct({
    barcode: selectedBarcode || '',
    enabled: !!selectedBarcode,
    fromCache: true,
  });

  const controlHeight = 64;
  const resultCardHeight = 116;
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

  // Get viewport dimensions
  const viewportHeight = Dimensions.get('window').height;
  const viewportWidth = Dimensions.get('window').width;

  // Scanner layout constants
  const scannerPadding = 8;
  const cornerRadius = 24;
  const cornerStrokeWidth = 4;
  const verticalOffset = 100;

  // Calculate camera bounds
  const scannerTop = (viewportHeight - scanCardDimensions.h - controlHeight) / 2 - verticalOffset;
  const cameraLeft = (viewportWidth - scanCardDimensions.w) / 2 + scannerPadding;
  const cameraRight = (viewportWidth + scanCardDimensions.w) / 2 - scannerPadding;
  const cameraTop = scannerTop + scannerPadding + cornerStrokeWidth - 1;
  const cameraBottom = scannerTop + scanCardDimensions.h - scannerPadding * 2;

  // Add barcode to list callback (memoized to prevent scanning issues on state changes)
  const handleBarcodeDetected = useCallback(
    (barcode: string) => {
      // Save to history
      addToHistory(barcode);
      setScannedBarcodes((prev) => {
        if (prev.includes(barcode)) {
          // Barcode already exists (whether product found or error) - scroll to it
          const index = prev.indexOf(barcode);
          // Pass the current array to ensure we have the right index
          setTimeout(() => {
            if (productSliderRef.current) {
              productSliderRef.current.scrollToBarcode(barcode, prev);
            }
          }, 300);
          return prev; // Don't add duplicate
        }
        return [...prev, barcode];
      });
    },
    [addToHistory]
  );

  // Initialize barcode scanner hook
  const { barcodeCorners, handleBarCodeScanned, clearOutline } = useBarcodeScanner({
    viewportWidth,
    viewportHeight,
    cameraBounds: {
      left: cameraLeft,
      top: cameraTop,
      right: cameraRight,
      bottom: cameraBottom,
    },
    onBarcodeScanned: handleBarcodeDetected,
    isDisabled: isManualEntryActive || !!selectedBarcode,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setScanCardDimensions(getScanCardDimensions());
    });

    return () => {
      subscription?.remove();
      clearOutline();
    };
  }, [clearOutline]);

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

  const handleProductPress = useCallback((barcode: string) => {
    setSelectedBarcode(barcode);
  }, []);

  const handleBottomSheetClose = useCallback(() => {
    setSelectedBarcode(null);
  }, []);

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

  // Additional layout constants
  const cornerSize = 100; // Size of the corner decorations

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
        {/* Camera View - only active when screen is focused and sheet is closed */}
        {isFocused && !selectedBarcode && (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'code93'],
            }}
            enableTorch={isFlashOn}
          />
        )}

        {/* Blur + Dark overlay with inverse mask (blur outside camera area only) */}
        <MaskedView
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
          maskElement={
            <Svg width={viewportWidth} height={viewportHeight}>
              {/* Even-odd path: full screen minus scan rect => show outside only */}
              <Path
                fill="#fff"
                fillRule="evenodd"
                d={`M0,0 H${viewportWidth} V${viewportHeight} H0 Z
                   ${rrectPath(
                     cameraLeft,
                     cameraTop,
                     cameraRight - cameraLeft,
                     cameraBottom - cameraTop,
                     cornerRadius
                   )}
                `}
              />
            </Svg>
          }
        >
          {/* This blurs whatever is behind it; masked to only the outside region */}
          <BlurView style={StyleSheet.absoluteFill} intensity={12} tint="dark" />
        </MaskedView>

        {/* Additional dark overlay for extra dimming (optional, adjust opacity) */}
        <Svg
          width={viewportWidth}
          height={viewportHeight}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <Path
            fill="rgba(0, 0, 0, 0.7)"
            fillRule="evenodd"
            d={`M0,0 H${viewportWidth} V${viewportHeight} H0 Z
               ${rrectPath(
                 cameraLeft,
                 cameraTop,
                 cameraRight - cameraLeft,
                 cameraBottom - cameraTop,
                 cornerRadius
               )}
            `}
          />
        </Svg>

        {/* Barcode Detection Overlay */}
        {barcodeCorners && (
          <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
            <Path
              d={`M ${barcodeCorners.map((p) => `${p.x},${p.y}`).join(' L ')} Z`}
              stroke="#10b981"
              strokeWidth={3}
              fill="rgba(16, 185, 129, 0.1)"
            />
          </Svg>
        )}

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
            <NavigationButtons navigationHeight={controlHeight} />
          </View>

          {/* Product Result Cards - Horizontal scrolling */}
          <View className="w-full">
            <ProductCardSlider
              ref={productSliderRef}
              barcodes={scannedBarcodes}
              height={resultCardHeight}
              onProductPress={handleProductPress}
            />
          </View>
        </View>
      </View>

      {/* Product Detail Bottom Sheet */}
      <ProductDetailSheet product={selectedProduct || null} onClose={handleBottomSheetClose} />
    </>
  );
}
