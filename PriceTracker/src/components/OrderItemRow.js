import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import PriceTag, { formatPrice } from './PriceTag';
import DiscountBadge from './DiscountBadge';
import QuantityStepper from './QuantityStepper';
import { getUnitPricing, getLineTotal } from '../utils/orderMath';
import { colors, radius, spacing } from '../theme';

// One line of the order: image, name, unit price, qty stepper, line total.
// Catalogue items can also get a custom discount (for THIS line only).
// Manual items have no image and no discount.
export default function OrderItemRow({ item, onQtyChange, onEditDiscount, onRemove }) {
  const { product, qty, customPercent } = item;
  const { unitPrice, discount, isCustom } = getUnitPricing(item);
  const [firstKey, firstValue] = Object.entries(product.details)[0] || [];

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={styles.placeholderIcon}>🧾</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
          {product.isManual ? (
            <Text style={styles.sub}>Custom item</Text>
          ) : firstKey ? (
            <Text style={styles.sub}>{firstKey}: {firstValue}</Text>
          ) : null}
          <View style={styles.priceRow}>
            <PriceTag price={product.price} salePrice={unitPrice} size={15} />
            <DiscountBadge discount={discount} />
          </View>
        </View>
        <TouchableOpacity onPress={onRemove} hitSlop={10}>
          <Text style={styles.remove}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottom}>
        <QuantityStepper value={qty} onChange={onQtyChange} compact />
        <View style={styles.totalBox}>
          <Text style={styles.total}>{formatPrice(getLineTotal(item))}</Text>
          <Text style={styles.calc}>{qty.toLocaleString('en-IN')} × {formatPrice(unitPrice)}</Text>
        </View>
      </View>

      {!product.isManual && (
        <TouchableOpacity
          style={[styles.discBtn, isCustom && styles.discBtnActive]}
          onPress={onEditDiscount}
          activeOpacity={0.8}
        >
          <Text style={[styles.discText, isCustom && styles.discTextActive]}>
            {isCustom ? `Custom discount ${customPercent}% · Edit` : '％  Add custom discount'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm + 2,
  },
  top: { flexDirection: 'row', gap: spacing.sm + 2 },
  image: { width: 64, height: 64, borderRadius: radius.sm, backgroundColor: colors.border },
  placeholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  placeholderIcon: { fontSize: 26 },
  info: { flex: 1, gap: 3 },
  name: { fontSize: 14, fontWeight: '600', color: colors.text },
  sub: { fontSize: 12, color: colors.muted },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  remove: { fontSize: 16, color: colors.muted, paddingLeft: 4 },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  totalBox: { alignItems: 'flex-end' },
  total: { fontSize: 18, fontWeight: '800', color: colors.text },
  calc: { fontSize: 11, color: colors.muted },
  discBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  discBtnActive: { backgroundColor: colors.saleSoft },
  discText: { color: colors.primary, fontWeight: '600', fontSize: 12 },
  discTextActive: { color: colors.saleText },
});
