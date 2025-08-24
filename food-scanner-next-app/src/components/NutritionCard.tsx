import { Card } from '@/components/ui/Card';
import type { NutritionData } from '@/types/product';

interface NutritionCardProps {
  nutrition: NutritionData;
}

interface NutrientRowProps {
  label: string;
  value: number;
  unit: string;
  per100g: number;
}

function NutrientRow({ label, value, unit, per100g }: NutrientRowProps) {
  return (
    <div className='flex justify-between py-2 border-b border-gray-30'>
      <span className='text-gray-70'>{label}</span>
      <div className='text-right'>
        <span className='font-medium text-gray-90'>
          {value} {unit}
        </span>
        <span className='ml-2 text-sm text-gray-50'>
          ({per100g} {unit}/100g)
        </span>
      </div>
    </div>
  );
}

export function NutritionCard({ nutrition }: NutritionCardProps) {
  return (
    <Card>
      <h2 className='text-xl font-semibold text-gray-90 mb-4'>Nutritional Information</h2>
      <div className='space-y-1'>
        <NutrientRow label='Calories' value={nutrition.calories.value} unit={nutrition.calories.unit} per100g={nutrition.calories.per_100g} />
        <NutrientRow label='Fat' value={nutrition.fat.value} unit={nutrition.fat.unit} per100g={nutrition.fat.per_100g} />
        <NutrientRow label='Saturated Fat' value={nutrition.saturatedFat.value} unit={nutrition.saturatedFat.unit} per100g={nutrition.saturatedFat.per_100g} />
        <NutrientRow label='Carbohydrates' value={nutrition.carbohydrates.value} unit={nutrition.carbohydrates.unit} per100g={nutrition.carbohydrates.per_100g} />
        <NutrientRow label='Sugars' value={nutrition.sugars.value} unit={nutrition.sugars.unit} per100g={nutrition.sugars.per_100g} />
        <NutrientRow label='Protein' value={nutrition.protein.value} unit={nutrition.protein.unit} per100g={nutrition.protein.per_100g} />
        <NutrientRow label='Salt' value={nutrition.salt.value} unit={nutrition.salt.unit} per100g={nutrition.salt.per_100g} />
        <NutrientRow label='Fiber' value={nutrition.fiber.value} unit={nutrition.fiber.unit} per100g={nutrition.fiber.per_100g} />
      </div>
    </Card>
  );
}
