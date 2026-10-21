import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatPrice } from './PriceTag';
import { colors, radius, spacing } from '../theme';

// Floating bar shown on the home screen once something is in the order.
export default function OrderBar({ totals, onPress }) {
  const insets = useSafeAreaInsets();
  return (
    <TouchableOpacity
      style={[styles.bar, { bottom: spacing.md + insets.bottom }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View>
        <Text style={styles.count}>
          {totals.lines} {totals.lines === 1 ? 'item' : 'items'} · {totals.pieces.toLocaleString('en-IN')} pcs
        </Text>
        <Text style={styles.label}>View order</Text>
      </View>
      <Text style={styles.total}>{formatPrice(totals.payable)}  ›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  count: { color: '#fff', fontSize: 12, opacity: 0.85 },
  label: { color: '#fff', fontSize: 15, fontWeight: '700' },
  total: { color: '#fff', fontSize: 18, fontWeight: '800' },
});
