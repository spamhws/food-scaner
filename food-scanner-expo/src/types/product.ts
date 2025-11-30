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
  addedSugars?: Nutrient; // Optional - not always available
  protein: Nutrient;
  salt: Nutrient;
  sodium?: Nutrient; // Optional - can be calculated from salt or provided by API
  fiber: Nutrient;
}

export interface Assessment {
  score: number;
  category: 'A' | 'B' | 'C' | 'D' | 'E';
}

export interface NutrientLevels {
  fat?: 'low' | 'moderate' | 'high';
  'saturated-fat'?: 'low' | 'moderate' | 'high';
  sugars?: 'low' | 'moderate' | 'high';
  salt?: 'low' | 'moderate' | 'high';
  fiber?: 'low' | 'moderate' | 'high';
  proteins?: 'low' | 'moderate' | 'high';
  carbohydrates?: 'low' | 'moderate' | 'high';
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
  nutrientLevels?: NutrientLevels; // Optional - from OpenFoodFacts API
  ecoscoreGrade?: 'A' | 'B' | 'C' | 'D' | 'E'; // Optional - Eco-Score grade
  novascoreGrade?: 1 | 2 | 3 | 4; // Optional - NOVA score (1-4)
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
    ecoscore_grade?: string; // Eco-Score grade (A-E)
    nova_group?: number; // NOVA score (1-4)
    nutriments: {
      'energy-kcal_100g': string;
      fat_100g: string;
      'saturated-fat_100g': string;
      carbohydrates_100g: string;
      sugars_100g: string;
      'added-sugars_100g'?: string; // Optional
      proteins_100g: string;
      salt_100g: string;
      sodium_100g?: string; // Optional
      fiber_100g: string;
    };
    nutrient_levels?: {
      fat?: 'low' | 'moderate' | 'high';
      'saturated-fat'?: 'low' | 'moderate' | 'high';
      sugars?: 'low' | 'moderate' | 'high';
      salt?: 'low' | 'moderate' | 'high';
      fiber?: 'low' | 'moderate' | 'high';
      proteins?: 'low' | 'moderate' | 'high';
      carbohydrates?: 'low' | 'moderate' | 'high';
    };
    ingredients_text_en: string;
    allergens_tags: string[];
    labels_tags: string[];
  };
}
