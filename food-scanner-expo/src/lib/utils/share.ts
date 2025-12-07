import { Share, Platform, Alert } from 'react-native';
import type { Product } from '@/types/product';
import { APP_STORE_LINKS } from '@/constants/app-store';
import i18n from '@/lib/i18n';

export async function shareProduct(
  product: Product,
  t?: (key: string, options?: any) => string
): Promise<void> {
  const translate = (key: string, options?: any): string => {
    let translated: string;
    if (t) {
      translated = t(key);
    } else {
      const result = i18n.t(key);
      translated = typeof result === 'string' ? result : String(result);
    }

    // Manually replace placeholders with values (using single braces for consistency)
    if (options) {
      Object.keys(options).forEach((placeholder) => {
        translated = translated.replace(
          new RegExp(`\\{${placeholder}\\}`, 'g'),
          String(options[placeholder])
        );
      });
    }

    return translated;
  };
  try {
    const productTitle = product.brand ? `${product.name} - ${product.brand}` : product.name;
    const quantity = product.product_quantity
      ? `${product.product_quantity}${product.product_quantity_unit || ''}`
      : '';

    // Build nutritional information with all available nutrients
    const nutritionLines: string[] = [];
    nutritionLines.push(`📊 ${translate('share.nutritionalInformation')}`);

    if (product.nutrition.calories) {
      nutritionLines.push(
        `🔥 ${translate('share.calories', { value: product.nutrition.calories.per_100g })}`
      );
    }
    if (product.nutrition.protein) {
      nutritionLines.push(
        `🥩 ${translate('share.protein', { value: product.nutrition.protein.per_100g })}`
      );
    }
    if (product.nutrition.fat) {
      nutritionLines.push(
        `🧈 ${translate('share.fat', { value: product.nutrition.fat.per_100g })}`
      );
      if (product.nutrition.saturatedFat) {
        nutritionLines.push(
          `  └ ${translate('share.saturatedFat', {
            value: product.nutrition.saturatedFat.per_100g,
          })}`
        );
      }
    }
    if (product.nutrition.carbohydrates) {
      nutritionLines.push(
        `🌾 ${translate('share.carbohydrates', {
          value: product.nutrition.carbohydrates.per_100g,
        })}`
      );
      if (product.nutrition.sugars) {
        nutritionLines.push(
          `  └ ${translate('share.sugars', { value: product.nutrition.sugars.per_100g })}`
        );
      }
      if (product.nutrition.addedSugars) {
        nutritionLines.push(
          `  └ ${translate('share.addedSugars', { value: product.nutrition.addedSugars.per_100g })}`
        );
      }
    }
    if (product.nutrition.fiber) {
      nutritionLines.push(
        `🥕 ${translate('share.fiber', { value: product.nutrition.fiber.per_100g })}`
      );
    }
    if (product.nutrition.salt) {
      nutritionLines.push(
        `🧂 ${translate('share.salt', { value: product.nutrition.salt.per_100g })}`
      );
    } else if (product.nutrition.sodium) {
      nutritionLines.push(
        `🧂 ${translate('share.sodium', { value: product.nutrition.sodium.per_100g })}`
      );
    }

    const macros = nutritionLines.join('\n');
    const nutriScore = product.assessment?.category
      ? `\n\n🏆 ${translate('share.nutriScore', { grade: product.assessment.category })}`
      : '';
    const imageUrl = product.image
      ? `\n\n📷 ${translate('share.productImage')}\n${product.image}`
      : '';
    const appLinks = `\n\n📱 ${translate('share.getFoodId')}\n🍎 ${translate('share.appStore')}: ${
      APP_STORE_LINKS.ios
    }\n🤖 ${translate('share.googlePlay')}: ${APP_STORE_LINKS.android}`;
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
    Alert.alert(translate('alerts.shareError'), translate('alerts.unableToShareProduct'));
    throw error;
  }
}
