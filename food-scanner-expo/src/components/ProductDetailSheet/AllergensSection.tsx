import React from 'react';
import { IconAlertTriangle } from '@tabler/icons-react-native';
import { getTailwindColor } from '@/lib/utils/tailwind-colors';
import { SectionLabel } from './SectionLabel';
import { InfoCard } from './InfoCard';
import { InfoRow } from './InfoRow';
import { NutritionDivider } from './NutritionDivider';

interface AllergensSectionProps {
  allergens: string[];
}

export function AllergensSection({ allergens }: AllergensSectionProps) {
  if (!allergens || allergens.length === 0) return null;

  return (
    <>
      <SectionLabel>Allergens</SectionLabel>
      <InfoCard>
        {allergens.map((allergen: string, index: number) => {
          const isLast = index === allergens.length - 1;
          return (
            <React.Fragment key={index}>
              <InfoRow
                icon={<IconAlertTriangle size={24} strokeWidth={1.5} stroke={getTailwindColor('bronze-60')} />}
                label={allergen.charAt(0).toUpperCase() + allergen.slice(1)}
              />
              {!isLast && <NutritionDivider />}
            </React.Fragment>
          );
        })}
      </InfoCard>
    </>
  );
}

