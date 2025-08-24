export function parseNutrient(value: string | undefined, unit = 'g'): { value: number; unit: string; per_100g: number } {
  const numValue = parseFloat(value || '0');
  return {
    value: numValue,
    unit,
    per_100g: numValue,
  };
}

export function calculateNutritionScore(grade: string): number {
  const scores = { a: 100, b: 80, c: 60, d: 40, e: 20 };
  return scores[grade.toLowerCase() as keyof typeof scores] || 0;
}
