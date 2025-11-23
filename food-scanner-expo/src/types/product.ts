export interface Nutrient {
  value: number;
  unit: string;
  per_100g: number;
}

export interface NutritionData {
  calories: Nutrient;
  fat: Nutrient;
  saturatedFat: Nutrient;
  carbohydrates: Nutrient;
  sugars: Nutrient;
  protein: Nutrient;
  salt: Nutrient;
  fiber: Nutrient;
}

export interface Assessment {
  score: number;
  category: 'A' | 'B' | 'C' | 'D' | 'E';
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  image: string;
  imageSmall: string;
  product_quantity: string;
  product_quantity_unit: string;
  nutrition: NutritionData;
  assessment?: Assessment; // Optional - only present if nutrition grade is valid (A-E)
  ingredients: string[];
  allergens: string[];
  labels: string[];
}

export interface OpenFoodFactsResponse {
  status: number;
  product: {
    _id: string;
    product_name: string;
    brands: string;
    image_url: string;
    image_front_small_url: string;
    product_quantity: string;
    product_quantity_unit: string;
    nutrition_grades: string;
    nutriscore_grade?: string; // More reliable than nutrition_grades
    nutriscore_score?: number; // 0 means not calculated
    nutriments: {
      'energy-kcal_100g': string;
      fat_100g: string;
      'saturated-fat_100g': string;
      carbohydrates_100g: string;
      sugars_100g: string;
      proteins_100g: string;
      salt_100g: string;
      fiber_100g: string;
    };
    ingredients_text_en: string;
    allergens_tags: string[];
    labels_tags: string[];
  };
}

