import React, { useState, useRef, useCallback } from 'react';
import { View, Text, Pressable, Dimensions, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useScanHistory } from '@/hooks/useScanHistory';
import { ProductCard } from './ProductCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ScannedItem {
  barcode: string;
  id: string; // Unique ID for React keys
}

export function CameraScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedBarcodes, setScannedBarcodes] = useState<ScannedItem[]>([]);
  const [torch, setTorch] = useState(false);
  const { addToHistory } = useScanHistory();
  const router = useRouter();
  const lastScannedRef = useRef<string | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBarCodeScanned = useCallback(
    ({ data }: BarcodeScanningResult) => {
      // Debounce: ignore if same as last scanned
      if (data === lastScannedRef.current) {
        return;
      }

      // Check if barcode already exists in the list
      const alreadyScanned = scannedBarcodes.some((item) => item.barcode === data);
      if (alreadyScanned) {
        return;
      }

      // Clear any existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set debounce timer to allow new scans after 2 seconds
      debounceTimerRef.current = setTimeout(() => {
        lastScannedRef.current = null;
      }, 2000);

      lastScannedRef.current = data;
      const newItem: ScannedItem = {
        barcode: data,
        id: `${data}-${Date.now()}`, // Unique ID combining barcode and timestamp
      };
      setScannedBarcodes((prev) => [...prev, newItem]);
      addToHistory({ barcode: data }); // Product data will be cached when ProductCard fetches it
    },
    [scannedBarcodes, addToHistory]
  );

  if (!permission) {
    return (
      <View className='flex-1 items-center justify-center bg-black'>
        <Text className='text-white text-base'>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center bg-white px-6'>
        <Text className='text-xl font-semibold mb-3 text-center'>Camera Permission Required</Text>
        <Text className='text-base text-gray-60 mb-6 text-center'>We need camera access to scan product barcodes</Text>
        <Pressable onPress={requestPermission} className='bg-blue-70 px-6 py-3 rounded-xl'>
          <Text className='text-white text-base font-semibold'>Grant Permission</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // Calculate dimensions - matching web app
  const controlHeight = 64;
  const navigationHeight = 64;
  const resultCardHeight = 112;
  const padding = 24;
  const gap = 32; // gap-8 between scan window and navigation
  const cornerSize = 96; // Same as corner decorations
  const borderRadius = 24; // Same as corner radius

  const scanWindowWidth = screenWidth - padding * 2;
  const scanWindowHeight = Math.min((scanWindowWidth / 4) * 3, screenHeight - controlHeight - resultCardHeight - gap * 2 - padding * 2 - 100);

  // Calculate button widths to fit inside corners
  const twoButtonWidth = scanWindowWidth - cornerSize * 2; // For scanner controls (2 buttons)
  const threeButtonWidth = scanWindowWidth - cornerSize * 2; // For navigation (3 buttons)

  const hasScannedProducts = scannedBarcodes.length > 0;

  return (
    <View className='flex-1 bg-black'>
      {/* Fullscreen Camera */}
      <CameraView
        className='absolute inset-0'
        facing='back'
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'code93'],
        }}
        enableTorch={torch}
      />

      {/* Fullscreen Dark Overlay with blur - matching web's blur(14px) brightness(0.5) */}
      <BlurView intensity={14} className='absolute inset-0' tint='dark'>
        <View className='absolute inset-0 bg-black/50' />
      </BlurView>

      {/* Main Content */}
      <SafeAreaView className='flex-1' edges={['top', 'bottom']}>
        <View className='flex-1 items-center justify-center px-6 gap-8'>
          {/* Scan Window Container with Corners and Control Buttons */}
          <View className='relative bg-transparent' style={{ width: scanWindowWidth, height: scanWindowHeight }}>
            {/* Corner Decorations - 96px like web */}
            <View className='absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-white rounded-tl-3xl' />
            <View className='absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-white rounded-tr-3xl' />
            <View className='absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-white rounded-bl-3xl' />
            <View className='absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-white rounded-br-3xl' />

            {/* Centered content area */}
            <View className='flex-1 w-full justify-end items-center'>
              {/* Scanner Control Buttons - positioned at bottom inside corners */}
              <View className='flex-row overflow-hidden' style={{ height: controlHeight, width: twoButtonWidth, borderRadius }}>
                <Pressable className='flex-1 overflow-hidden' onPress={() => {}}>
                  <BlurView intensity={20} className='flex-1 items-center justify-center bg-white/10' tint='light'>
                    <MaterialIcons name='keyboard' size={24} color='white' />
                  </BlurView>
                </Pressable>
                <View className='w-1' />
                <Pressable className='flex-1 overflow-hidden' onPress={() => setTorch(!torch)}>
                  <BlurView intensity={20} className='flex-1 items-center justify-center bg-white/10' tint='light'>
                    <MaterialIcons name='flash-on' size={24} color='white' />
                  </BlurView>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Navigation Buttons - Floating below scan window, separate */}
          <View className='flex-row overflow-hidden' style={{ height: navigationHeight, width: threeButtonWidth, borderRadius }}>
            <Pressable className='flex-1 overflow-hidden' onPress={() => router.push('/settings')}>
              <BlurView intensity={20} className='flex-1 items-center justify-center bg-white/10' tint='light'>
                <Ionicons name='settings-outline' size={24} color='white' />
              </BlurView>
            </Pressable>
            <View className='w-1' />
            <Pressable className='flex-1 overflow-hidden' onPress={() => router.push('/history')}>
              <BlurView intensity={20} className='flex-1 items-center justify-center bg-white/10' tint='light'>
                <MaterialIcons name='history' size={24} color='white' />
              </BlurView>
            </Pressable>
            <View className='w-1' />
            <Pressable className='flex-1 overflow-hidden' onPress={() => {}}>
              <BlurView intensity={20} className='flex-1 items-center justify-center bg-white/10' tint='light'>
                <Ionicons name='heart-outline' size={24} color='white' />
              </BlurView>
            </Pressable>
          </View>

          {/* Scanned Products - Floating at bottom with gap-6 (24px) like web */}
          {hasScannedProducts && (
            <View className='w-full' style={{ height: resultCardHeight }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 24 }} snapToInterval={screenWidth - 48 + 24} snapToAlignment='center' decelerationRate='fast' pagingEnabled={false}>
                {scannedBarcodes.map((item) => (
                  <View key={item.id} style={{ width: screenWidth - 48 }}>
                    <ProductCard barcode={item.barcode} />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
