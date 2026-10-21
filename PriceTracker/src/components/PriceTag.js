import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { formatMoney } from '../utils/money';

export const formatPrice = formatMoney;

// Shows the sale price, with the original price struck through when slashed.
// All numbers come from the backend (price, salePrice).
export default function PriceTag({ price, salePrice, size = 16 }) {
  const slashed = salePrice != null && salePrice < price;

  return (
    <View style={styles.row}>
      <Text style={[styles.price, { fontSize: size }, slashed && styles.sale]}>
        {formatPrice(slashed ? salePrice : price)}
      </Text>
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
