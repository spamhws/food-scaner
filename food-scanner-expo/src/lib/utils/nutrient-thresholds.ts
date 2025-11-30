/**
 * Industry standard thresholds for nutrients per 100g
 * Based on EU nutrition labeling regulations and health guidelines
 *
 * IMPORTANT: This file imports from nutrient-thresholds.json as the single source of truth.
 * To change threshold values, edit src/data/nutrient-thresholds.json
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nutrientThresholdsData = require('../../data/nutrient-thresholds.json');

// Extract thresholds from JSON (single source of truth)
export const NUTRIENT_THRESHOLDS = {
  calories: {
    low: nutrientThresholdsData.calories.low,
    high: nutrientThresholdsData.calories.high,
  },
  fat: { low: nutrientThresholdsData.fat.low, high: nutrientThresholdsData.fat.high },
  'saturated-fat': {
    low: nutrientThresholdsData['saturated-fat'].low,
    high: nutrientThresholdsData['saturated-fat'].high,
  },
  sugars: { low: nutrientThresholdsData.sugars.low, high: nutrientThresholdsData.sugars.high },
  salt: { low: nutrientThresholdsData.salt.low, high: nutrientThresholdsData.salt.high },
  proteins: {
    low: nutrientThresholdsData.proteins.low,
    high: nutrientThresholdsData.proteins.high,
  },
  fiber: { low: nutrientThresholdsData.fiber.low, high: nutrientThresholdsData.fiber.high },
  carbohydrates: {
    low: nutrientThresholdsData.carbohydrates.low,
    high: nutrientThresholdsData.carbohydrates.high,
  },
} as const;

export type NutrientLevel = 'low' | 'moderate' | 'high';

/**
 * Calculate nutrient level based on value and thresholds
 */
export function calculateNutrientLevel(
  value: number,
  thresholds: { low: number; high: number }
): NutrientLevel {
  if (value < thresholds.low) return 'low';
  if (value <= thresholds.high) return 'moderate';
  return 'high';
}
