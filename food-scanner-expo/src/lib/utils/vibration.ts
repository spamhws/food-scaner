import * as Haptics from 'expo-haptics';

/**
 * Vibrate when product is successfully found
 */
export function vibrateProductFound() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

/**
 * Vibrate when product is not found (2 very short vibrations)
 */
export function vibrateProductNotFound() {
  // Two error notifications with short delay
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  setTimeout(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, 250); // Very short delay between vibrations
}
