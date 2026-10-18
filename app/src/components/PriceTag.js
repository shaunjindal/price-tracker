import { Text } from 'react-native';
import { colors } from '../theme';

export const formatPrice = (price) => `₹${Number(price).toLocaleString('en-IN')}`;

export default function PriceTag({ price, size = 16 }) {
  return (
    <Text style={{ color: colors.primary, fontWeight: '700', fontSize: size }}>
      {formatPrice(price)}
    </Text>
  );
}
