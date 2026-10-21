import { useState } from 'react';
import { ScrollView, Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PriceTag, { formatPrice } from '../components/PriceTag';
import DiscountBadge from '../components/DiscountBadge';
import DetailRow from '../components/DetailRow';
import CustomDiscountPanel from '../components/CustomDiscountPanel';
import QuantityStepper from '../components/QuantityStepper';
import { useOrder } from '../context/OrderContext';
import { getUnitPricing } from '../utils/orderMath';
import { colors, radius, spacing } from '../theme';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { items, setItem } = useOrder();
  const insets = useSafeAreaInsets();

  // If this product is already in the order, start from its current qty/discount.
  const existing = items.find((i) => i.product.id === product.id);
  const [qty, setQty] = useState(existing?.qty ?? 1);
  const [customPercent, setCustomPercent] = useState(existing?.customPercent ?? null);

  const entries = Object.entries(product.details);
  const { unitPrice, discount, isCustom } = getUnitPricing({ product, customPercent });
  const lineTotal = unitPrice * qty;

  const submit = () => {
    setItem(product, qty, customPercent);
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View>
          <Image source={{ uri: product.image }} style={styles.image} />
          <DiscountBadge discount={discount} style={styles.badge} />
        </View>
        <Text style={styles.name}>{product.name}</Text>
        <PriceTag price={product.price} salePrice={unitPrice} size={26} />
        {discount && discount.savings > 0 && (
          <View style={styles.saveBox}>
            <Text style={styles.saveText}>
              {isCustom ? 'Custom discount: ' : ''}You save {formatPrice(discount.savings)} ({discount.percentOff}% off)
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

      <View style={[styles.bar, { paddingBottom: spacing.md + insets.bottom }]}>
        <QuantityStepper value={qty} onChange={setQty} />
        <TouchableOpacity style={styles.addBtn} onPress={submit} activeOpacity={0.9}>
          <Text style={styles.addText}>
            {existing ? 'Update order' : 'Add to order'} · {formatPrice(lineTotal)}
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
