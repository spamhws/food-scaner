import type { Product } from '@/types/product';

export interface Assessment {
  type: 'positive' | 'negative';
  label: string;
}

/**
 * Generates a list of positive and negative assessments based on nutrition data
 */
export function generateAssessments(product: Product): Assessment[] {
  const assessments: Assessment[] = [];

  // Positive assessments
  if (product.nutrition.fiber && product.nutrition.fiber.value > 5) {
    assessments.push({
      type: 'positive',
      label: 'High in fiber',
    });
  }

  if (product.nutrition.protein && product.nutrition.protein.value > 10) {
    assessments.push({
      type: 'positive',
      label: 'Rich in protein',
    });
  }

  // Low sugar is good (less than 5g per 100g) - only if actually provided (not undefined)
  if (product.nutrition.sugars && product.nutrition.sugars.value < 5) {
    assessments.push({
      type: 'positive',
      label: 'Low in sugar',
    });
  }

  // Low salt is good (less than 0.3g per 100g) - only if actually provided (not undefined)
  if (product.nutrition.salt && product.nutrition.salt.value < 0.3) {
    assessments.push({
      type: 'positive',
      label: 'Low in salt',
    });
  }

  // Low fat is good (less than 3g per 100g)
  if (product.nutrition.fat && product.nutrition.fat.value < 3) {
    assessments.push({
      type: 'positive',
      label: 'Low in fat',
    });
  }

  // Low saturated fat is good (less than 1.5g per 100g)
  if (product.nutrition.saturatedFat && product.nutrition.saturatedFat.value < 1.5) {
    assessments.push({
      type: 'positive',
      label: 'Low in saturated fat',
    });
  }

  // Low calories is good (less than 100kcal per 100g)
  if (product.nutrition.calories && product.nutrition.calories.value < 100) {
    assessments.push({
      type: 'positive',
      label: 'Low calorie',
    });
  }

  // Negative assessments
  if (product.nutrition.fat && product.nutrition.fat.value > 20) {
    assessments.push({
      type: 'negative',
      label: 'High in fat',
    });
  }

  if (product.nutrition.saturatedFat && product.nutrition.saturatedFat.value > 5) {
    assessments.push({
      type: 'negative',
      label: 'High in saturated fat',
    });
  }

  if (product.nutrition.calories && product.nutrition.calories.value > 500) {
    assessments.push({
      type: 'negative',
      label: 'High calorie',
    });
  }

  if (product.nutrition.sugars && product.nutrition.sugars.value > 15) {
    assessments.push({
      type: 'negative',
      label: 'High in sugar',
    });
  }

  if (product.nutrition.salt && product.nutrition.salt.value > 1.5) {
    assessments.push({
      type: 'negative',
      label: 'High in salt',
    });
  }

  // High carbohydrates (more than 30g per 100g)
  if (product.nutrition.carbohydrates && product.nutrition.carbohydrates.value > 30) {
    assessments.push({
      type: 'negative',
      label: 'High in carbohydrates',
    });
  }

  // High sodium (more than 0.6g per 100g, equivalent to 1.5g salt)
  if (product.nutrition.sodium && product.nutrition.sodium.value > 0.6) {
    assessments.push({
      type: 'negative',
      label: 'High in sodium',
    });
  }

  // Added sugars present (indicates processed food)
  if (product.nutrition.addedSugars && product.nutrition.addedSugars.value > 0) {
    assessments.push({
      type: 'negative',
      label: 'Contains added sugars',
    });
  }

  return assessments;
}
