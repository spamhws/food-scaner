import axios from 'axios';
import type { Product } from '@/types/product';
import { NUTRITION_GRADES } from '@/constants/colors';
import { parseNutrient, calculateNutritionScore } from '@/lib/utils/format';

const OPEN_FOOD_FACTS_API = 'https://world.openfoodfacts.org/api/v2';

export async function fetchProduct(barcode: string): Promise<Product | null> {
  if (!barcode) return null;

  try {
    console.log(`Fetching product with barcode: ${barcode}`);

    // Call Open Food Facts API directly
    const response = await axios.get(`${OPEN_FOOD_FACTS_API}/product/${barcode}`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'FoodScanner-Mobile/1.0',
      },
    });

    console.log('Response received:', response.status);

    const data = response.data;

    if (!data || data.status === 0 || !data.product) {
      console.log('Product not found in Open Food Facts');
      throw new Error('Product not found');
    }

    const product = data.product;
    console.log('Product found:', product.product_name);

    // Get nutrition grade, default to 'e' if not available
    let grade = (product.nutrition_grades || 'e').toLowerCase();
    if (!NUTRITION_GRADES[grade]) {
      console.warn(`Invalid grade: ${grade}, defaulting to 'e'`);
      grade = 'e';
    }

    return {
      id: product._id || barcode,
      barcode,
      name: product.product_name || 'Unknown Product',
      brand: product.brands || 'Unknown Brand',
      image: product.image_url || product.image_front_url || '',
      imageSmall: product.image_front_small_url || product.image_small_url || product.image_url || '',
      product_quantity: product.product_quantity || product.quantity || '',
      product_quantity_unit: product.product_quantity_unit || 'g',
      nutrition: {
        calories: {
          value: parseFloat(product.nutriments?.['energy-kcal_100g'] || product.nutriments?.['energy-kcal'] || '0'),
          unit: 'kcal',
          per_100g: parseFloat(product.nutriments?.['energy-kcal_100g'] || product.nutriments?.['energy-kcal'] || '0'),
        },
        fat: parseNutrient(product.nutriments?.fat_100g || product.nutriments?.fat),
        saturatedFat: parseNutrient(product.nutriments?.['saturated-fat_100g'] || product.nutriments?.['saturated-fat']),
        carbohydrates: parseNutrient(product.nutriments?.carbohydrates_100g || product.nutriments?.carbohydrates),
        sugars: parseNutrient(product.nutriments?.sugars_100g || product.nutriments?.sugars),
        protein: parseNutrient(product.nutriments?.proteins_100g || product.nutriments?.proteins),
        salt: parseNutrient(product.nutriments?.salt_100g || product.nutriments?.salt),
        fiber: parseNutrient(product.nutriments?.fiber_100g || product.nutriments?.fiber),
      },
      assessment: {
        score: calculateNutritionScore(grade),
        category: grade.toUpperCase() as 'A' | 'B' | 'C' | 'D' | 'E',
        color: NUTRITION_GRADES[grade].color,
        description: NUTRITION_GRADES[grade].description,
      },
      ingredients: product.ingredients_text_en ? product.ingredients_text_en.split(',').map((i: string) => i.trim()) : product.ingredients_text ? product.ingredients_text.split(',').map((i: string) => i.trim()) : [],
      allergens: product.allergens_tags ? product.allergens_tags.map((a: string) => a.replace('en:', '').replace(/_/g, ' ')) : [],
      labels: product.labels_tags ? product.labels_tags.map((l: string) => l.replace('en:', '').replace(/_/g, ' ')) : [],
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error fetching product:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
      });
    } else {
      console.error('Error fetching product:', error);
    }
    throw error;
  }
}
