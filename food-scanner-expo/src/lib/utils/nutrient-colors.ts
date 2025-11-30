import type { NutrientLevels, NutritionData } from '@/types/product';
import {
  NUTRIENT_THRESHOLDS,
  calculateNutrientLevel,
  type NutrientLevel,
} from './nutrient-thresholds';
import { getTailwindColor } from './tailwind-colors';

/**
 * Get nutrient level from API data or calculate from value
 * Returns null if insufficient data
 */
export function getNutrientLevel(
  nutrientLevels: NutrientLevels | undefined,
  nutrientKey: keyof NutrientLevels,
  per100g: number | undefined
): NutrientLevel | null {
  // First, try to use API-provided nutrient_levels
  if (nutrientLevels && nutrientLevels[nutrientKey]) {
    return nutrientLevels[nutrientKey] as NutrientLevel;
  }

  // If API data not available, calculate from value
  if (per100g === undefined || per100g === null || isNaN(per100g)) {
    return null; // Insufficient data
  }

  const thresholds = NUTRIENT_THRESHOLDS[nutrientKey];
  if (!thresholds) {
    return null; // No thresholds defined for this nutrient
  }

  return calculateNutrientLevel(per100g, thresholds);
}

/**
 * Get hex color value for a nutrient level
 * Uses Tailwind color values from config
 */
function getColorForLevel(level: NutrientLevel, isPositiveNutrient: boolean = false): string {
  if (isPositiveNutrient) {
    // For proteins and fiber: high is good
    return level === 'high' ? getTailwindColor('green-60') : getTailwindColor('gray-60');
  }
  // For most nutrients: low is good, high is bad
  switch (level) {
    case 'low':
      return getTailwindColor('green-60');
    case 'moderate':
      return getTailwindColor('orange-500');
    case 'high':
      return getTailwindColor('red-60');
    default:
      return getTailwindColor('gray-60');
  }
}

/**
 * Get per_100g value for a nutrient from nutrition data
 */
function getPer100g(
  nutrientKey: keyof NutrientLevels,
  nutritionData?: NutritionData
): number | undefined {
  if (!nutritionData) return undefined;

  switch (nutrientKey) {
    case 'proteins':
      return nutritionData.protein?.per_100g;
    case 'fat':
      return nutritionData.fat?.per_100g;
    case 'saturated-fat':
      return nutritionData.saturatedFat?.per_100g;
    case 'carbohydrates':
      return nutritionData.carbohydrates?.per_100g;
    case 'sugars':
      return nutritionData.sugars?.per_100g;
    case 'salt':
      return nutritionData.salt?.per_100g;
    case 'fiber':
      return nutritionData.fiber?.per_100g;
    default:
      return undefined;
  }
}

/**
 * Get hex color value for any nutrient icon
 * Components should use this with stroke prop on Tabler icons
 */
export function getNutrientColor(
  nutrientLevels: NutrientLevels | undefined,
  nutrientKey: keyof NutrientLevels,
  nutritionData?: NutritionData
): string {
  const per100g = getPer100g(nutrientKey, nutritionData);
  const level = getNutrientLevel(nutrientLevels, nutrientKey, per100g);

  if (!level) {
    return getTailwindColor('gray-60'); // Insufficient data
  }

  const isPositiveNutrient = nutrientKey === 'proteins' || nutrientKey === 'fiber';
  return getColorForLevel(level, isPositiveNutrient);
}

/**
 * Get hex color value for calories icon
 * Components should use this with stroke prop on Tabler icons
 */
export function getCaloriesColor(
  nutrientLevels: NutrientLevels | undefined,
  nutritionData?: NutritionData
): string {
  const per100g = nutritionData?.calories?.per_100g;

  // Calories don't have nutrient_levels in API, so we always calculate
  if (per100g === undefined || per100g === null || isNaN(per100g)) {
    return getTailwindColor('gray-60'); // Insufficient data
  }

  const thresholds = NUTRIENT_THRESHOLDS.calories;
  const level = calculateNutrientLevel(per100g, thresholds);
  return getColorForLevel(level, false);
}
