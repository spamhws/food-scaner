import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { IconInfoCircle } from '@tabler/icons-react-native';

type BadgeVariant = 'success' | 'warning' | 'danger';

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
  interactive?: boolean;
  onPress?: () => void;
}

const variantStyles: Record<
  BadgeVariant,
  {
    container: string;
    text: string;
    border: string;
    iconColor: string;
  }
> = {
  success: {
    container: 'bg-green-10',
    text: 'text-green-60',
    border: 'border-green-60/30',
    iconColor: '#038537', // green-60
  },
  warning: {
    container: 'bg-bronze-10',
    text: 'text-bronze-60',
    border: 'border-bronze-60/30',
    iconColor: '#AD5F00', // bronze-60
  },
  danger: {
    container: 'bg-red-10',
    text: 'text-red-60',
    border: 'border-red-60/30',
    iconColor: '#DE1B1B', // red-60
  },
};

export function Badge({ variant, label, interactive = false, onPress }: BadgeProps) {
  const styles = variantStyles[variant];

  const content = (
    <View
      className={`flex-row items-center gap-1 px-2 py-1 rounded border ${styles.container} ${styles.border}`}
    >
      <Text className={`font-semibold text-body-medium ${styles.text}`}>{label}</Text>
      {interactive && <IconInfoCircle size={20} strokeWidth={1.5} color={styles.iconColor} />}
    </View>
  );

  if (interactive && onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}
