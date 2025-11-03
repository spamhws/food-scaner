import type { Nutrient } from '@/types/product';

export function parseNutrient(value: string | number | undefined): Nutrient {
  const numValue = typeof value === 'string' ? parseFloat(value) : value || 0;
  return {
    value: numValue,
    unit: 'g',
    per_100g: numValue,
  };
}

export function calculateNutritionScore(grade: string): number {
  const scores: Record<string, number> = {
    a: 90,
    b: 75,
    c: 50,
    d: 30,
    e: 10,
  };
  return scores[grade.toLowerCase()] || 10;
}

export function formatNutrient(nutrient: Nutrient | undefined, decimals: number = 1): string {
  if (!nutrient) return '0';
  return nutrient.value.toFixed(decimals);
}

