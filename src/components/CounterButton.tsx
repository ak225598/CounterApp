import React, { useCallback, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

interface CounterButtonProps {
  label: string;
  onPress: () => void;
  onLongPressRepeat?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
}

const LONG_PRESS_INITIAL_DELAY = 500; 
const LONG_PRESS_REPEAT_INTERVAL = 100;

export const CounterButton: React.FC<CounterButtonProps> = ({
  label,
  onPress,
  onLongPressRepeat,
  disabled = false,
  variant = 'primary',
  style,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const repeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const animateIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scale]);

  const animateOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  }, [scale]);

  const stopRepeat = useCallback(() => {
    if (repeatIntervalRef.current) {
      clearInterval(repeatIntervalRef.current);
      repeatIntervalRef.current = null;
    }
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    animateOut();
  }, [animateOut]);

  const handlePressIn = useCallback(() => {
    if (disabled) return;
    animateIn();

    if (onLongPressRepeat) {
      longPressTimeoutRef.current = setTimeout(() => {
        onLongPressRepeat();
        repeatIntervalRef.current = setInterval(() => {
          onLongPressRepeat();
        }, LONG_PRESS_REPEAT_INTERVAL);
      }, LONG_PRESS_INITIAL_DELAY);
    }
  }, [disabled, animateIn, onLongPressRepeat]);

  const handlePressOut = useCallback(() => {
    if (disabled) return;
    stopRepeat();
  }, [disabled, stopRepeat]);

  const handlePress = useCallback(() => {
    if (disabled) return;
    if (!repeatIntervalRef.current) {
      onPress();
    }
  }, [disabled, onPress]);

  const bgColor = disabled
    ? COLORS.disabled
    : variant === 'primary'
    ? COLORS.primary
    : variant === 'secondary'
    ? COLORS.secondary
    : COLORS.danger;

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.button,
          { backgroundColor: bgColor, transform: [{ scale }] },
          disabled && styles.buttonDisabled,
          style,
        ]}
      >
        <Text style={[styles.label, disabled && styles.labelDisabled]}>
          {label}
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const COLORS = {
  primary: '#3B82F6',   
  secondary: '#6B7280',
  danger: '#EF4444',
  disabled: '#D1D5DB',
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  labelDisabled: {
    color: '#9CA3AF',
  },
});
