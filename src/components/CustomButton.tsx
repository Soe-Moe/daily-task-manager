import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '@/utils/useTheme';
import { Typography } from '@/constants/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...props
}) => {
  const { colors } = useTheme();

  const isButtonDisabled = disabled || loading;

  const getContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    };

    // Size padding
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = 8;
        baseStyle.paddingHorizontal = 14;
        break;
      case 'large':
        baseStyle.paddingVertical = 16;
        baseStyle.paddingHorizontal = 24;
        break;
      case 'medium':
      default:
        baseStyle.paddingVertical = 12;
        baseStyle.paddingHorizontal = 20;
        break;
    }

    // Variant styling
    switch (variant) {
      case 'secondary':
        baseStyle.backgroundColor = colors.surface;
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = colors.border;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1.5;
        baseStyle.borderColor = colors.primary;
        break;
      case 'danger':
        baseStyle.backgroundColor = colors.error;
        break;
      case 'primary':
      default:
        baseStyle.backgroundColor = colors.primary;
        break;
    }

    if (isButtonDisabled) {
      baseStyle.opacity = 0.55;
    }

    return baseStyle;
  };

  const getTextColor = (): string => {
    if (variant === 'outline') {
      return colors.primary;
    }
    if (variant === 'secondary') {
      return colors.text;
    }
    return colors.textInverse;
  };

  const textColor = getTextColor();

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={isButtonDisabled}
      style={[getContainerStyles(), style]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {leftIcon ? leftIcon : null}
          <Text
            style={[
              Typography.labelLarge,
              { color: textColor, marginHorizontal: leftIcon || rightIcon ? 8 : 0 },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon ? rightIcon : null}
        </>
      )}
    </TouchableOpacity>
  );
};
