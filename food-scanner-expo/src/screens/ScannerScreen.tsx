import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  Linking,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { BlurView } from 'expo-blur';
import MaskedView from '@react-native-masked-view/masked-view';
import { CTAScreen } from '@/components/CTAScreen';
import { Videos } from '@/constants/assets';
import { NavigationButtons } from '@/components/NavigationButtons';
import { ScannerControl } from '@/components/ScannerControl';
import { CornerDecorations } from '@/components/ui/CornerDecorations';
import { ProductCardSlider, type ProductCardSliderRef } from '@/components/ProductCardSlider';
import { ProductDetailSheet } from '@/components/ProductDetailSheet/ProductDetailSheet';
import { DevTools } from '@/components/DevTools';
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

  const handleProductPress = useCallback((barcode: string) => {
    setSelectedBarcode(barcode);
  }, []);

  const handleBottomSheetClose = useCallback(() => {
    setSelectedBarcode(null);
  }, []);

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

  // Store viewport dimensions in state to avoid recalculating on every render
  const [viewportDimensions, setViewportDimensions] = useState(() => {
    const dims = Dimensions.get('window');
    return { width: dims.width, height: dims.height };
  });

  const viewportWidth = viewportDimensions.width;
  const viewportHeight = viewportDimensions.height;

  // Scanner layout constants
  const scannerPadding = 8;
  const cornerRadius = 24;
  const cornerStrokeWidth = 4;
  const verticalOffset = 100;

  // Memoize camera bounds - only recalculate when dimensions change
  const cameraBounds = useMemo(() => {
    const scannerTop = (viewportHeight - scanCardDimensions.h - controlHeight) / 2 - verticalOffset;
    const cameraLeft = (viewportWidth - scanCardDimensions.w) / 2 + scannerPadding;
    const cameraRight = (viewportWidth + scanCardDimensions.w) / 2 - scannerPadding;
    const cameraTop = scannerTop + scannerPadding + cornerStrokeWidth - 1;
    const cameraBottom = scannerTop + scanCardDimensions.h - scannerPadding * 2;

    return {
      left: cameraLeft,
      top: cameraTop,
      right: cameraRight,
      bottom: cameraBottom,
    };
  }, [
    viewportWidth,
    viewportHeight,
    scanCardDimensions,
    controlHeight,
    scannerPadding,
    cornerStrokeWidth,
    verticalOffset,
  ]);

  // Extract individual values for backward compatibility
  const scannerTop = (viewportHeight - scanCardDimensions.h - controlHeight) / 2 - verticalOffset;
  const cameraLeft = cameraBounds.left;
  const cameraRight = cameraBounds.right;
  const cameraTop = cameraBounds.top;
  const cameraBottom = cameraBounds.bottom;

  // Unified barcode processing pipeline - used by both camera scan and manual input
  const processBarcode = useCallback(
    (barcode: string) => {
      // Normalize barcode: trim whitespace
      const normalizedBarcode = barcode.trim();
      if (!normalizedBarcode) return;

      // Save to history
      addToHistory(normalizedBarcode);

      // Update scanned barcodes list
      setScannedBarcodes((prev) => {
        if (prev.includes(normalizedBarcode)) {
          // Barcode already exists - scroll to it
          setTimeout(() => {
            if (productSliderRef.current) {
              productSliderRef.current.scrollToBarcode(normalizedBarcode, prev);
            }
          }, 300);
          return prev; // Don't add duplicate
        }
        return [...prev, normalizedBarcode];
      });
    },
    [addToHistory]
  );

  // Initialize barcode scanner hook
  const { barcodeCorners, handleBarCodeScanned, clearOutline } = useBarcodeScanner({
    viewportWidth,
    viewportHeight,
    cameraBounds,
    onBarcodeScanned: processBarcode, // Use unified pipeline
    isDisabled: isManualEntryActive || !!selectedBarcode,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      const dims = Dimensions.get('window');
      setViewportDimensions({ width: dims.width, height: dims.height });
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

  const handleModalSubmit = () => {
    processBarcode(manualBarcode); // Use unified pipeline
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
        'Enter the numbers below the barcode to find the product',
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
              if (barcode) {
                processBarcode(barcode); // Use unified pipeline
              }
              setIsManualEntryActive(false);
            },
          },
        ],
        'plain-text',
        '', // No pre-filled value
        'numeric'
      );
    } else {
      // Android custom modal
      setManualBarcode(''); // No pre-filled value
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
    // Check if we can ask again (iOS: canAskAgain, Android: always true if not granted)
    const canAskAgain = permission.canAskAgain !== false;

    const handleOpenSettings = async () => {
      try {
        await Linking.openSettings();
      } catch (error) {
        Alert.alert(
          'Open Settings',
          'Please go to Settings > Food ID > Camera and enable camera access.',
          [{ text: 'OK' }]
        );
      }
    };

    return (
      <CTAScreen
        video={Videos.handPhone}
        title="Ready to Scan?"
        description="We just need camera access to scan barcodes. Nothing is recorded."
        buttonText="Enable Camera"
        onButtonPress={canAskAgain ? requestPermission : handleOpenSettings}
      />
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
              Enter the numbers below the barcode to find the product
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
        {barcodeCorners &&
          (() => {
            // Add 20 points of padding to each side
            const padding = 20;

            // Calculate center of barcode
            const centerX = barcodeCorners.reduce((sum, p) => sum + p.x, 0) / barcodeCorners.length;
            const centerY = barcodeCorners.reduce((sum, p) => sum + p.y, 0) / barcodeCorners.length;

            // Expand each corner outward by padding amount
            const paddedCorners = barcodeCorners.map((p) => {
              const dx = p.x - centerX;
              const dy = p.y - centerY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance === 0) return p;

              // Normalize and extend by padding
              const normalizedX = dx / distance;
              const normalizedY = dy / distance;
              return {
                x: p.x + normalizedX * padding,
                y: p.y + normalizedY * padding,
              };
            });

            return (
              <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
                <Path
                  d={`M ${paddedCorners.map((p) => `${p.x},${p.y}`).join(' L ')} Z`}
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="rgba(16, 185, 129, 0.1)"
                />
              </Svg>
            );
          })()}

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
