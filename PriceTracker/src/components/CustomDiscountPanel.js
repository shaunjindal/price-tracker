import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { formatPrice } from './PriceTag';
import { getLinePricing } from '../utils/orderMath';
import { initialInput, resetInput, typeInto } from '../utils/priceInput';
import { colors, radius, spacing } from '../theme';

// The worker decides the PRICE PER PIECE, either by typing it or by giving a % discount.
// The total for the quantity is only calculated. Old vs New is shown for both.
// The typed text lives only in this component's own state (so nothing can overwrite it while
// typing); the order is told about every valid change through onChange(pricing | null).
export default function CustomDiscountPanel({ product, qty, value, onChange, onDone, title = 'Set price' }) {
  const [input, setInput] = useState(() => initialInput(value));
  const { priceText, pctText, pricing, error } = input;

  const old = getLinePricing({ product, qty, customPricing: null });
  const next = getLinePricing({ product, qty, customPricing: pricing });
  const changed = Boolean(pricing);

  const onType = (kind, raw) => {
    const r = typeInto(input, kind, raw);
    setInput(r.state);
    if (r.changed) onChange(r.state.pricing);
  };

  const rows = [
    { label: qty > 1 ? 'Per piece' : 'Price', old: old.unitPrice, next: next.unitPrice },
    ...(qty > 1
      ? [{ label: `Total (${qty.toLocaleString('en-IN')} pcs)`, old: old.lineTotal, next: next.lineTotal }]
      : []),
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.fields}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>New price per piece</Text>
          <View style={[styles.inputBox, error && priceText !== '' && styles.inputBoxError]}>
            <Text style={styles.affix}>₹</Text>
            <TextInput
              style={styles.input}
              value={priceText}
              onChangeText={(t) => onType('price', t)}
              placeholder="e.g. 800"
              placeholderTextColor={colors.muted}
              keyboardType="decimal-pad"
              maxLength={11}
            />
          </View>
        </View>

        <Text style={styles.or}>or</Text>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Discount</Text>
          <View style={[styles.inputBox, error && pctText !== '' && styles.inputBoxError]}>
            <TextInput
              style={styles.input}
              value={pctText}
              onChangeText={(t) => onType('percent', t)}
              placeholder="e.g. 10"
              placeholderTextColor={colors.muted}
              keyboardType="decimal-pad"
              maxLength={6}
            />
            <Text style={styles.affix}>%</Text>
          </View>
        </View>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.table}>
        <View style={styles.tRow}>
          <Text style={[styles.tLabel, styles.tHead]} />
          <Text style={[styles.tCell, styles.tHead]}>Old</Text>
          <Text style={[styles.tCell, styles.tHead]}>New</Text>
        </View>
        {rows.map((r) => (
          <View key={r.label} style={styles.tRow}>
            <Text style={styles.tLabel}>{r.label}</Text>
            <Text style={[styles.tCell, styles.tOld, changed && styles.tOldStruck]}>{formatPrice(r.old)}</Text>
            <Text style={[styles.tCell, styles.tNew]}>{formatPrice(r.next)}</Text>
          </View>
        ))}
      </View>
      {product.price !== old.unitPrice && (
        <Text style={styles.note}>Discount % is on the original price of {formatPrice(product.price)} per piece.</Text>
      )}

      <View style={styles.actions}>
        {changed ? (
          <TouchableOpacity
            onPress={() => {
              setInput(resetInput());
              onChange(null);
            }}
            hitSlop={8}
          >
            <Text style={styles.reset}>Reset to old price</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {onDone ? (
          <TouchableOpacity style={styles.doneBtn} onPress={onDone} activeOpacity={0.85}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm + 2,
  },
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
  fields: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  field: { flex: 1, gap: 4 },
  fieldLabel: { fontSize: 12, color: colors.muted, fontWeight: '600' },
  or: { color: colors.muted, fontSize: 13, paddingBottom: 14 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 12,
    gap: 4,
  },
  inputBoxError: { borderColor: colors.danger },
  input: { flex: 1, fontSize: 18, fontWeight: '800', color: colors.text, padding: 0 },
  affix: { fontSize: 15, fontWeight: '700', color: colors.muted },
  error: { color: colors.danger, fontSize: 12, fontWeight: '600' },
  table: { gap: 10, backgroundColor: colors.primarySoft, borderRadius: radius.sm, padding: spacing.md },
  tRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tLabel: { flex: 1.3, color: colors.primary, fontSize: 13, fontWeight: '600' },
  tCell: { flex: 1, textAlign: 'right', fontSize: 15 },
  tHead: { fontSize: 11, color: colors.muted, fontWeight: '700' },
  tOld: { color: colors.muted },
  tOldStruck: { textDecorationLine: 'line-through' },
  tNew: { color: colors.primary, fontWeight: '800', fontSize: 17 },
  note: { fontSize: 11, color: colors.muted },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reset: { color: colors.danger, fontWeight: '600', fontSize: 13 },
  doneBtn: {
    height: 44,
    paddingHorizontal: spacing.lg * 1.5,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
