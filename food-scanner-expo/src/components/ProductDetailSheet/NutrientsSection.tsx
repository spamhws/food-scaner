import React from 'react';
import { View } from 'react-native';
import {
  IconFlame,
  IconMeat,
  IconDroplet,
  IconWheat,
  IconCarrot,
  IconCube,
  IconSalt,
} from '@tabler/icons-react-native';
import type { NutritionData, NutrientLevels } from '@/types/product';
import { SectionLabel } from './SectionLabel';
import { InfoCard } from './InfoCard';
import { NutritionRow } from './NutritionRow';
import { NutritionDivider } from './NutritionDivider';
import { getNutrientColor, getCaloriesColor } from '@/lib/utils/nutrient-colors';
import { useTranslation } from '@/hooks/useTranslation';

interface NutrientsSectionProps {
  nutrition: NutritionData;
  nutrientLevels?: NutrientLevels;
  product_quantity?: string;
  product_quantity_unit?: string;
}

/**
 * Check if a nutrient is actually provided
 * If the nutrient exists in the nutrition object, it means it was provided by the API
 * (even if the value is 0). We only include nutrients in the nutrition object if
 * they pass isNutrientValueProvided, which accepts 0 as a valid value.
 */
function isNutrientProvided(nutrient: { per_100g: number } | undefined): boolean {
  // If nutrient exists, it was provided by the API (including 0 values)
  return nutrient !== undefined;
}

export function NutrientsSection({
  nutrition,
  nutrientLevels,
  product_quantity,
  product_quantity_unit,
}: NutrientsSectionProps) {
  const { t } = useTranslation();
  const hasPackageInfo = !!product_quantity;
  const packageWeight = hasPackageInfo
    ? parseFloat(product_quantity) * (product_quantity_unit === 'kg' ? 1000 : 1)
    : null;

  // Don't show per package column if package weight is exactly 100g (redundant)
  const showPackageColumn = hasPackageInfo && packageWeight !== null && packageWeight !== 100;

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

  // Calories - only show if provided
  if (nutrition.calories) {
    nutrients.push({
      icon: (
        <IconFlame
          size={24}
          strokeWidth={1.5}
          stroke={getCaloriesColor(nutrientLevels, nutrition)}
        />
      ),
      label: t('nutrition.calories'),
      per100g: nutrition.calories.per_100g,
      perPackage: getPerPackage(nutrition.calories.per_100g),
      unit: '',
    });
  }

  // Protein - only if provided
  if (nutrition.protein) {
    nutrients.push({
      icon: (
        <IconMeat
          size={24}
          strokeWidth={1.5}
          stroke={getNutrientColor(nutrientLevels, 'proteins', nutrition)}
        />
      ),
      label: t('nutrition.protein'),
      per100g: nutrition.protein.per_100g,
      perPackage: getPerPackage(nutrition.protein.per_100g),
      unit: 'g',
    });
  }

  // Fats - only if provided
  if (nutrition.fat) {
    nutrients.push({
      icon: (
        <IconDroplet
          size={24}
          strokeWidth={1.5}
          stroke={getNutrientColor(nutrientLevels, 'fat', nutrition)}
        />
      ),
      label: t('nutrition.fats'),
      per100g: nutrition.fat.per_100g,
      perPackage: getPerPackage(nutrition.fat.per_100g),
      unit: 'g',
    });

    // Saturated Fats - sub-item, only if provided (no icon)
    if (nutrition.saturatedFat) {
      nutrients.push({
        label: t('nutrition.saturatedFats'),
        per100g: nutrition.saturatedFat.per_100g,
        perPackage: getPerPackage(nutrition.saturatedFat.per_100g),
        unit: 'g',
        isSubItem: true,
      });
    }
  }

  // Carbohydrates - only if provided
  if (nutrition.carbohydrates) {
    nutrients.push({
      icon: (
        <IconWheat
          size={24}
          strokeWidth={1.5}
          stroke={getNutrientColor(nutrientLevels, 'carbohydrates', nutrition)}
        />
      ),
      label: t('nutrition.carbs'),
      per100g: nutrition.carbohydrates.per_100g,
      perPackage: getPerPackage(nutrition.carbohydrates.per_100g),
      unit: 'g',
    });

    // Sugars - sub-item, only if provided (with icon)
    if (nutrition.sugars) {
      nutrients.push({
        icon: (
          <IconCube
            size={24}
            strokeWidth={1.5}
            stroke={getNutrientColor(nutrientLevels, 'sugars', nutrition)}
          />
        ),
        label: t('nutrition.sugars'),
        per100g: nutrition.sugars.per_100g,
        perPackage: getPerPackage(nutrition.sugars.per_100g),
        unit: 'g',
      });
    }

    // Added Sugars - sub-item, only if provided (no icon)
    if (nutrition.addedSugars) {
      nutrients.push({
        label: t('nutrition.addedSugar'),
        per100g: nutrition.addedSugars.per_100g,
        perPackage: getPerPackage(nutrition.addedSugars.per_100g),
        unit: 'g',
        isSubItem: true,
      });
    }
  }

  // Fiber - only if provided
  if (nutrition.fiber) {
    nutrients.push({
      icon: (
        <IconCarrot
          size={24}
          strokeWidth={1.5}
          stroke={getNutrientColor(nutrientLevels, 'fiber', nutrition)}
        />
      ),
      label: t('nutrition.fiber'),
      per100g: nutrition.fiber.per_100g,
      perPackage: getPerPackage(nutrition.fiber.per_100g),
      unit: 'g',
    });
  }

  // Salt - only if provided
  if (nutrition.salt) {
    nutrients.push({
      icon: (
        <IconSalt
          size={24}
          strokeWidth={1.5}
          stroke={getNutrientColor(nutrientLevels, 'salt', nutrition)}
        />
      ),
      label: t('nutrition.salt'),
      per100g: nutrition.salt.per_100g,
      perPackage: getPerPackage(nutrition.salt.per_100g),
      unit: 'g',
    });
  }

  // Sodium - only if provided (no icon, sub-item)
  if (nutrition.sodium) {
    nutrients.push({
      label: t('nutrition.sodium'),
      per100g: nutrition.sodium.per_100g,
      perPackage: getPerPackage(nutrition.sodium.per_100g),
      unit: 'g',
      isSubItem: true,
    });
  }

  if (nutrients.length === 0) return null;

  return (
    <>
      <View className="flex-row items-center justify-between mt-2">
        <SectionLabel>{t('nutrition.nutritionalValue')}</SectionLabel>
        <SectionLabel>{showPackageColumn ? t('nutrition.per100gPerPackage') : t('nutrition.per100g')}</SectionLabel>
      </View>
      <InfoCard className="pr-5">
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
                showPackageColumn={showPackageColumn}
              />
              {showDividerAfter && <NutritionDivider />}
            </React.Fragment>
          );
        })}
      </InfoCard>
    </>
  );
}
