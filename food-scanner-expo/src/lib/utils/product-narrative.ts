import type { Product } from '@/types/product';
import { generateAssessments } from './product-assessment';

/**
 * Generates a human-readable narrative assessment of a product
 * Note: This function returns translation keys for recommendations.
 * The caller should translate the result using t() function.
 */
export function generateProductNarrative(product: Product, t?: (key: string) => string): string {
  const assessments = generateAssessments(product);
  const translate = t || ((key: string) => key);

  if (assessments.length === 0) {
    return translate('narrative.balancedProfile');
  }

  const positives = assessments.filter((a) => a.type === 'positive');
  const negatives = assessments.filter((a) => a.type === 'negative');

  let narrative = '';

  // Build positive aspects
  if (positives.length > 0) {
    narrative += translate('narrative.productIs');
    const positiveTexts = positives.map((p) => translate(p.label).toLowerCase());

    if (positiveTexts.length === 1) {
      narrative += positiveTexts[0];
    } else if (positiveTexts.length === 2) {
      narrative += `${positiveTexts[0]}${translate('narrative.and')}${positiveTexts[1]}`;
    } else {
      const lastPositive = positiveTexts.pop();
      narrative += `${positiveTexts.join(', ')}, ${translate('narrative.and')}${lastPositive}`;
    }
    narrative += '. ';
  }

  // Build negative aspects
  if (negatives.length > 0) {
    if (positives.length > 0) {
      narrative += translate('narrative.howeverIt');
    } else {
      narrative += translate('narrative.productIs');
    }

    const negativeTexts = negatives.map((n) => translate(n.label).toLowerCase());

    if (negativeTexts.length === 1) {
      narrative += negativeTexts[0];
    } else if (negativeTexts.length === 2) {
      narrative += `${negativeTexts[0]}${translate('narrative.and')}${negativeTexts[1]}`;
    } else {
      const lastNegative = negativeTexts.pop();
      narrative += `${negativeTexts.join(', ')}, ${translate('narrative.and')}${lastNegative}`;
    }
    narrative += '. ';
  }

  // Add recommendation (use grade if available, otherwise rely on score-based logic)
  const grade = product.assessment?.category || '';
  const recommendation = getRecommendation(positives.length, negatives.length, grade, translate);
  narrative += recommendation;

  return narrative;
}

/**
 * Gets a consumption recommendation based on the assessment
 */
function getRecommendation(
  positiveCount: number,
  negativeCount: number,
  grade: string,
  t: (key: string) => string
): string {
  const score = positiveCount - negativeCount;

  // Excellent (A grade or high positive score)
  if (grade === 'A') {
    return t('narrative.excellentConsumption');
  }

  // Good (B grade or moderate positive score)
  if (grade === 'B' || (grade === 'C' && score >= 1)) {
    return t('narrative.goodConsumption');
  }

  // Moderate (C grade or D grade or balanced)
  if (grade === 'C' || grade === 'D' || (score >= -1 && score <= 1)) {
    return t('narrative.moderateConsumption');
  }

  // Poor (E grade or high negative score)
  return t('narrative.limitConsumption');
}

/**
 * Gets the nutriscore color using existing palette
 */
export function getNutriscoreColor(grade: string): string {
  const colors: Record<string, string> = {
    a: '#038537', // green-60 (Excellent)
    b: '#AD5F00', // green-60 (Good)
    c: '#AD5F00', // bronze-60 (Moderate)
    d: '#DE1B1B', // bronze-60 (Poor)
    e: '#DE1B1B', // red-60 (Unhealthy)
  };

  return colors[grade.toLowerCase()] || colors['e'];
}

/**
 * Gets a readable nutriscore description
 * Note: Returns translation keys. Caller should translate using t().
 */
export function getNutriscoreDescription(grade: string, t?: (key: string) => string): string {
  const translate = t || ((key: string) => key);
  const gradeUpper = grade.toUpperCase();
  
  const descriptions: Record<string, string> = {
    A: translate('scores.excellentChoice'),
    B: translate('scores.goodOption'),
    C: translate('scores.lessHealthy'),
    D: translate('scores.unhealthy'),
    E: translate('scores.unhealthy'),
  };

  return descriptions[gradeUpper] || translate('common.unknown');
}

/**
 * Gets the badge variant based on nutriscore grade
 */
export function getNutriscoreBadgeVariant(grade: string): 'success' | 'warning' | 'danger' {
  const gradeUpper = grade.toUpperCase();

  if (gradeUpper === 'A') {
    return 'success'; // green
  }

  if (gradeUpper === 'B' || gradeUpper === 'C') {
    return 'warning'; // bronze
  }

  return 'danger'; // red (E)
}
