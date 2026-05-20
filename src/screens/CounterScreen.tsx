import React, { useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CounterButton } from '../components/CounterButton';
import { useCounter } from '../hooks/useCounter';

export const CounterScreen: React.FC = () => {
  const {
    value,
    incrementCount,
    isResetting,
    history,
    increment,
    decrement,
    reset,
  } = useCounter();

  const handleIncrement = useCallback(() => {
    increment();
  }, [increment]);

  const handleDecrement = useCallback(() => {
    decrement();
  }, [decrement]);

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  const stepsUntilBonus = 5 - (incrementCount % 5);
  const isNextBonus = stepsUntilBonus === 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Counter</Text>
        <View style={styles.displayCard}>
          <Text style={styles.valueText}>{value}</Text>
          <View style={styles.bonusBadge}>
            <Text style={[styles.bonusText, isNextBonus && styles.bonusTextActive]}>
              {isNextBonus
                ? '⚡ Next increment = +5!'
                : `${stepsUntilBonus} taps until +5 bonus`}
            </Text>
          </View>
          {isResetting && (
            <Text style={styles.resettingText}>↓ Resetting…</Text>
          )}
        </View>
        <Text style={styles.hint}>
          Idle for 3 s → auto-decrements every 0.8 s
        </Text>
        <View style={styles.buttonRow}>
          <CounterButton
            label="−"
            onPress={handleDecrement}
            onLongPressRepeat={handleDecrement}
            disabled={value === 0 || isResetting}
            variant="secondary"
          />

          <CounterButton
            label="Reset"
            onPress={handleReset}
            disabled={value === 0}
            variant="danger"
          />

          <CounterButton
            label="+"
            onPress={handleIncrement}
            onLongPressRepeat={handleIncrement}
            disabled={isResetting}
            variant="primary"
          />
        </View>
        <Text style={styles.hint}>Hold + or − for rapid changes</Text>

        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>Recent Values</Text>
          <View style={styles.historyRow}>
            {[...history].reverse().map((val, index) => (
              <View
                key={index}
                style={[
                  styles.historyChip,
                  index === 0 && styles.historyChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.historyChipText,
                    index === 0 && styles.historyChipTextActive,
                  ]}
                >
                  {val}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{incrementCount}</Text>
            <Text style={styles.statLabel}>Total Increments</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{Math.floor(incrementCount / 5)}</Text>
            <Text style={styles.statLabel}>Bonus Fires</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#9CA3AF',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 24,
  },

  displayCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 12,
  },
  valueText: {
    fontSize: 96,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 104,
    fontVariant: ['tabular-nums'],
  },
  bonusBadge: {
    marginTop: 12,
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  bonusText: {
    fontSize: 13,
    color: '#93C5FD',
    fontWeight: '500',
  },
  bonusTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  resettingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '500',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },

  hint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  historyCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  historyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  historyChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  historyChipActive: {
    backgroundColor: '#3B82F6',
  },
  historyChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    fontVariant: ['tabular-nums'],
  },
  historyChipTextActive: {
    color: '#FFFFFF',
  },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
});
