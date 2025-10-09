import React from 'react';
import { CameraScanner } from '@/components/CameraScanner';
import { verifyInstallation } from 'nativewind';

export default function ScannerScreen() {
  // Verify NativeWind installation
  verifyInstallation();

  return <CameraScanner />;
}
