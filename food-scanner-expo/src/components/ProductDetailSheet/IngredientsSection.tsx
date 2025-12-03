import React from 'react';
import { Text } from 'react-native';
import { SectionLabel } from './SectionLabel';
import { InfoCard } from './InfoCard';
import { useTranslation } from '@/hooks/useTranslation';

interface IngredientsSectionProps {
  ingredients: string[];
}

export function IngredientsSection({ ingredients }: IngredientsSectionProps) {
  const { t } = useTranslation();
  if (!ingredients || ingredients.length === 0) return null;

  return (
    <>
      <SectionLabel>{t('ingredients.ingredients')}</SectionLabel>
      <InfoCard className="px-5">
        <Text className="font-medium text-caption capitalize leading-6">
          {ingredients.join(', ')}
        </Text>
      </InfoCard>
    </>
  );
}

