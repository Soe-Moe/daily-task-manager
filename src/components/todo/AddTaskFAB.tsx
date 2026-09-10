import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GlassSurface } from '@/components/glass/GlassSurface';
import { useTheme } from '@/utils/useTheme';

export interface AddTaskFABProps {
  onPress: () => void;
}

export const AddTaskFAB: React.FC<AddTaskFABProps> = ({ onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <GlassSurface variant="sheet" radius={30} padded={false} style={styles.button}>
        <View style={styles.center}>
          <Ionicons name="add" size={28} color={colors.primary} />
        </View>
      </GlassSurface>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
