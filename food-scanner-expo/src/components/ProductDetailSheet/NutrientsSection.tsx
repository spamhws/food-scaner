import React from 'react';
import { View } from 'react-native';
import {
  IconFlame,
  IconMeat,
  IconDroplet,
  IconWheat,
  IconSalad,
  IconCube,
  IconSalt,
} from '@tabler/icons-react-native';
import type { Product } from '@/types/product';
import { SectionLabel } from './SectionLabel';
import { InfoCard } from './InfoCard';
import { NutritionRow } from './NutritionRow';
import { NutritionDivider } from './NutritionDivider';
import { getNutrientColor, getCaloriesColor } from '@/lib/utils/nutrient-colors';

interface NutrientsSectionProps {
  product: Product;
}

/**
 * Check if a nutrient is actually provided (not just defaulted to 0)
 * We show it if:
 * 1. The value is > 0, OR
 * 2. The nutrient has a nutrient_level (indicating API calculated/assessed it)
 *
 * This way, if a product has 0 protein but the API still assessed it, we show it.
 * But if the field is completely missing from the API, we hide it.
 */
function isNutrientProvided(
  nutrient: { per_100g: number } | undefined,
  nutrientLevel?: 'low' | 'moderate' | 'high'
): boolean {
  if (!nutrient) return false;
  // If per_100g is > 0, it's definitely provided
  if (nutrient.per_100g > 0) return true;
  // If nutrient_level exists, it means the API assessed it (even if 0)
  if (nutrientLevel !== undefined) return true;
  // Otherwise, it's likely missing/not provided
  return false;
}

export function NutrientsSection({ product }: NutrientsSectionProps) {
  if (!product.nutrition) return null;

  const hasPackageInfo = !!product.product_quantity;
  const packageWeight = hasPackageInfo
    ? parseFloat(product.product_quantity) * (product.product_quantity_unit === 'kg' ? 1000 : 1)
    : null;

  const getPerPackage = (per100g: number): number | null => {
    if (packageWeight === null) return null;
    return (per100g / 100) * packageWeight;
  };

  // Build list of nutrients to display (only if provided)
  const nutrients: Array<{
    icon?: React.ReactNode; // Optional - sub-items don't have icons
    label: string;
    per100g: number;
    perPackage: number | null;
    unit: string;
    isSubItem?: boolean;
  }> = [];

  // Calories - always show if nutrition exists
  if (product.nutrition.calories) {
    nutrients.push({
      icon: (
        <IconFlame
          size={24}
          strokeWidth={1.5}
          stroke={getCaloriesColor(product.nutrientLevels, product.nutrition)}
        />
      ),
      label: 'Calories, kcal',
      per100g: product.nutrition.calories.per_100g,
      perPackage: getPerPackage(product.nutrition.calories.per_100g),
      unit: '',
    });
  }

  // Protein - only if provided
  if (isNutrientProvided(product.nutrition.protein, product.nutrientLevels?.proteins)) {
    nutrients.push({
      icon: (
        <IconMeat
          size={24}
          strokeWidth={1.5}
          stroke={getNutrientColor(product.nutrientLevels, 'proteins', product.nutrition)}
        />
      ),
      label: 'Protein, g',
      per100g: product.nutrition.protein.per_100g,
      perPackage: getPerPackage(product.nutrition.protein.per_100g),
      unit: 'g',
    });
  }

  // Fats - only if provided
  if (isNutrientProvided(product.nutrition.fat, product.nutrientLevels?.fat)) {
    nutrients.push({
      icon: (
        <IconDroplet
          size={24}
          strokeWidth={1.5}
          stroke={getNutrientColor(product.nutrientLevels, 'fat', product.nutrition)}
        />
      ),
      label: 'Fats, g',
      per100g: product.nutrition.fat.per_100g,
      perPackage: getPerPackage(product.nutrition.fat.per_100g),
      unit: 'g',
    });

    // Saturated Fats - sub-item, only if provided (no icon)
    if (
      isNutrientProvided(product.nutrition.saturatedFat, product.nutrientLevels?.['saturated-fat'])
    ) {
      nutrients.push({
        label: 'Saturated Fats, g',
        per100g: product.nutrition.saturatedFat.per_100g,
        perPackage: getPerPackage(product.nutrition.saturatedFat.per_100g),
        unit: 'g',
        isSubItem: true,
      });
    }
  }

  // Carbohydrates - only if provided
  if (isNutrientProvided(product.nutrition.carbohydrates, product.nutrientLevels?.carbohydrates)) {
    nutrients.push({
      icon: (
        <IconWheat
          size={24}
          strokeWidth={1.5}
          stroke={getNutrientColor(product.nutrientLevels, 'carbohydrates', product.nutrition)}
        />
      ),
      label: 'Carbs, g',
      per100g: product.nutrition.carbohydrates.per_100g,
      perPackage: getPerPackage(product.nutrition.carbohydrates.per_100g),
      unit: 'g',
    });

    // Sugars - sub-item, only if provided (with icon)
    if (isNutrientProvided(product.nutrition.sugars, product.nutrientLevels?.sugars)) {
      nutrients.push({
        icon: (
          <IconCube
            size={24}
            strokeWidth={1.5}
            stroke={getNutrientColor(product.nutrientLevels, 'sugars', product.nutrition)}
          />
        ),
        label: 'Sugars, g',
        per100g: product.nutrition.sugars.per_100g,
        perPackage: getPerPackage(product.nutrition.sugars.per_100g),
        unit: 'g',
      });
    }

    // Added Sugars - sub-item, only if provided (no icon)
    if (
      product.nutrition.addedSugars &&
      isNutrientProvided(product.nutrition.addedSugars, product.nutrientLevels?.sugars)
    ) {
      nutrients.push({
        label: 'Added Sugar, g',
        per100g: product.nutrition.addedSugars.per_100g,
        perPackage: getPerPackage(product.nutrition.addedSugars.per_100g),
        unit: 'g',
        isSubItem: true,
      });
    }
  }

  // Fiber - only if provided
  if (isNutrientProvided(product.nutrition.fiber, product.nutrientLevels?.fiber)) {
    nutrients.push({
      icon: (
        <IconSalad
          size={24}
          strokeWidth={1.5}
          stroke={getNutrientColor(product.nutrientLevels, 'fiber', product.nutrition)}
        />
      ),
      label: 'Fiber, g',
      per100g: product.nutrition.fiber.per_100g,
      perPackage: getPerPackage(product.nutrition.fiber.per_100g),
      unit: 'g',
    });
  }

  // Salt - only if provided
  if (isNutrientProvided(product.nutrition.salt, product.nutrientLevels?.salt)) {
    nutrients.push({
      icon: (
        <IconSalt
          size={24}
          strokeWidth={1.5}
          stroke={getNutrientColor(product.nutrientLevels, 'salt', product.nutrition)}
        />
      ),
      label: 'Salt, g',
      per100g: product.nutrition.salt.per_100g,
      perPackage: getPerPackage(product.nutrition.salt.per_100g),
      unit: 'g',
    });
  }

  // Sodium - only if provided (no icon, sub-item)
  if (
    product.nutrition.sodium &&
    isNutrientProvided(product.nutrition.sodium, product.nutrientLevels?.salt)
  ) {
    nutrients.push({
      label: 'Sodium, g',
      per100g: product.nutrition.sodium.per_100g,
      perPackage: getPerPackage(product.nutrition.sodium.per_100g),
      unit: 'g',
      isSubItem: true,
    });
  }

  if (nutrients.length === 0) return null;

  return (
    <>
      <View className="flex-row items-center justify-between mt-2">
        <SectionLabel>Nutritional value</SectionLabel>
        <SectionLabel>{hasPackageInfo ? 'PER 100G / PER PACKAGE' : 'PER 100G'}</SectionLabel>
      </View>
      <InfoCard>
        {nutrients.map((nutrient, index) => {
          const nextNutrient = index < nutrients.length - 1 ? nutrients[index + 1] : null;
          // Show divider after this row if next row exists and is NOT a sub-item
          const showDividerAfter = nextNutrient && !nextNutrient.isSubItem;

          return (
            <React.Fragment key={nutrient.label}>
              <NutritionRow
                icon={nutrient.icon}
                label={nutrient.label}
                per100g={nutrient.per100g}
                perPackage={nutrient.perPackage}
                unit={nutrient.unit}
                isSubItem={nutrient.isSubItem}
                showPackageColumn={hasPackageInfo}
              />
              {showDividerAfter && <NutritionDivider />}
            </React.Fragment>
          );
        })}
      </InfoCard>
    </>
  );
}
