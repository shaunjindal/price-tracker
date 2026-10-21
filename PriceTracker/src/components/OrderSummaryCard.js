import { View, Text, StyleSheet } from 'react-native';
import { formatPrice } from './PriceTag';
import { colors, radius, spacing } from '../theme';

const Row = ({ label, value, valueStyle }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, valueStyle]}>{value}</Text>
  </View>
);

export default function OrderSummaryCard({ totals }) {
  const n = (x) => x.toLocaleString('en-IN');
  return (
    <View style={styles.card}>
      <Row label="Items / Pieces" value={`${n(totals.lines)} / ${n(totals.pieces)}`} />
      <Row label="Original total" value={formatPrice(totals.original)} />
      <Row
        label="Total discount"
        value={totals.savings > 0 ? `− ${formatPrice(totals.savings)}` : formatPrice(0)}
        valueStyle={totals.savings > 0 && styles.green}
      />
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.payLabel}>Total payable</Text>
        <Text style={styles.pay}>{formatPrice(totals.payable)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: colors.muted, fontSize: 14 },
  value: { color: colors.text, fontSize: 14, fontWeight: '600' },
  green: { color: colors.saleText },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 2 },
  payLabel: { color: colors.text, fontSize: 16, fontWeight: '700' },
  pay: { color: colors.primary, fontSize: 24, fontWeight: '800' },
});
