import { useState } from 'react';
import { ScrollView, Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PriceTag, { formatPrice } from '../components/PriceTag';
import DiscountBadge from '../components/DiscountBadge';
import DetailRow from '../components/DetailRow';
import CustomDiscountPanel from '../components/CustomDiscountPanel';
import QuantityStepper from '../components/QuantityStepper';
import { useOrder } from '../context/OrderContext';
import { getLinePricing } from '../utils/orderMath';
import { colors, radius, spacing } from '../theme';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { items, setItem } = useOrder();
  const insets = useSafeAreaInsets();

  // If this product is already in the order, start from its current qty/discount.
  const existing = items.find((i) => i.product.id === product.id);
  const [qty, setQty] = useState(existing?.qty ?? 1);
  const [customPricing, setCustomPricing] = useState(existing?.customPricing ?? null);

  const entries = Object.entries(product.details);
  const pricing = getLinePricing({ product, qty, customPricing });

  const submit = () => {
    setItem(product, qty, customPricing);
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View>
          <Image source={{ uri: product.image }} style={styles.image} />
          <DiscountBadge label={pricing.label} style={styles.badge} />
        </View>
        <Text style={styles.name}>{product.name}</Text>
        <PriceTag price={product.price} salePrice={pricing.unitPrice} size={26} />
        {pricing.kind === 'price' ? (
          <View style={styles.saveBox}>
            <Text style={styles.saveText}>
              New price: {formatPrice(customPricing.value)} per piece
            </Text>
          </View>
        ) : (
          pricing.lineSavings > 0 && (
            <View style={styles.saveBox}>
              <Text style={styles.saveText}>
                You save {formatPrice(pricing.lineSavings)}
                {qty > 1 ? ` on ${qty.toLocaleString('en-IN')} pcs` : ''} ({pricing.percentOff}% off)
              </Text>
            </View>
          )
        )}

        <CustomDiscountPanel
          product={product}
          qty={qty}
          value={customPricing}
          onChange={setCustomPricing}
        />

        <Text style={styles.description}>{product.description}</Text>

        <Text style={styles.section}>Details</Text>
        <View style={styles.card}>
          {entries.map(([label, value], i) => (
            <DetailRow key={label} label={label} value={value} isLast={i === entries.length - 1} />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.bar, { paddingBottom: spacing.md + insets.bottom }]}>
        <QuantityStepper value={qty} onChange={setQty} />
        <TouchableOpacity style={styles.addBtn} onPress={submit} activeOpacity={0.9}>
          <Text style={styles.addText}>
            {existing ? 'Update order' : 'Add to order'} · {formatPrice(pricing.lineTotal)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.lg * 2 },
  image: { width: '100%', aspectRatio: 1, borderRadius: radius.md, backgroundColor: colors.border },
  badge: { position: 'absolute', top: spacing.md, left: spacing.md },
  name: { fontSize: 22, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  saveBox: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  saveText: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  wholePrice: { fontSize: 26, fontWeight: '700', color: colors.primary },
  wholeFor: { fontSize: 15, fontWeight: '600', color: colors.muted },
  description: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  section: { fontSize: 17, fontWeight: '700', color: colors.text, marginTop: spacing.md },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addBtn: {
    flex: 1,
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
