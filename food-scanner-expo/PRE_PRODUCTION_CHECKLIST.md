# Pre-Production Checklist

This document outlines all items that need to be removed, updated, or addressed before releasing the app to production.

## 🚨 Critical - Must Remove/Update

### 1. DevTools Component
**Location:** `src/components/DevTools.tsx` and `src/screens/ScannerScreen.tsx`

**Action Required:**
- Delete `src/components/DevTools.tsx`
- Remove the import from `ScannerScreen.tsx`:
  ```typescript
  import { DevTools } from '@/components/DevTools';
  ```
- Remove the component usage from `ScannerScreen.tsx` (around line 327):
  ```typescript
  {/* DEV TOOLS - Remove before production */}
  <DevTools currentBarcode={scannedBarcodes.length > 0 ? scannedBarcodes[0] : null} />
  ```

**Why:** The DevTools component provides a "Clear Storage" button and displays the current barcode, which should not be visible to end users.

---

### 2. Hardcoded Test Barcode in Manual Entry
**Location:** `src/screens/ScannerScreen.tsx` (lines 209-210, 236, 241)

**Action Required:**
- Remove the `TEST_BARCODE` constant (line 210):
  ```typescript
  const TEST_BARCODE = '3017620429484';
  ```
- Remove the pre-fill values in `Alert.prompt` (line 236):
  ```typescript
  TEST_BARCODE, // Pre-fill with test barcode
  ```
- Remove the pre-fill in Android modal (line 241):
  ```typescript
  setManualBarcode(TEST_BARCODE); // Pre-fill with test barcode
  ```
- Change to:
  ```typescript
  setManualBarcode(''); // Empty string for production
  ```

**Why:** The test barcode `3017620429484` is pre-filled in manual entry for development testing and should be removed.

---

### 3. App Store URLs - Share & Rating
**Location:** `src/constants/app-store.ts`

**Action Required:**
Update all placeholder URLs with actual published app store links:

1. **App Store Links** (lines 7-8):
   ```typescript
   export const APP_STORE_LINKS = {
     ios: 'https://apps.apple.com/app/food-id', // TODO: Update with actual App Store link
     android: 'https://play.google.com/store/apps/details?id=com.foodid', // TODO: Update with actual Play Store link
   } as const;
   ```
   - Replace with actual App Store URL (format: `https://apps.apple.com/app/id{APP_ID}`)
   - Replace with actual Google Play URL (format: `https://play.google.com/store/apps/details?id=com.foodid`)

2. **Review Links** (lines 16-17):
   ```typescript
   export const APP_STORE_REVIEW_LINKS = {
     ios: 'itms-apps://apps.apple.com/app/id?action=write-review', // TODO: Update with actual App ID
     android: 'market://details?id=com.foodid',
   } as const;
   ```
   - Replace `?` with actual iOS App ID in the review link
   - Verify Android package name matches `com.foodid` (already correct)

**Why:** These links are used in "Share the App" and "Rate the App" features. Broken links will prevent users from sharing or rating the app.

---

### 4. "Coming Soon" Text in Product Share
**Location:** `src/lib/utils/share.ts` (line 21)

**Action Required:**
Remove "(coming soon)" text from the share message:
```typescript
const appLinks =
  '\n\n📱 Get Food ID:\nApp Store: https://apps.apple.com/app/food-id (coming soon)\nGoogle Play: https://play.google.com/store/apps/details?id=com.foodid (coming soon)';
```

Change to:
```typescript
const appLinks =
  '\n\n📱 Get Food ID:\n🍎 App Store: https://apps.apple.com/app/food-id\n🤖 Google Play: https://play.google.com/store/apps/details?id=com.foodid';
```

**Note:** Also update the URLs here to match the ones in `app-store.ts` after they're updated.

**Why:** "(coming soon)" text is unprofessional and should be removed once the app is published.

---

## ✅ Optional - Review & Consider

### Console Error Logging
**Location:** Multiple files (`src/lib/api/product.ts`, `src/lib/storage/storage.ts`)

**Status:** These `console.error()` statements are acceptable for production as they help with debugging issues. However, consider:
- Implementing a proper error logging service (e.g., Sentry, Bugsnag) for production
- Removing or conditionally logging based on environment (dev vs production)

**Files with console.error:**
- `src/lib/api/product.ts` (line 120)
- `src/lib/storage/storage.ts` (multiple lines)

---

### Endpoints Configuration
**Location:** `src/constants/endpoints.ts`

**Status:** Already configured for production (`https://world.openfoodfacts.org`). The development comments can remain as they don't affect functionality.

---

## 📋 TODO - Future Improvements

### 1. Limit Rate of Scan
**Priority:** Medium

**Description:** Implement rate limiting for barcode scanning to prevent:
- Rapid duplicate scans
- API rate limit issues
- Excessive storage usage

**Suggested Implementation:**
- Add a debounce/throttle mechanism (e.g., 2-3 seconds between scans)
- Track last scan time and prevent scanning the same barcode within a short timeframe
- Consider user feedback (visual indicator) when rate limit is active

**Location:** `src/hooks/useBarcodeScanner.ts` or `src/screens/ScannerScreen.tsx`

---

### 2. Play Around with EAS vs Other Barcode Types on Fails
**Priority:** Low

**Description:** Experiment with barcode type detection order and fallback strategies when scanning fails.

**Current Implementation:**
- Scanner supports: `['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'code93']`
- All types are scanned simultaneously

**Suggested Improvements:**
- Test different barcode type priority orders
- Implement fallback scanning (try EAN-13 first, then others)
- Add retry mechanism with different barcode type focus
- Consider user feedback for failed scans with suggestions

**Location:** `src/screens/ScannerScreen.tsx` (line 336):
```typescript
barcodeScannerSettings={{
  barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'code93'],
}}
```

---

## 🔍 Verification Checklist

Before releasing, verify:

- [ ] DevTools component removed
- [ ] Test barcode removed from manual entry
- [ ] All app store URLs updated and tested
- [ ] "Coming soon" text removed from share message
- [ ] App name is "Food ID" everywhere (not "Food Scanner")
- [ ] Version number is correct in `app.json`
- [ ] Package name is `com.foodid` (Android)
- [ ] All TODO comments reviewed
- [ ] Test "Share the App" functionality
- [ ] Test "Rate the App" functionality
- [ ] Test manual barcode entry (should be empty, not pre-filled)
- [ ] Verify no test/debug UI elements visible

---

## 📝 Notes

- **Version:** Current version is `1.0.2` (check `app.json`)
- **Package Name:** `com.foodid` (already updated)
- **Slug:** `food-id` (already updated)
- **App Name:** "Food ID" (already updated)

---

**Last Updated:** Generated automatically - update this date when making changes.

