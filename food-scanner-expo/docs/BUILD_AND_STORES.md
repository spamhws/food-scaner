# Building & uploading to stores

## Your current config

- **Expo**: SDK 54
- **App**: Food ID (`food-scanner-expo`), version **1.0.3**
- **EAS**: Project linked (`projectId` in `app.json`)
- **Android**: `com.uxuiua.foodid`, adaptive icon + splash configured
- **iOS**: `com.uxuiua.foodid`, camera permission + non‑exempt encryption set
- **EAS Build profiles**: `development`, `preview`, `production`
- **EAS Submit**: Android production uses `access-keys/food-id-app-google.json` (internal track)

---

## 1. Prerequisites

- **Expo / EAS CLI** (use latest):
  ```bash
  npx eas-cli@latest --version
  ```
- **Expo account**: logged in (`npx eas login`).
- **Apple Developer** (for iOS): paid account, App Store Connect app created.
- **Google Play** (for Android): developer account, app created in Play Console.

---

## 2. Build for Android and iOS

From the **`food-scanner-expo`** directory:

```bash
cd food-scanner-expo
```

**Production builds (store-ready):**

```bash
# Both platforms
npx eas build --platform all --profile production

# Or one at a time
npx eas build --platform android --profile production
npx eas build --platform ios --profile production
```

- Builds run on EAS servers (no need for Xcode/Android Studio for the build itself).
- When finished, EAS shows a link to the build; you can download the artifact from the Expo dashboard or the link in the terminal.

**What you get:**

- **Android**: `.aab` (Android App Bundle) — use this for Play Store.
- **iOS**: `.ipa` — use this for App Store (e.g. via Transporter or Xcode).

**Other profiles (optional):**

- `preview`: internal distribution, Android APK.
- `development`: dev client + Android APK or iOS simulator.

---

## 3. Upload to the stores (manually)

### Android (Google Play)

1. Go to [Google Play Console](https://play.google.com/console/) → your app → **Release** → **Production** (or **Internal testing**).
2. **Create new release** → upload the **`.aab`** you downloaded from EAS.
3. Set version name/code if needed (EAS can auto-increment; see `eas.json`).
4. Add release notes, then **Review and roll out**.

You can also use EAS Submit to upload the same build without doing it in the browser:

```bash
npx eas submit --platform android --latest --profile production
```

(Requires `access-keys/food-id-app-google.json` for automated submit.)

---

### iOS (App Store)

1. **Download the `.ipa`** from the EAS build page.
2. **Upload to App Store Connect**:
   - **Option A – Transporter** (easiest): Install [Transporter](https://apps.apple.com/app/transporter/id1450874784) on Mac → open the `.ipa` → Deliver.
   - **Option B – Xcode**: Open **Xcode → Window → Organizer** → drag the `.ipa` into the archive list, then **Distribute App** → **App Store Connect**.
3. In [App Store Connect](https://appstoreconnect.apple.com/): select your app → **TestFlight** or **App Store** tab → build appears after processing; attach it to a version and submit for review.

**First-time iOS:**  
Ensure in App Store Connect you have an app with bundle ID `com.uxuiua.foodid`, and that the first upload is done with the same bundle ID and version/build number.

---

## 4. Version and build number

- **Version** (`version` in `app.json`): e.g. `1.0.3` — user-facing.
- **Build number**: EAS can auto-increment for production (`"autoIncrement": true` in `eas.json`).

To bump the app version yourself, edit `app.json`:

```json
"version": "1.0.4"
```

Then run a new production build. For iOS, the build number is incremented automatically by EAS when `autoIncrement` is true.

---

## 5. Quick reference

| Task           | Command                                                                                              |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| Build Android  | `npx eas build --platform android --profile production`                                              |
| Build iOS      | `npx eas build --platform ios --profile production`                                                  |
| Build both     | `npx eas build --platform all --profile production`                                                  |
| Submit Android | `npx eas submit --platform android --latest --profile production` (or upload `.aab` in Play Console) |
| Submit iOS     | Upload downloaded `.ipa` via Transporter or Xcode Organizer                                          |

For manual store upload, use the **downloaded `.aab` (Android)** and **`.ipa` (iOS)** from the EAS build page and follow the store steps above.
