# 🍱 Food Scanner

Mobile app for scanning food product barcodes and viewing detailed nutritional information. Uses the OpenFoodFacts database to fetch product data, display Nutri-Score ratings, identify allergens, and provide health assessments.

## 🚀 Quick Start

### 1️⃣ Get the Code

Download or clone this repository to your computer:

```bash
git clone <repository-url>
cd food-scanner-expo
```

Or download as ZIP and extract it.

### 2️⃣ Install Expo Go on Your Phone

- **iPhone**: Download from App Store
- **Android**: Download from Play Store

### 3️⃣ Install Dependencies

Open the project folder in VS Code or Cursor, then open the terminal and run:

```bash
npm install
```

_(This only needs to be done once)_

### 4️⃣ Start the App

```bash
npm start
```

A QR code will appear in your terminal.

### 5️⃣ Connect Your Phone

- **Android**: Open Expo Go → Tap "Scan QR code" → Scan the QR code from your terminal
- **iOS**: Open Camera app → Point at the QR code → Tap the notification

### 6️⃣ Allow Camera Access

Tap "Allow" when the app asks for camera permissions.

> **Note**: Your phone and computer must be on the same WiFi network.

## 🛠️ Tech Stack

- **React Native** with **Expo** - Cross-platform mobile framework
- **TypeScript** - Type safety
- **NativeWind** - Tailwind CSS for React Native
- **React Navigation** - Native navigation with iOS/Android headers
- **TanStack React Query** - Data fetching and caching
- **AsyncStorage** - Persistent local storage for history/favorites
- **expo-camera** - Barcode scanning
- **react-native-svg** - SVG graphics and masks
- **expo-blur** - Blur effects
- **expo-haptics** - Vibration feedback
- **Tabler Icons** - Icon library

## 📁 Project Structure

```
src/
├── components/
│   ├── BarcodeScanner.tsx        # Main camera view with barcode detection
│   ├── ProductCard.tsx            # Product summary card (slider + lists)
│   ├── ProductCardSlider.tsx      # Horizontal scanned products slider
│   ├── ProductList.tsx            # Vertical list (history/favorites)
│   ├── NavigationButtons.tsx      # Bottom navigation bar
│   ├── ScannerControl.tsx         # Flash and manual entry controls
│   ├── ProductDetailSheet/        # Bottom sheet with full product info
│   │   ├── ProductDetailSheet.tsx
│   │   ├── InfoCard.tsx
│   │   ├── InfoRow.tsx
│   │   └── SectionLabel.tsx
│   └── ui/                        # Reusable UI components
│       ├── Badge.tsx
│       ├── Button.tsx
│       └── Card.tsx
├── screens/
│   ├── ScannerScreen.tsx          # Main scanning screen
│   ├── HistoryScreen.tsx          # Scanned products history
│   ├── FavouritesScreen.tsx       # Saved favorite products
│   ├── SettingsScreen.tsx         # App settings
│   ├── FAQScreen.tsx              # FAQ
│   ├── PrivacyPolicyScreen.tsx    # Privacy policy
│   └── UserAgreementScreen.tsx    # User agreement
├── navigation/
│   └── AppNavigator.tsx           # Navigation configuration
├── hooks/
│   ├── useBarcodeScanner.ts       # Barcode detection logic
│   ├── useProduct.ts              # Product data fetching
│   ├── useHistory.ts              # History management
│   └── useFavorites.ts            # Favorites management
├── lib/
│   ├── api/
│   │   └── product.ts             # OpenFoodFacts API client
│   ├── storage/
│   │   └── storage.ts             # AsyncStorage wrapper
│   └── utils/
│       ├── barcode-coordinates.ts # Barcode outline calculations
│       ├── product-assessment.ts  # Health assessment logic
│       ├── product-narrative.ts   # AI-like product descriptions
│       └── vibration.ts           # Haptic feedback
├── types/
│   └── product.ts                 # TypeScript interfaces
└── constants/
    ├── endpoints.ts               # API URLs
    └── colors.ts                  # Nutri-Score color mappings
```

## ✨ Features

### 📸 Scanner Screen

- Real-time barcode scanning with camera
- Live barcode outline overlay (green shape around detected barcode)
- Flash toggle for low-light scanning
- Manual barcode entry (keyboard icon)
- Blurred + darkened overlay with rounded camera viewfinder
- Horizontal slider with scanned product cards
- Duplicate barcode detection (scrolls to existing card)
- Vibration feedback (success/error)

### 📊 Product Detail Sheet

- Bottom sheet drawer with product information
- Nutri-Score badge (A-E rating, color-coded)
- Product image with brand and name
- Nutrition facts per 100g (calories, protein, fat, carbs, sugars, salt, fiber)
- Key characteristics (positive/negative health assessments)
- Allergens list (capitalized, with alert icons)
- Full ingredients list
- AI-generated product narrative with consumption recommendation
- Add to favorites (heart icon, persistent storage)
- Share product info (native share sheet)
- Android back button support

### 📜 History Screen

- List of all scanned products (errors excluded)
- Tap any product to open detail sheet
- Persistent storage (survives app restart)
- Cache-first loading (no refetching)

### ❤️ Favorites Screen

- List of favorited products
- Tap any product to open detail sheet
- Persistent storage with heart toggle

### ⚙️ Settings Screen

- FAQ (expandable sections)
- Privacy Policy (scrollable content)
- User Agreement (scrollable content)
- App Version display

## 🧪 Sample Barcodes

- Coca-Cola: `5449000000996`
- Nutella: `3017620422003`
- Kit Kat: `5000159461122`

## 💻 Development

Hot reload is enabled. Edit any file and see changes instantly on your device. Check the terminal for logs and errors.
