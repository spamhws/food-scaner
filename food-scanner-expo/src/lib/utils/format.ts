import type { Nutrient } from '@/types/product';

export function parseNutrient(value: string | number | undefined): Nutrient {
  const numValue = typeof value === 'string' ? parseFloat(value) : value || 0;
  return {
    value: numValue,
    unit: 'g',
    per_100g: numValue,
  };
}

/**
 * Check if a nutrient value is actually provided (not just defaulted to 0)
 * Returns true if the value exists and is a valid number (even if 0)
 */
export function isNutrientValueProvided(value: string | number | undefined): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') return false;
    const numValue = parseFloat(trimmed);
    return !isNaN(numValue);
  }
  if (typeof value === 'number') {
    return !isNaN(value);
  }
  return false;
}

export function calculateNutritionScore(grade: string): number {
  const scores: Record<string, number> = {
    a: 90,
    b: 75,
    c: 50,
    d: 30,
    e: 10,
  };
  return scores[grade.toLowerCase()] || 0;
}

export function formatNutrient(nutrient: Nutrient | undefined, decimals: number = 1): string {
  if (!nutrient) return '0';
  return nutrient.value.toFixed(decimals);
}
