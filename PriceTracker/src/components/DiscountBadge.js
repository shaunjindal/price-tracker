import { Text, View, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';
import { formatPrice } from './PriceTag';

// Small "20% OFF" pill. Renders nothing when there is no discount.
export default function DiscountBadge({ discount, style }) {
  if (!discount) return null;
  const label = discount.percentOff > 0
    ? `${discount.percentOff}% OFF`
    : `${formatPrice(discount.savings)} OFF`;

  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.sale,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  text: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.4 },
});
