import React from 'react';
import { TextInput, TextInputProps, View, Text, StyleSheet } from 'react-native';
import { GlassSurface } from '@/components/glass/GlassSurface';
import { useTheme } from '@/utils/useTheme';
import { Typography } from '@/constants/typography';

export interface GlassTextFieldProps extends TextInputProps {
  label?: string;
}

export const GlassTextField: React.FC<GlassTextFieldProps> = ({
  label,
  style,
  multiline,
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={[Typography.labelMedium, { color: colors.textMuted, marginBottom: 8 }]}>
          {label}
        </Text>
      ) : null}
      <GlassSurface variant="pill" radius={16} padded={false} elevated={false}>
        <TextInput
          placeholderTextColor={colors.placeholder}
          multiline={multiline}
          style={[
            Typography.bodyLarge,
            styles.input,
            multiline && styles.multiline,
            { color: colors.text },
            style,
          ]}
          {...props}
        />
      </GlassSurface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
});
