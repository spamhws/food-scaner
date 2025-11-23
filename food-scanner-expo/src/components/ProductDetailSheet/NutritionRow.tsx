import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';

interface NutritionRowProps {
  icon: ReactNode;
  label: string;
  per100g: number;
  perPackage: number | null;
  unit: string;
  isLast?: boolean;
  showPackageColumn?: boolean;
}

export function NutritionRow({
  icon,
  label,
  per100g,
  perPackage,
  unit,
  isLast = false,
  showPackageColumn = true,
}: NutritionRowProps) {
  const formatValue = (value: number) => {
    // Always show 1 decimal place for gram values (g), otherwise show integer if whole number
    if (unit === 'g') {
      return value.toFixed(1);
    }
    return value % 1 === 0 ? value.toString() : value.toFixed(1);
  };

  return (
    <View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className="font-medium text-title text-black">{label}</Text>
        </View>
        <View className="flex-row items-center" style={{ gap: showPackageColumn ? 24 : 0 }}>
          <Text
            className="text-title font-semibold  text-right"
            style={{ width: showPackageColumn ? 52 : undefined }}
          >
            {formatValue(per100g)}
          </Text>
          {showPackageColumn && perPackage !== null && (
            <Text className="text-title font-semibold text-right" style={{ width: 52 }}>
              {formatValue(perPackage)}
            </Text>
          )}
        </View>
      </View>
      {!isLast && <View className="h-px bg-gray-30 mt-2 ml-8" />}
    </View>
  );
}
