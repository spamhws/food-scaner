# Translation Strategy for Food ID App

## Overview
This document outlines the translation strategy for the Food ID mobile application.

## Recommended Approach

### 1. **i18n Library: react-i18next**
- Industry standard for React Native
- Works well with Expo
- Supports JSON-based translations
- Easy to integrate with existing codebase

### 2. **Translation File Structure**
```
src/translations/
  ├── en.json (English - base)
  ├── uk.json (Ukrainian)
  ├── de.json (German)
  └── ... (other languages)
```

### 3. **Implementation Steps**

1. **Install dependencies:**
   ```bash
   npm install react-i18next i18next
   ```

2. **Create translation hook:**
   - `src/hooks/useTranslation.ts` - Wrapper around react-i18next

3. **Replace hardcoded strings:**
   - Replace all `"text"` with `t('key')` calls
   - Use nested keys for organization (e.g., `t('scanner.loadingCamera')`)

4. **Handle dynamic content:**
   - Use interpolation: `t('settings.shareMessage', { iosLink, androidLink })`
   - For FAQ/Privacy/User Agreement: Keep as separate JSON files per language

### 4. **Translation File Organization**

The `en.json` file is organized by:
- **common**: Shared strings (buttons, actions)
- **navigation**: Screen titles
- **scanner**: Scanner screen strings
- **product**: Product-related messages
- **nutrition**: Nutrition labels
- **scores**: Health score descriptions
- **characteristics**: Product assessments
- **history/favourites**: Screen-specific content
- **settings**: Settings screen
- **alerts**: Alert messages

### 5. **Special Considerations**

- **FAQ, Privacy Policy, User Agreement**: These are large documents. Consider:
  - Option A: Keep as separate JSON files per language (`src/data/faq.{lang}.json`)
  - Option B: Include in main translation file (may be large)
  - **Recommendation**: Option A for better maintainability

- **Dynamic content**: Product names, brands, ingredients come from OpenFoodFacts API (already multilingual)

- **Numbers/Units**: Keep as-is (universal)

### 6. **Translation Workflow**

1. Export `en.json` (already created)
2. Translate using AI/translator
3. Create `{lang}.json` files
4. Implement i18n system
5. Replace hardcoded strings
6. Test with language switcher (if needed)

## Next Steps

1. Review `src/translations/en.json` - all strings extracted
2. Translate to target languages
3. Install and configure react-i18next
4. Replace hardcoded strings throughout app
5. Test translations

