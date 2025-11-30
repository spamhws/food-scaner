/**
 * Centralized asset imports
 * This makes it easier to import images and videos throughout the app
 */

export const Images = {
  emptyBasket: require('../../assets/cta/empty-basket.png'),
  brokenHeart: require('../../assets/cta/broken-heart.png'),
} as const;

export const Videos = {
  handPhone: require('../../assets/cta/hand_phone.mp4'),
} as const;
