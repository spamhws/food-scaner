import type { Product } from '@/types/product';

/**
 * Calculate NutriScore based on the official algorithm
 * Returns null if insufficient data is available
 *
 * Algorithm:
 * - Negative points (0-10): Energy, Saturated fat, Sugars, Sodium
 * - Positive points (0-5): Fiber, Protein (fruits/veg/nuts not available without ingredients)
 * - Final score = Negative - Positive
 * - Grade: A (-15 to -1), B (0-2), C (3-10), D (11-18), E (19-40)
 */
export function calculateNutriScore(
  product: Product
): { score: number; category: 'A' | 'B' | 'C' | 'D' | 'E' } | null {
  const nutrition = product.nutrition;

  // Count how many nutrients are actually provided (not just defaulted to 0)
  // We need at least 3 nutrients to calculate a reliable NutriScore
  const providedNutrients: string[] = [];

  // Count provided nutrients (if they exist, they were provided by API)
  if (nutrition.calories) providedNutrients.push('calories');
  if (nutrition.saturatedFat) providedNutrients.push('saturatedFat');
  if (nutrition.sugars) providedNutrients.push('sugars');
  if (nutrition.salt) providedNutrients.push('salt');
  if (nutrition.sodium) providedNutrients.push('sodium');
  if (nutrition.fiber) providedNutrients.push('fiber');
  if (nutrition.protein) providedNutrients.push('protein');

  // Need at least 3 nutrients to calculate
  if (providedNutrients.length < 3) {
    return null;
  }

  // Need at least calories, saturated fat, sugars, and salt/sodium for basic calculation
  if (
    !nutrition.calories ||
    !nutrition.saturatedFat ||
    !nutrition.sugars ||
    (!nutrition.salt && !nutrition.sodium)
  ) {
    return null;
  }

  // Extract required nutrients (TypeScript now knows they're defined)
  const calories = nutrition.calories;
  const saturatedFat = nutrition.saturatedFat;
  const sugars = nutrition.sugars;

  // Calculate negative points (0-10 each, max 40 total)
  let negativePoints = 0;

  // Energy (kcal/100g) - 0 to 10 points
  const energy = calories.per_100g;
  if (energy >= 3350) negativePoints += 10;
  else if (energy >= 3015) negativePoints += 9;
  else if (energy >= 2680) negativePoints += 8;
  else if (energy >= 2345) negativePoints += 7;
  else if (energy >= 2010) negativePoints += 6;
  else if (energy >= 1675) negativePoints += 5;
  else if (energy >= 1340) negativePoints += 4;
  else if (energy >= 1005) negativePoints += 3;
  else if (energy >= 670) negativePoints += 2;
  else if (energy >= 335) negativePoints += 1;

  // Saturated fat (g/100g) - 0 to 10 points
  const saturatedFatValue = saturatedFat.per_100g;
  if (saturatedFatValue >= 10) negativePoints += 10;
  else if (saturatedFatValue >= 9) negativePoints += 9;
  else if (saturatedFatValue >= 8) negativePoints += 8;
  else if (saturatedFatValue >= 7) negativePoints += 7;
  else if (saturatedFatValue >= 6) negativePoints += 6;
  else if (saturatedFatValue >= 5) negativePoints += 5;
  else if (saturatedFatValue >= 4) negativePoints += 4;
  else if (saturatedFatValue >= 3) negativePoints += 3;
  else if (saturatedFatValue >= 2) negativePoints += 2;
  else if (saturatedFatValue >= 1) negativePoints += 1;

  // Sugars (g/100g) - 0 to 10 points
  const sugarsValue = sugars.per_100g;
  if (sugarsValue >= 45) negativePoints += 10;
  else if (sugarsValue >= 40) negativePoints += 9;
  else if (sugarsValue >= 36) negativePoints += 8;
  else if (sugarsValue >= 31) negativePoints += 7;
  else if (sugarsValue >= 27) negativePoints += 6;
  else if (sugarsValue >= 22.5) negativePoints += 5;
  else if (sugarsValue >= 18) negativePoints += 4;
  else if (sugarsValue >= 13.5) negativePoints += 3;
  else if (sugarsValue >= 9) negativePoints += 2;
  else if (sugarsValue >= 4.5) negativePoints += 1;

  // Sodium (mg/100g) - convert from salt if needed
  // Salt (g) * 1000 / 2.5 = Sodium (mg)
  let sodiumMg = 0;
  if (nutrition.sodium) {
    sodiumMg = nutrition.sodium.per_100g * 1000; // Convert g to mg
  } else if (nutrition.salt) {
    sodiumMg = (nutrition.salt.per_100g * 1000) / 2.5; // Convert salt to sodium
  }

  // Sodium points (0 to 10)
  if (sodiumMg >= 900) negativePoints += 10;
  else if (sodiumMg >= 810) negativePoints += 9;
  else if (sodiumMg >= 720) negativePoints += 8;
  else if (sodiumMg >= 630) negativePoints += 7;
  else if (sodiumMg >= 540) negativePoints += 6;
  else if (sodiumMg >= 450) negativePoints += 5;
  else if (sodiumMg >= 360) negativePoints += 4;
  else if (sodiumMg >= 270) negativePoints += 3;
  else if (sodiumMg >= 180) negativePoints += 2;
  else if (sodiumMg >= 90) negativePoints += 1;

  // Calculate positive points (0-5 total, max 5)
  let positivePoints = 0;

  // Fiber (g/100g) - 0 to 5 points
  if (nutrition.fiber) {
    const fiber = nutrition.fiber.per_100g;
    if (fiber >= 4.7) positivePoints += 5;
    else if (fiber >= 3.7) positivePoints += 4;
    else if (fiber >= 2.8) positivePoints += 3;
    else if (fiber >= 1.9) positivePoints += 2;
    else if (fiber >= 0.9) positivePoints += 1;
  }

  // Protein (g/100g) - 0 to 5 points
  if (nutrition.protein) {
    const protein = nutrition.protein.per_100g;
    if (protein >= 8) positivePoints += 5;
    else if (protein >= 6.4) positivePoints += 4;
    else if (protein >= 4.8) positivePoints += 3;
    else if (protein >= 3.2) positivePoints += 2;
    else if (protein >= 1.6) positivePoints += 1;
  }

  // Note: Fruits/vegetables/nuts points (0-5) are not calculated
  // as we don't have ingredient percentage data
  // This means our calculated score may be slightly less accurate
  // but still provides a reasonable estimate

  // Calculate final score: Negative - Positive
  const finalScore = negativePoints - positivePoints;

  // Map score to grade
  // A: -15 to -1, B: 0-2, C: 3-10, D: 11-18, E: 19-40
  let category: 'A' | 'B' | 'C' | 'D' | 'E';
  if (finalScore <= -1) {
    category = 'A';
  } else if (finalScore <= 2) {
    category = 'B';
  } else if (finalScore <= 10) {
    category = 'C';
  } else if (finalScore <= 18) {
    category = 'D';
  } else {
    category = 'E';
  }

  return {
    score: finalScore,
    category,
  };
}
