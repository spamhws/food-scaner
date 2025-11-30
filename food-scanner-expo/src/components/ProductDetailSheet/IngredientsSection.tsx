import React from 'react';
import { Text } from 'react-native';
import { SectionLabel } from './SectionLabel';
import { InfoCard } from './InfoCard';

interface IngredientsSectionProps {
  ingredients: string[];
}

export function IngredientsSection({ ingredients }: IngredientsSectionProps) {
  if (!ingredients || ingredients.length === 0) return null;

  return (
    <>
      <SectionLabel>Ingredients</SectionLabel>
      <InfoCard className="px-5">
        <Text className="font-medium text-caption capitalize leading-6">
          {ingredients.join(', ')}
        </Text>
      </InfoCard>
    </>
  );
}

