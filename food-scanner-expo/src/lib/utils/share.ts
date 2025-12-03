import { Share, Platform, Alert } from 'react-native';
import type { Product } from '@/types/product';
import { APP_STORE_LINKS } from '@/constants/app-store';

export async function shareProduct(product: Product): Promise<void> {
  try {
    const productTitle = product.brand ? `${product.name} - ${product.brand}` : product.name;
    const quantity = product.product_quantity
      ? `${product.product_quantity}${product.product_quantity_unit || ''}`
      : '';

    // Build nutritional information with all available nutrients
    const nutritionLines: string[] = [];
    nutritionLines.push('📊 Nutritional Information (per 100g):');

    if (product.nutrition.calories) {
      nutritionLines.push(`🔥 Calories: ${product.nutrition.calories.per_100g} kcal`);
    }
    if (product.nutrition.protein) {
      nutritionLines.push(`🥩 Protein: ${product.nutrition.protein.per_100g}g`);
    }
    if (product.nutrition.fat) {
      nutritionLines.push(`🧈 Fat: ${product.nutrition.fat.per_100g}g`);
      if (product.nutrition.saturatedFat) {
        nutritionLines.push(`  └ Saturated Fat: ${product.nutrition.saturatedFat.per_100g}g`);
      }
    }
    if (product.nutrition.carbohydrates) {
      nutritionLines.push(`🌾 Carbohydrates: ${product.nutrition.carbohydrates.per_100g}g`);
      if (product.nutrition.sugars) {
        nutritionLines.push(`  └ Sugars: ${product.nutrition.sugars.per_100g}g`);
      }
      if (product.nutrition.addedSugars) {
        nutritionLines.push(`  └ Added Sugars: ${product.nutrition.addedSugars.per_100g}g`);
      }
    }
    if (product.nutrition.fiber) {
      nutritionLines.push(`🥕 Fiber: ${product.nutrition.fiber.per_100g}g`);
    }
    if (product.nutrition.salt) {
      nutritionLines.push(`🧂 Salt: ${product.nutrition.salt.per_100g}g`);
    } else if (product.nutrition.sodium) {
      nutritionLines.push(`🧂 Sodium: ${product.nutrition.sodium.per_100g}g`);
    }

    const macros = nutritionLines.join('\n');
    const nutriScore = product.assessment?.category
      ? `\n\n🏆 Nutri-Score: ${product.assessment.category}`
      : '';
    const imageUrl = product.image ? `\n\n📷 Product Image:\n${product.image}` : '';
    const appLinks = `\n\n📱 Get Food ID:\n🍎 App Store: ${APP_STORE_LINKS.ios}\n🤖 Google Play: ${APP_STORE_LINKS.android}`;
    const message = `${productTitle}${
      quantity ? ` (${quantity})` : ''
    }\n\n${macros}${nutriScore}${imageUrl}${appLinks}`;

    const shareOptions: any = {
      message: Platform.OS === 'android' ? message : message,
      title: productTitle,
    };

    if (Platform.OS === 'android' && product.image) {
      shareOptions.url = product.image;
    }

    await Share.share(shareOptions);
  } catch (error: any) {
    Alert.alert('Share Error', 'Unable to share product. Please try again.');
    throw error;
  }
}
