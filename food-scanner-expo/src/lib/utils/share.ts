import { Share, Platform, Alert } from 'react-native';
import type { Product } from '@/types/product';

export async function shareProduct(product: Product): Promise<void> {
  try {
    const productTitle = product.brand ? `${product.name} - ${product.brand}` : product.name;
    const quantity = product.product_quantity
      ? `${product.product_quantity}${product.product_quantity_unit || ''}`
      : '';
    const macros = `
📊 Nutritional Information (per 100g):
🔥 Calories: ${product.nutrition.calories?.per_100g || 'N/A'} kcal
🥚 Protein: ${product.nutrition.protein?.per_100g || 'N/A'}g
💧 Fat: ${product.nutrition.fat?.per_100g || 'N/A'}g
🌾 Carbs: ${product.nutrition.carbohydrates?.per_100g || 'N/A'}g`;
    const nutriScore = product.assessment?.category
      ? `\n\n🏆 Nutri-Score: ${product.assessment.category}`
      : '';
    const imageUrl = product.image ? `\n\n📷 Product Image:\n${product.image}` : '';
    const appLink = '\n\n📱 Get FoodScanner:\nhttps://apps.apple.com/foodscanner (coming soon)';
    const message = `${productTitle}${quantity ? ` (${quantity})` : ''}${macros}${nutriScore}${imageUrl}${appLink}`;

    const shareOptions: any = {
      message: Platform.OS === 'android' ? message : message,
      title: productTitle,
    };

    if (Platform.OS === 'android' && product.image) {
      shareOptions.url = product.image;
    }

    await Share.share(shareOptions);
  } catch (error: any) {
    console.error('Error sharing:', error);
    Alert.alert('Share Error', 'Unable to share product. Please try again.');
    throw error;
  }
}

