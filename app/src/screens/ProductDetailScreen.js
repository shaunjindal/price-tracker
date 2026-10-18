import { ScrollView, Image, View, Text, StyleSheet } from 'react-native';
import PriceTag from '../components/PriceTag';
import DetailRow from '../components/DetailRow';
import { colors, radius, spacing } from '../theme';

export default function ProductDetailScreen({ route }) {
  const { product } = route.params;
  const entries = Object.entries(product.details);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <PriceTag price={product.price} size={24} />
      <Text style={styles.description}>{product.description}</Text>

      <Text style={styles.section}>Details</Text>
      <View style={styles.card}>
        {entries.map(([label, value], i) => (
          <DetailRow key={label} label={label} value={value} isLast={i === entries.length - 1} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.lg * 2 },
  image: { width: '100%', aspectRatio: 1, borderRadius: radius.md, backgroundColor: colors.border },
  name: { fontSize: 22, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  description: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  section: { fontSize: 17, fontWeight: '700', color: colors.text, marginTop: spacing.md },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
