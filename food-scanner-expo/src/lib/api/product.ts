import type { OpenFoodFactsResponse, Product } from '@/types/product';
import { API_URL } from '@/constants/endpoints';
import { parseNutrient, calculateNutritionScore } from '@/lib/utils/format';

export async function fetchProduct(
  barcode: string,
  isRetry: boolean = false
): Promise<Product | null> {
  if (!barcode) return null;

  try {
    const response = await fetch(`${API_URL}/api/v0/product/${barcode}`, {
      headers: {
        // User-Agent format: AppName/Version (ContactEmail)
        // This identifies your app to Open Food Facts, not individual users
        // Note: Your email will be visible to Open Food Facts servers
        // Consider using a dedicated app email instead of personal email
        'User-Agent': 'FoodScanner/1.0.1',
        // Alternative with email: 'FoodScanner/1.0.1 (your-app-email@example.com)'
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
      return fetchProduct(barcode.substring(1), true);
    }

    if (!data || data.status === 0 || !data.product) {
      // Return null instead of throwing - this is an expected case, not an error
      return null;
    }

    const product = data.product;

    // Check if nutrition grade is valid (a, b, c, d, e)
    // Use nutriscore_grade as primary source, fall back to nutrition_grades
    const rawGrade = (product.nutriscore_grade || product.nutrition_grades)?.toLowerCase();

    // Only consider grade valid if it's one of a, b, c, d, e
    // This automatically filters out "not-applicable", "unknown", undefined, etc.
    const validGrades = ['a', 'b', 'c', 'd', 'e'];
    const hasValidGrade = rawGrade && validGrades.includes(rawGrade);

    // Build the product object
    const transformedProduct: Product = {
      id: product._id,
      barcode,
      name: product.product_name || 'Unknown Product',
      brand: product.brands || '',
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
        ...(product.nutriments['added-sugars_100g'] && {
          addedSugars: parseNutrient(product.nutriments['added-sugars_100g']),
        }),
        protein: parseNutrient(product.nutriments.proteins_100g),
        salt: parseNutrient(product.nutriments.salt_100g),
        ...(product.nutriments.sodium_100g && {
          sodium: parseNutrient(product.nutriments.sodium_100g),
        }),
        fiber: parseNutrient(product.nutriments.fiber_100g),
      },
      // Only include assessment if we have a valid grade (a, b, c, d, e)
      ...(hasValidGrade && {
        assessment: {
          score: calculateNutritionScore(rawGrade),
          category: rawGrade.toUpperCase() as 'A' | 'B' | 'C' | 'D' | 'E',
        },
      }),
      // Include nutrient levels if available from API
      ...(product.nutrient_levels && {
        nutrientLevels: product.nutrient_levels,
      }),
      // Include Eco-Score if available (A-E)
      ...(product.ecoscore_grade &&
        ['a', 'b', 'c', 'd', 'e'].includes(product.ecoscore_grade.toLowerCase()) && {
          ecoscoreGrade: product.ecoscore_grade.toUpperCase() as 'A' | 'B' | 'C' | 'D' | 'E',
        }),
      // Include NOVA Score if available (1-4)
      ...(product.nova_group && product.nova_group >= 1 && product.nova_group <= 4 && {
        novascoreGrade: product.nova_group as 1 | 2 | 3 | 4,
      }),
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

    return transformedProduct;
  } catch (error) {
    // Only log unexpected errors, return null for expected cases
    console.error('Unexpected error fetching product:', error);
    return null;
  }
}
