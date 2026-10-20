import { useState } from 'react';
import { ScrollView, Image, View, Text, StyleSheet } from 'react-native';
import PriceTag, { formatPrice } from '../components/PriceTag';
import DiscountBadge from '../components/DiscountBadge';
import DetailRow from '../components/DetailRow';
import CustomDiscountPanel from '../components/CustomDiscountPanel';
import { applyCustomDiscount } from '../utils/pricing';
import { colors, radius, spacing } from '../theme';

export default function ProductDetailScreen({ route }) {
  const { product } = route.params;
  const entries = Object.entries(product.details);

  // Worker-entered percentage (UI only, resets when leaving this screen).
  // When set, it replaces the backend discount and is applied on the original price.
  const [customPercent, setCustomPercent] = useState(null);
  const custom = customPercent ? applyCustomDiscount(product.price, customPercent) : null;

  const salePrice = custom ? custom.salePrice : product.salePrice;
  const discount = custom
    ? { percentOff: customPercent, savings: custom.savings }
    : product.discount;

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View>
        <Image source={{ uri: product.image }} style={styles.image} />
        <DiscountBadge discount={discount} style={styles.badge} />
      </View>
      <Text style={styles.name}>{product.name}</Text>
      <PriceTag price={product.price} salePrice={salePrice} size={26} />
      {discount && discount.savings > 0 && (
        <View style={styles.saveBox}>
          <Text style={styles.saveText}>
            {custom ? 'Custom discount: ' : ''}You save {formatPrice(discount.savings)} ({discount.percentOff}% off)
          </Text>
        </View>
      )}

      <CustomDiscountPanel
        value={customPercent}
        onApply={setCustomPercent}
        onReset={() => setCustomPercent(null)}
      />

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
  badge: { position: 'absolute', top: spacing.md, left: spacing.md },
  name: { fontSize: 22, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  saveBox: {
    alignSelf: 'flex-start',
    backgroundColor: colors.saleSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  saveText: { color: colors.saleText, fontWeight: '700', fontSize: 13 },
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
