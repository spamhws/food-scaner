/**
 * App Store Links
 * Update these links when the app is published to the stores
 */

export const APP_STORE_LINKS = {
  ios: 'https://apps.apple.com/app/food-id', // TODO: Update with actual App Store link
  android: 'https://play.google.com/store/apps/details?id=com.foodid', // TODO: Update with actual Play Store link
} as const;

/**
 * App Store Review/Feedback Links
 * These open the app store review page directly
 */
export const APP_STORE_REVIEW_LINKS = {
  ios: 'itms-apps://apps.apple.com/app/id?action=write-review', // TODO: Update with actual App ID
  android: 'market://details?id=com.foodid',
} as const;

