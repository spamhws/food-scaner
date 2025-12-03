import type { Product } from '@/types/product';
import { calculateNutriScore } from './nutriscore-calculator';

/**
 * Calculate badge grade for display purposes only
 * This is separate from official NutriScore and should not be saved
 * Returns null if insufficient data or if official NutriScore exists
 */
export function calculateBadgeGrade(product: Product): 'A' | 'B' | 'C' | 'D' | 'E' | null {
  // If official NutriScore exists, use it
  if (product.assessment) {
    return product.assessment.category;
  }

  // Otherwise, calculate on-the-fly for badge display only
  const calculated = calculateNutriScore(product);
  return calculated ? calculated.category : null;
}

