import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { IconThumbUp, IconThumbDown } from '@tabler/icons-react-native';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import { useNavigationBack } from '@/hooks/useNavigationBack';
import faqData from '@/data/faq.json';
import { ScoreImage } from '@/components/ScoreImage';
import { getTailwindColor } from '@/lib/utils/tailwind-colors';
import nutrientThresholdsData from '@/data/nutrient-thresholds.json';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';

type FAQDetailRouteProp = RouteProp<RootStackParamList, 'FAQDetail'>;

interface FAQItem {
  id: string;
  type: 'score' | 'question';
  question: string;
  title?: string;
  answer?: string;
  sections?: Array<{
    type: 'text' | 'section' | 'table';
    content?: string;
    image?: string;
    subtitle?: string;
    subtitleType?: 'Text' | 'WithIcon';
    subtitleIcon?: 'thumbsUp' | 'thumbsDown';
    subtitleAssessment?: 'positive' | 'negative';
    subtitleColor?: string;
    description?: string;
    title?: string;
    dataSource?: string;
  }>;
}

/**
 * Get image source for score images
 */
function getScoreImageSource(imageName: string): any {
  if (imageName.startsWith('nutriscore-')) {
    const grade = imageName.split('-')[1].toUpperCase() as 'A' | 'B' | 'C' | 'D' | 'E';
    return <ScoreImage type="nutriscore" variant={grade} />;
  } else if (imageName.startsWith('ecoscore-')) {
    const grade = imageName.split('-')[1].toUpperCase() as 'A' | 'B' | 'C' | 'D' | 'E';
    return <ScoreImage type="ecoscore" variant={grade} />;
  } else if (imageName.startsWith('novascore-')) {
    const grade = parseInt(imageName.split('-')[1]) as 1 | 2 | 3 | 4;
    return <ScoreImage type="novascore" variant={grade} />;
  }
  return null;
}

/**
 * Render text with <b> tags as bold text
 * React Native doesn't support HTML, so we parse <b> tags and render them as bold Text components
 * Returns an array of ReactNode that can be used as children of a parent Text component
 */
function renderTextWithBold(text: string): React.ReactNode[] {
  if (!text) return [];

  const parts: React.ReactNode[] = [];
  const regex = /<b>(.*?)<\/b>/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the bold tag
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    // Add bold text as a nested Text component
    parts.push(
      <Text key={`bold-${key++}`} className="font-inter-bold">
        {match[1]}
      </Text>
    );
    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  // If no bold tags were found, return the original text
  if (parts.length === 0) {
    return [text];
  }

  return parts;
}

/**
 * Render a nutrient thresholds table
 */
function renderNutrientTable() {
  const thresholds = nutrientThresholdsData as Record<
    string,
    { name: string; unit: string; low: number; high: number; isPositive: boolean }
  >;

  const nutrients = Object.entries(thresholds);

  return (
    <View className="mb-4">
      <View className="border border-gray-30 rounded-lg overflow-hidden">
        {/* Table Header */}
        <View className="flex-row bg-gray-20 border-b border-gray-30">
          <View className="flex-1 p-2 border-r border-gray-30">
            <Text className="font-bold text-caption">Nutrient</Text>
          </View>
          <View className="w-20 p-2 border-r border-gray-30">
            <Text className="font-bold text-caption text-center">Low</Text>
          </View>
          <View className="w-28 p-2 border-r border-gray-30">
            <Text className="font-bold text-caption text-center">Moderate</Text>
          </View>
          <View className="w-20 p-2">
            <Text className="font-bold text-caption text-center">High</Text>
          </View>
        </View>

        {/* Table Rows */}
        {nutrients.map(([key, nutrient], index) => {
          const isLast = index === nutrients.length - 1;
          const lowColor = nutrient.isPositive
            ? getTailwindColor('gray-60')
            : getTailwindColor('green-60');
          const moderateColor = getTailwindColor('orange-500');
          const highColor = nutrient.isPositive
            ? getTailwindColor('green-60')
            : getTailwindColor('red-60');

          return (
            <View key={key} className={`flex-row ${isLast ? '' : 'border-b border-gray-30'}`}>
              {/* Nutrient Name with Unit */}
              <View className="flex-1 p-2 border-r border-gray-30 justify-center">
                <Text className="text-caption font-medium">
                  {nutrient.name} ({nutrient.unit})
                </Text>
              </View>

              {/* Low Range */}
              <View className="w-20 p-2 border-r border-gray-30 items-center justify-center">
                <Text className="text-caption font-bold" style={{ color: lowColor }}>
                  &lt; {nutrient.low}
                </Text>
              </View>

              {/* Moderate Range */}
              <View className="w-28 p-2 border-r border-gray-30 items-center justify-center">
                <Text
                  className="text-caption font-bold"
                  style={{ color: moderateColor }}
                  numberOfLines={1}
                >
                  {`${nutrient.low} - ${nutrient.high}`}
                </Text>
              </View>

              {/* High Range */}
              <View className="w-20 p-2 items-center justify-center">
                <Text className="text-caption font-bold" style={{ color: highColor }}>
                  &gt; {nutrient.high}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function FAQDetailScreen() {
  const route = useRoute<FAQDetailRouteProp>();
  const { id } = route.params || {};
  useNavigationBack();
  const headerHeight = useHeaderHeight();

  const faqItem = (faqData as FAQItem[]).find((item) => item.id === id);

  if (!faqItem) {
    return (
      <View className="flex-1 bg-gray-10 justify-center items-center">
        <Text className="text-gray-60">FAQ item not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-10">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: headerHeight + 20,
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}
      >
        {faqItem.sections ? (
          // FAQ with sections (score or question type)
          <>
            {faqItem.sections.map((section, index) => {
              if (section.type === 'text') {
                return (
                  <View key={index}>
                    <Text className="text-base leading-6 text-gray-90 font-inter">
                      {renderTextWithBold(section.content || '')}
                    </Text>
                  </View>
                );
              } else if (section.type === 'section') {
                // Calculate spacing: 32px between sections, first image section gets top spacing
                const prevSection = index > 0 ? faqItem.sections?.[index - 1] : null;
                const isFirstImageSection = section.image && prevSection?.type === 'text';
                const sectionSpacing = index > 0 ? { marginTop: 32 } : {};

                return (
                  <View key={index} style={sectionSpacing}>
                    {section.image && (
                      <View className="mb-4">{getScoreImageSource(section.image)}</View>
                    )}
                    {section.subtitle && (
                      <View className="flex-row items-center mb-3 gap-1">
                        {section.subtitleType === 'WithIcon' && section.subtitleIcon && (
                          <View>
                            {section.subtitleIcon === 'thumbsUp' ? (
                              <IconThumbUp
                                size={24}
                                strokeWidth={2}
                                stroke={
                                  section.subtitleAssessment === 'positive'
                                    ? getTailwindColor('green-60')
                                    : section.subtitleColor
                                    ? getTailwindColor(section.subtitleColor)
                                    : '#000000'
                                }
                              />
                            ) : (
                              <IconThumbDown
                                size={24}
                                strokeWidth={2}
                                stroke={
                                  section.subtitleAssessment === 'negative'
                                    ? getTailwindColor('red-60')
                                    : section.subtitleColor
                                    ? getTailwindColor(section.subtitleColor)
                                    : '#000000'
                                }
                              />
                            )}
                          </View>
                        )}
                        <Text
                          className="text-lg font-bold"
                          style={{
                            color: section.subtitleColor
                              ? getTailwindColor(section.subtitleColor)
                              : '#000000',
                          }}
                        >
                          {section.subtitle}
                        </Text>
                      </View>
                    )}
                    {section.description && (
                      <Text className="text-base leading-6 text-gray-90 font-inter">
                        {renderTextWithBold(section.description)}
                      </Text>
                    )}
                  </View>
                );
              } else if (section.type === 'table') {
                const sectionSpacing = index > 0 ? { marginTop: 32 } : {};

                return (
                  <View key={index} style={sectionSpacing}>
                    {section.title && (
                      <Text className="text-lg font-semibold mb-3">{section.title}</Text>
                    )}
                    {section.dataSource === 'nutrient-thresholds' && renderNutrientTable()}
                  </View>
                );
              }
              return null;
            })}
          </>
        ) : (
          // Simple question type FAQ (fallback for old format)
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3 text-black">{faqItem.question}</Text>
            <Text className="text-base leading-6 text-gray-90 font-inter">
              {renderTextWithBold(faqItem.answer || '')}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
