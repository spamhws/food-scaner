import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import type { NavigationProp } from '@/navigation/navigation-types';
import { SectionLabel } from './SectionLabel';
import { InfoCard } from './InfoCard';
import { ScoreImage } from '@/components/ScoreImage';
import { useTranslation } from '@/hooks/useTranslation';

interface NutriScoresSectionProps {
  nutriscoreGrade?: 'A' | 'B' | 'C' | 'D' | 'E';
  ecoscoreGrade?: 'A' | 'B' | 'C' | 'D' | 'E';
  novascoreGrade?: 1 | 2 | 3 | 4;
  navigation: NavigationProp;
  onClose: () => void;
  productBarcode?: string;
}

/**
 * Show alert for score with Learn More button
 */
function showScoreAlert(
  title: string,
  description: string,
  faqId: string,
  navigation: NavigationProp,
  onClose: () => void,
  t: (key: string) => string,
  productBarcode?: string
) {
  Alert.alert(
    title,
    description,
    [
      {
        text: t('common.done'),
        style: 'default',
      },
      {
        text: t('common.learnMore'),
        onPress: () => {
          onClose();
          navigation.navigate('FAQDetail', {
            id: faqId,
          });
        },
      },
    ],
    { cancelable: true }
  );
}

export function NutriScoresSection({
  nutriscoreGrade,
  ecoscoreGrade,
  novascoreGrade,
  navigation,
  onClose,
  productBarcode,
}: NutriScoresSectionProps) {
  const { t } = useTranslation();
  const hasAnyScore = nutriscoreGrade || ecoscoreGrade || novascoreGrade;
  if (!hasAnyScore) return null;

  const handleNutriscorePress = () => {
    if (!nutriscoreGrade) return;
    showScoreAlert(
      t('scores.nutriScore'),
      t('scores.nutriScoreDescription'),
      'nutri-score',
      navigation,
      onClose,
      t,
      productBarcode
    );
  };

  const handleEcoscorePress = () => {
    if (!ecoscoreGrade) return;
    showScoreAlert(
      t('scores.ecoscore'),
      t('scores.ecoscoreDescription'),
      'eco-score',
      navigation,
      onClose,
      t,
      productBarcode
    );
  };

  const handleNovascorePress = () => {
    if (!novascoreGrade) return;
    showScoreAlert(
      t('scores.novascore'),
      t('scores.novascoreDescription'),
      'nova-score',
      navigation,
      onClose,
      t,
      productBarcode
    );
  };

  return (
    <>
      <SectionLabel>{t('scores.nutriScores')}</SectionLabel>
      <InfoCard>
        <View className="flex-row items-center gap-4">
          {nutriscoreGrade && (
            <TouchableOpacity
              onPress={handleNutriscorePress}
              activeOpacity={0.7}
              style={{ alignSelf: 'flex-start' }}
            >
              <ScoreImage type="nutriscore" variant={nutriscoreGrade} />
            </TouchableOpacity>
          )}
          {ecoscoreGrade && (
            <TouchableOpacity
              onPress={handleEcoscorePress}
              activeOpacity={0.7}
              style={{ alignSelf: 'flex-start' }}
            >
              <ScoreImage type="ecoscore" variant={ecoscoreGrade} />
            </TouchableOpacity>
          )}
          {novascoreGrade && (
            <TouchableOpacity
              onPress={handleNovascorePress}
              activeOpacity={0.7}
              style={{ alignSelf: 'flex-start' }}
            >
              <ScoreImage type="novascore" variant={novascoreGrade} />
            </TouchableOpacity>
          )}
        </View>
      </InfoCard>
    </>
  );
}
