import React from 'react';
import { IconThumbUp, IconThumbDown } from '@tabler/icons-react-native';
import type { Assessment } from '@/lib/utils/product-assessment';
import { getTailwindColor } from '@/lib/utils/tailwind-colors';
import { SectionLabel } from './SectionLabel';
import { InfoCard } from './InfoCard';
import { InfoRow } from './InfoRow';
import { NutritionDivider } from './NutritionDivider';
import { useTranslation } from '@/hooks/useTranslation';

interface CharacteristicsSectionProps {
  assessments: Assessment[];
}

export function CharacteristicsSection({ assessments }: CharacteristicsSectionProps) {
  const { t } = useTranslation();
  if (assessments.length === 0) return null;

  return (
    <>
      <SectionLabel>{t('characteristics.keyCharacteristics')}</SectionLabel>
      <InfoCard>
        {assessments.map((assessment, index) => {
          const isLast = index === assessments.length - 1;
          return (
            <React.Fragment key={index}>
              <InfoRow
                icon={
                  assessment.type === 'positive' ? (
                    <IconThumbUp
                      size={24}
                      strokeWidth={1.5}
                      stroke={getTailwindColor('green-60')}
                    />
                  ) : (
                    <IconThumbDown
                      size={24}
                      strokeWidth={1.5}
                      stroke={getTailwindColor('red-60')}
                    />
                  )
                }
                label={t(assessment.label)}
              />
              {!isLast && <NutritionDivider />}
            </React.Fragment>
          );
        })}
      </InfoCard>
    </>
  );
}
