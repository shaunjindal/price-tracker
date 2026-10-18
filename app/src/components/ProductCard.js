import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PriceTag from './PriceTag';
import { colors, radius, spacing } from '../theme';

export default function ProductCard({ product, onPress }) {
  // show first detail (usually Size) as a small subtitle
  const [firstKey, firstValue] = Object.entries(product.details)[0] || [];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        {firstKey ? <Text style={styles.sub}>{firstKey}: {firstValue}</Text> : null}
        <PriceTag price={product.price} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: spacing.xs + 2,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: { width: '100%', aspectRatio: 1, backgroundColor: colors.border },
  body: { padding: spacing.sm + 2, gap: 4 },
  name: { color: colors.text, fontSize: 14, fontWeight: '600', minHeight: 36 },
  sub: { color: colors.muted, fontSize: 12 },
});
