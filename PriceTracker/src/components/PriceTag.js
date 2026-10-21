import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { formatMoney } from '../utils/money';

export const formatPrice = formatMoney;

// Shows the price the customer pays. When it is lower than the catalogue price,
// the catalogue price is shown struck through next to it.
export default function PriceTag({ price, salePrice, size = 16 }) {
  const shown = salePrice != null ? salePrice : price;
  const slashed = shown < price;

  return (
    <View style={styles.row}>
      <Text style={[styles.price, { fontSize: size }, slashed && styles.sale]}>{formatPrice(shown)}</Text>
      {slashed && (
        <Text style={[styles.old, { fontSize: Math.round(size * 0.75) }]}>{formatPrice(price)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 },
  price: { color: colors.primary, fontWeight: '700' },
  sale: { color: colors.text },
  old: { color: colors.muted, textDecorationLine: 'line-through' },
});
