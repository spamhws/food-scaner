import type { OpenFoodFactsResponse, Product } from '@/types/product';
import { API_URL } from '@/constants/endpoints';
import { NUTRITION_GRADES } from '@/constants/colors';
import { parseNutrient, calculateNutritionScore } from '@/lib/utils/format';

export async function fetchProduct(
  barcode: string,
  isRetry: boolean = false
): Promise<Product | null> {
  if (!barcode) return null;

  try {
    console.log('Fetching product for barcode:', barcode);
    const response = await fetch(`${API_URL}/api/v0/product/${barcode}`, {
      headers: {
        'User-Agent': 'FoodScanner/1.0.0',
      },
    });

    if (!response.ok) {
      // Network/server error - return null instead of throwing
      return null;
    }

    const data = (await response.json()) as OpenFoodFactsResponse;


    // If product not found and this is a 13-digit EAN-13 starting with 0, try UPC-A format
    if (
      (!data || data.status === 0 || !data.product) &&
      !isRetry &&
      barcode.length === 13 &&
      barcode.startsWith('0')
    ) {
      console.log('Product not found with EAN-13, trying UPC-A format (removing leading 0)...');
      return fetchProduct(barcode.substring(1), true);
    }

    if (!data || data.status === 0 || !data.product) {
      // Return null instead of throwing - this is an expected case, not an error
      return null;
    }

    const product = data.product;
    let grade = (product.nutrition_grades || 'e').toLowerCase();
    if (!NUTRITION_GRADES[grade]) {
      console.warn(`Invalid grade: ${grade}, defaulting to 'e'`);
      grade = 'e';
    }

    return {
      id: product._id,
      barcode,
      name: product.product_name || 'Unknown Product',
      brand: product.brands || 'Unknown Brand',
      image: product.image_url || '',
      imageSmall: product.image_front_small_url || product.image_url || '',
      product_quantity: product.product_quantity || '',
      product_quantity_unit: product.product_quantity_unit || 'g',
      nutrition: {
        calories: {
          value: parseFloat(product.nutriments['energy-kcal_100g'] || '0'),
          unit: 'kcal',
          per_100g: parseFloat(product.nutriments['energy-kcal_100g'] || '0'),
        },
        fat: parseNutrient(product.nutriments.fat_100g),
        saturatedFat: parseNutrient(product.nutriments['saturated-fat_100g']),
        carbohydrates: parseNutrient(product.nutriments.carbohydrates_100g),
        sugars: parseNutrient(product.nutriments.sugars_100g),
        protein: parseNutrient(product.nutriments.proteins_100g),
        salt: parseNutrient(product.nutriments.salt_100g),
        fiber: parseNutrient(product.nutriments.fiber_100g),
      },
      assessment: {
        score: calculateNutritionScore(grade),
        category: grade.toUpperCase() as 'A' | 'B' | 'C' | 'D' | 'E',
        color: NUTRITION_GRADES[grade].color,
        description: NUTRITION_GRADES[grade].description,
      },
      ingredients: product.ingredients_text_en
        ? product.ingredients_text_en.split(',').map((i: string) => i.trim())
        : [],
      allergens: product.allergens_tags
        ? product.allergens_tags.map((a: string) => a.replace('en:', ''))
        : [],
      labels: product.labels_tags
        ? product.labels_tags.map((l: string) => l.replace('en:', ''))
        : [],
    };
  } catch (error) {
    // Only log unexpected errors, return null for expected cases
    console.error('Unexpected error fetching product:', error);
    return null;
  }
}
