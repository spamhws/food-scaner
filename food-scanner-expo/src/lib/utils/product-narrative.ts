import type { Product } from '@/types/product';
import { generateAssessments } from './product-assessment';

/**
 * Generates a human-readable narrative assessment of a product
 */
export function generateProductNarrative(product: Product): string {
  const assessments = generateAssessments(product);

  if (assessments.length === 0) {
    return 'This product has a balanced nutritional profile with no significant concerns or notable benefits.';
  }

  const positives = assessments.filter((a) => a.type === 'positive');
  const negatives = assessments.filter((a) => a.type === 'negative');

  let narrative = '';

  // Build positive aspects
  if (positives.length > 0) {
    narrative += 'This product ';
    const positiveTexts = positives.map((p) => p.label.toLowerCase());

    if (positiveTexts.length === 1) {
      narrative += `is ${positiveTexts[0]}`;
    } else if (positiveTexts.length === 2) {
      narrative += `is ${positiveTexts[0]} and ${positiveTexts[1]}`;
    } else {
      const lastPositive = positiveTexts.pop();
      narrative += `is ${positiveTexts.join(', ')}, and ${lastPositive}`;
    }
    narrative += '. ';
  }

  // Build negative aspects
  if (negatives.length > 0) {
    if (positives.length > 0) {
      narrative += 'However, it ';
    } else {
      narrative += 'This product ';
    }

    const negativeTexts = negatives.map((n) => n.label.toLowerCase());

    if (negativeTexts.length === 1) {
      narrative += `is ${negativeTexts[0]}`;
    } else if (negativeTexts.length === 2) {
      narrative += `is ${negativeTexts[0]} and ${negativeTexts[1]}`;
    } else {
      const lastNegative = negativeTexts.pop();
      narrative += `is ${negativeTexts.join(', ')}, and ${lastNegative}`;
    }
    narrative += '. ';
  }

  // Add recommendation (use grade if available, otherwise rely on score-based logic)
  const grade = product.assessment?.category || '';
  const recommendation = getRecommendation(positives.length, negatives.length, grade);
  narrative += recommendation;

  return narrative;
}

/**
 * Gets a consumption recommendation based on the assessment
 */
function getRecommendation(positiveCount: number, negativeCount: number, grade: string): string {
  const score = positiveCount - negativeCount;

  // Excellent (A grade or high positive score)
  if (grade === 'A' || (grade === 'B' && score >= 2)) {
    return 'This is an excellent choice for regular consumption.';
  }

  // Good (B grade or moderate positive score)
  if (grade === 'B' || (grade === 'C' && score >= 1)) {
    return 'This is a good choice and can be consumed regularly in moderation.';
  }

  // Moderate (C-D grade or balanced)
  if (grade === 'C' || grade === 'D' || (score >= -1 && score <= 1)) {
    return 'Consider consuming this product moderately and balance it with healthier options.';
  }

  // Poor (E grade or high negative score)
  return "It's best to limit consumption of this product and opt for healthier alternatives when possible.";
}

/**
 * Gets the nutriscore color using existing palette
 */
export function getNutriscoreColor(grade: string): string {
  const colors: Record<string, string> = {
    a: '#038537', // green-60 (Excellent)
    b: '#038537', // green-60 (Good)
    c: '#AD5F00', // bronze-60 (Moderate)
    d: '#AD5F00', // bronze-60 (Poor)
    e: '#DE1B1B', // red-60 (Unhealthy)
  };

  return colors[grade.toLowerCase()] || colors['e'];
}

/**
 * Gets a readable nutriscore description
 */
export function getNutriscoreDescription(grade: string): string {
  const descriptions: Record<string, string> = {
    A: 'Great choice',
    B: 'Great choice',
    C: 'Moderately beneficial',
    D: 'Moderately beneficial',
    E: 'Unhealthy',
  };

  return descriptions[grade.toUpperCase()] || 'Unknown';
}

/**
 * Gets the badge variant based on nutriscore grade
 */
export function getNutriscoreBadgeVariant(grade: string): 'success' | 'warning' | 'danger' {
  const gradeUpper = grade.toUpperCase();

  if (gradeUpper === 'A' || gradeUpper === 'B') {
    return 'success'; // green
  }

  if (gradeUpper === 'C' || gradeUpper === 'D') {
    return 'warning'; // bronze
  }

  return 'danger'; // red (E)
}
