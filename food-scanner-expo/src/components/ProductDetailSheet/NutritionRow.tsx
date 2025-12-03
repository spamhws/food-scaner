import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';

interface NutritionRowProps {
  icon?: ReactNode; // Optional - sub-items don't have icons
  label: string;
  per100g: number;
  perPackage: number | null;
  unit: string;
  showPackageColumn?: boolean;
  isSubItem?: boolean; // Indicates this is a sub-item (no icon, no divider above)
}

export function NutritionRow({
  icon,
  label,
  per100g,
  perPackage,
  unit,
  showPackageColumn = true,
  isSubItem = false,
}: NutritionRowProps) {
  const formatValue = (value: number) => {
    // Rounding rules:
    // - Values <= 10: show decimals (if any)
    // - Values > 10: round to integer
    if (value <= 10) {
      // Show decimals for small values
      return value % 1 === 0 ? value.toString() : value.toFixed(1);
    } else {
      // Round to integer for larger values
      return Math.round(value).toString();
    }
  };

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        {icon}
        {!icon && isSubItem && <View style={{ width: 24 }} />}
        <Text className="font-medium text-caption text-black">{label}</Text>
      </View>
      <View className="flex-row items-center" style={{ gap: showPackageColumn ? 24 : 0 }}>
        <Text className="text-number font-semibold text-right">{formatValue(per100g)}</Text>
        {showPackageColumn && perPackage !== null && (
          <Text className="text-number font-semibold text-right w-[56px]">
            {formatValue(perPackage)}
          </Text>
        )}
      </View>
    </View>
  );
}
