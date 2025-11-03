# 🍱 Food Scanner - Expo App

A mobile food scanner app built with Expo, React Native, and NativeWind. Scan barcodes to get detailed nutritional information about food products.

## 🚀 Features

- **Barcode Scanning**: Use your camera to scan product barcodes
- **Product Information**: Get detailed nutrition facts from Open Food Facts API
- **Multiple Products**: Scan multiple products and swipe through results
- **Flash Control**: Toggle camera flash for scanning in low light
- **Offline Support**: Product data is cached for offline viewing
- **Beautiful UI**: Apple-like design with smooth animations

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your mobile device (iOS/Android)
- OR Android Studio / Xcode for native builds

## 🛠 Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Run on your device**:
   - Scan the QR code with Expo Go app (Android)
   - Scan the QR code with Camera app (iOS)
   
   Or run on emulator:
   ```bash
   npm run android  # Android emulator
   npm run ios      # iOS simulator (macOS only)
   ```

## 📱 Testing with Expo Go

1. Install Expo Go from:
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android)
   - [Apple App Store](https://apps.apple.com/app/expo-go/id982107779) (iOS)

2. Make sure your phone and computer are on the same WiFi network

3. Run `npm start` and scan the QR code with Expo Go

## 🎨 Tech Stack

- **Framework**: Expo / React Native
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Data Fetching**: TanStack React Query
- **Camera**: expo-camera
- **API**: Open Food Facts
- **Icons**: Tabler Icons React Native
- **Language**: TypeScript

## 📂 Project Structure

```
food-scanner-expo/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── BarcodeScanner.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductCardSlider.tsx
│   │   ├── Navigation.tsx
│   │   └── ScannerControl.tsx
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and API clients
│   │   ├── api/         # API functions
│   │   └── utils/       # Helper functions
│   ├── providers/        # React context providers
│   ├── types/            # TypeScript type definitions
│   └── constants/        # App constants
├── App.tsx               # Main app component
├── global.css           # Global styles
├── tailwind.config.js   # Tailwind configuration
└── package.json         # Dependencies

```

## 🔧 Configuration

### API Endpoint

To use a custom backend API, edit `src/constants/endpoints.ts`:

```typescript
export const API_URL = 'http://YOUR_LOCAL_IP:3000';
```

Replace `YOUR_LOCAL_IP` with your computer's local IP address (not localhost).

### Camera Permissions

Camera permissions are requested automatically. Make sure to allow camera access when prompted.

## 🧪 Testing Products

Try scanning these common barcodes:
- Coca-Cola: `5449000000996`
- Nutella: `3017620422003`
- Kit Kat: `5000159461122`

## 🐛 Troubleshooting

### Camera not working
- Make sure you granted camera permissions
- Restart the Expo Go app
- Check that your device has a working camera

### Products not loading
- Check your internet connection
- Verify the API_URL in `src/constants/endpoints.ts`
- Check the console for error messages

### Barcode not scanning
- Make sure the barcode is well-lit
- Hold the camera steady
- Try different angles and distances

## 📝 Development

### Hot Reload

The app supports hot reloading. Save any file and see changes instantly on your device.

### Debugging

- Shake your device to open the developer menu
- Enable "Debug Remote JS" to use Chrome DevTools
- Use `console.log()` to debug

## 🚢 Building for Production

### Android APK

```bash
eas build --platform android --profile preview
```

### iOS IPA

```bash
eas build --platform ios --profile preview
```

Note: You'll need an Expo account and EAS CLI configured.

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please create an issue in the repository.

