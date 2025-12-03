# OpenFoodFacts Multilingual Support

## Overview
The app now automatically uses the device's language to fetch product information from OpenFoodFacts in the user's preferred language.

## How It Works

### 1. **Language Detection**
- The app detects the device language using the `Intl` API
- Extracts the 2-letter language code (e.g., 'en', 'uk', 'fr', 'de')
- Located in: `src/lib/utils/language.ts`

### 2. **API Request**
- Adds `?lc={language}` parameter to OpenFoodFacts API requests
- Example: `https://world.openfoodfacts.org/api/v0/product/1234567890?lc=uk`
- This tells OpenFoodFacts to return translatable fields in the requested language

### 3. **What Gets Translated**
OpenFoodFacts automatically returns these fields in the requested language (when available):
- **Product name** (`product_name`)
- **Ingredients** (`ingredients_text_{lang}`)
- **Allergens** (tags with language prefix, e.g., `uk:milk`)
- **Labels** (tags with language prefix)

### 4. **Fallback Behavior**
- If a product doesn't have data in the requested language, OpenFoodFacts falls back to English
- The app handles this gracefully by using `ingredients_text` (language-specific) or `ingredients_text_en` (fallback)

## Supported Languages

OpenFoodFacts supports 100+ languages. Common ones include:
- English (en)
- Ukrainian (uk)
- French (fr)
- German (de)
- Spanish (es)
- Italian (it)
- Portuguese (pt)
- Dutch (nl)
- Polish (pl)
- Russian (ru)
- And many more...

## Implementation Details

### Files Modified:
1. **`src/lib/utils/language.ts`** - Language detection utility
2. **`src/lib/api/product.ts`** - Updated API call to include `?lc=` parameter
3. **`src/types/product.ts`** - Updated types to support language-specific fields

### Key Changes:
- API URL now includes: `?lc={deviceLanguage}`
- Ingredients parsing uses language-specific field with English fallback
- Allergen/label tags: Removes language prefix (e.g., `uk:milk` → `milk`)

## Testing

To test multilingual support:
1. Change your device language in Settings
2. Scan a product that has data in that language
3. Product name, ingredients, and allergens should appear in the device language

## Notes

- **Nutritional data** (calories, protein, etc.) is language-independent (numbers)
- **Product images** are universal
- If a product doesn't have translations, English is used automatically
- The app UI translation (buttons, labels) is separate and handled by your i18n system

