import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import type { NavigationProp } from '@/navigation/navigation-types';
import { SectionLabel } from './SectionLabel';
import { InfoCard } from './InfoCard';
import { ScoreImage } from '@/components/ScoreImage';

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
  productBarcode?: string
) {
  Alert.alert(
    title,
    description,
    [
      {
        text: 'Done',
        style: 'default',
      },
      {
        text: 'Learn More',
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
  const hasAnyScore = nutriscoreGrade || ecoscoreGrade || novascoreGrade;
  if (!hasAnyScore) return null;

  const handleNutriscorePress = () => {
    if (!nutriscoreGrade) return;
    showScoreAlert(
      'Nutri-Score',
      `Rates nutritional quality (A to E) per 100g, balancing beneficial (protein, fibre) and detrimental (fat, sugar, salt) components. A is the best choice for health.`,
      'nutri-score',
      navigation,
      onClose,
      productBarcode
    );
  };

  const handleEcoscorePress = () => {
    if (!ecoscoreGrade) return;
    showScoreAlert(
      'ECO-Score',
      `Rates the environmental impact (A to E), considering CO2 emissions, packaging recyclability, and ingredient origins. A is the best choice for the planet.`,
      'eco-score',
      navigation,
      onClose,
      productBarcode
    );
  };

  const handleNovascorePress = () => {
    if (!novascoreGrade) return;
    showScoreAlert(
      'NOVA Score',
      `Rates the degree of industrial processing (Group 1 to 4). Group 4 is Ultra-Processed Food (UPF), which should be limited regardless of its nutrient content.`,
      'nova-score',
      navigation,
      onClose,
      productBarcode
    );
  };

  return (
    <>
      <SectionLabel>NUTRI SCORES</SectionLabel>
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
