import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { GlassSurface } from './GlassSurface';
import { useTheme } from '@/utils/useTheme';

export interface BottomSheetProps {
  children: React.ReactNode;
  onClose: () => void;
  /** Fraction of the window height the sheet occupies. Defaults to 0.9. */
  heightRatio?: number;
}

export interface BottomSheetHandle {
  /** Plays the slide-down animation, then calls onClose. */
  dismiss: () => void;
}

const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 0.8;

export const BottomSheet = forwardRef<BottomSheetHandle, BottomSheetProps>(function BottomSheet(
  { children, onClose, heightRatio = 0.9 },
  ref
) {
  const { colors } = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const sheetHeight = windowHeight * heightRatio;

  const translateY = useRef(new Animated.Value(sheetHeight)).current;
  const dragOffset = useRef(0);

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      damping: 22,
      stiffness: 220,
      mass: 0.9,
    }).start();
  }, [translateY]);

  const close = useCallback(() => {
    Animated.timing(translateY, {
      toValue: sheetHeight,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onClose();
    });
  }, [onClose, sheetHeight, translateY]);

  useImperativeHandle(ref, () => ({ dismiss: close }), [close]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dy) > 6 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
      onPanResponderGrant: () => {
        dragOffset.current = 0;
      },
      onPanResponderMove: (_, gesture) => {
        const next = Math.max(0, gesture.dy);
        dragOffset.current = next;
        translateY.setValue(next);
      },
      onPanResponderRelease: (_, gesture) => {
        if (dragOffset.current > DISMISS_DISTANCE || gesture.vy > DISMISS_VELOCITY) {
          close();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 22,
            stiffness: 220,
            mass: 0.9,
          }).start();
        }
      },
    })
  ).current;

  const scrimOpacity = translateY.interpolate({
    inputRange: [0, sheetHeight],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable style={StyleSheet.absoluteFill} onPress={close}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.scrim, opacity: scrimOpacity },
          ]}
        />
      </Pressable>

      <Animated.View
        style={[
          styles.sheetWrap,
          { height: sheetHeight, transform: [{ translateY }] },
        ]}
      >
        <GlassSurface
          variant="sheet"
          radius={28}
          flatBottom
          padded={false}
          style={styles.surface}
        >
          <View {...panResponder.panHandlers} style={styles.handleArea}>
            <View style={[styles.handle, { backgroundColor: colors.glassBorder }]} />
          </View>
          <View style={styles.content}>{children}</View>
        </GlassSurface>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  sheetWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  surface: {
    flex: 1,
  },
  handleArea: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
  },
  content: {
    flex: 1,
  },
});
