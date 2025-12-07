import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { IconThumbUp, IconThumbDown } from '@tabler/icons-react-native';
import { getColor } from '@/lib/utils/colors';

type BadgeVariant = 'success' | 'warning' | 'danger';

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
  interactive?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  iconType?: 'thumbUp' | 'thumbDown';
  className?: string;
}

const variantStyles: Record<
  BadgeVariant,
  {
    container: string;
    text: string;
    border: string;
  }
> = {
  success: {
    container: 'bg-green-10',
    text: 'text-green-60',
    border: 'border-green-20',
  },
  warning: {
    container: 'bg-bronze-10',
    text: 'text-bronze-60',
    border: 'border-bronze-30',
  },
  danger: {
    container: 'bg-red-10',
    text: 'text-red-60',
    border: 'border-red-30',
  },
};

export function Badge({
  variant,
  label,
  interactive = false,
  onPress,
  icon,
  iconType,
  className,
}: BadgeProps) {
  const styles = variantStyles[variant];

  // Get icon color based on variant
  const getIconColor = () => {
    if (variant === 'success') return getColor('green.60');
    if (variant === 'warning') return getColor('bronze.60');
    return getColor('red.60'); // danger
  };

  // Render icon based on iconType or provided icon
  const renderIcon = () => {
    if (icon) return icon;
    if (iconType === 'thumbUp') {
      return <IconThumbUp size={16} strokeWidth={2} stroke={getIconColor()} />;
    }
    if (iconType === 'thumbDown') {
      return <IconThumbDown size={16} strokeWidth={2} stroke={getIconColor()} />;
    }
    return null;
  };

  const content = (
    <View
      className={`flex-row items-center gap-1 px-2 py-1 border ${styles.container} ${styles.border} rounded ${className}`}
    >
      {renderIcon()}
      {label ? (
        <Text className={`font-semibold text-body-medium ${styles.text}`}>{label}</Text>
      ) : null}
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
