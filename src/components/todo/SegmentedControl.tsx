import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassSurface } from '@/components/glass/GlassSurface';
import { useTheme } from '@/utils/useTheme';
import { Typography } from '@/constants/typography';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

const CHIP_HEIGHT = 44;

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            style={styles.segmentTouchable}
            activeOpacity={0.8}
          >
            <GlassSurface
              variant="pill"
              radius={14}
              padded={false}
              elevated={false}
              interactive
              glassEffect={active ? 'clear' : 'regular'}
              tint={active ? `${colors.primary}40` : undefined}
              style={styles.segmentSurface}
            >
              <View style={styles.segmentContent}>
                <Text
                  style={[
                    Typography.labelMedium,
                    {
                      color: active ? colors.primary : colors.textMuted,
                      fontWeight: active ? '700' : '500',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {option.label}
                </Text>
              </View>
            </GlassSurface>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  segmentTouchable: {
    flex: 1,
  },
  segmentSurface: {
    height: CHIP_HEIGHT,
    width: '100%',
  },
  segmentContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
});
