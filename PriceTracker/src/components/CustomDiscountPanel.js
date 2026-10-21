import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { formatPrice } from './PriceTag';
import { buildDiscount } from '../utils/pricing';
import { getLinePricing, round2 } from '../utils/orderMath';
import { colors, radius, spacing } from '../theme';

const QUICK = { percent: [5, 10, 15, 20, 25], amount: [20, 50, 100, 200, 500] };
const INPUT_OK = { percent: /^\d{0,3}([.,]\d{0,2})?$/, amount: /^\d{0,8}([.,]\d{0,2})?$/ };

function Segmented({ options, value, onChange }) {
  return (
    <View style={styles.seg}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <TouchableOpacity
            key={o.value}
            style={[styles.segItem, active && styles.segItemActive]}
            onPress={() => onChange(o.value)}
            activeOpacity={0.85}
          >
            <Text style={[styles.segText, active && styles.segTextActive]}>{o.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Worker gives a discount as a percentage OR a rupee amount, and sees the result live
// before applying. `value` is the applied discount (or null); the parent owns the state.
export default function CustomDiscountPanel({
  product,
  qty,
  value,
  onApply,
  onReset,
  title = 'Give a discount',
}) {
  const [mode, setMode] = useState(value?.type ?? 'percent');
  const [scope, setScope] = useState(value?.scope ?? (qty > 1 ? 'total' : 'each'));
  const [text, setText] = useState(value ? String(value.value) : '');

  const { discount: draft, error } = buildDiscount({ type: mode, text, scope }, product, qty);
  const preview = draft ? getLinePricing({ product, qty, customDiscount: draft }) : null;
  const before = round2(product.price * qty);
  const showScope = mode === 'amount' && qty > 1;

  const changeMode = (m) => {
    setMode(m);
    setText('');
  };
  const onChangeText = (t) => {
    if (INPUT_OK[mode].test(t)) setText(t.replace(',', '.'));
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <Segmented
        value={mode}
        onChange={changeMode}
        options={[
          { value: 'percent', label: '％  Percent off' },
          { value: 'amount', label: '₹  Amount off' },
        ]}
      />

      <View style={[styles.inputBox, error && styles.inputBoxError]}>
        {mode === 'amount' ? <Text style={styles.affix}>₹</Text> : null}
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={onChangeText}
          placeholder={mode === 'percent' ? 'Type percent, e.g. 10' : 'Type amount, e.g. 100'}
          placeholderTextColor={colors.muted}
          keyboardType="decimal-pad"
          maxLength={11}
        />
        {mode === 'percent' ? <Text style={styles.affix}>%</Text> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.chips}>
        {QUICK[mode].map((n) => {
          const active = text === String(n);
          return (
            <TouchableOpacity
              key={n}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setText(String(n))}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {mode === 'percent' ? `${n}%` : `₹${n}`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {showScope && (
        <View style={styles.scopeBox}>
          <Text style={styles.scopeLabel}>Take this amount off:</Text>
          <Segmented
            value={scope}
            onChange={setScope}
            options={[
              { value: 'total', label: `Whole item (${qty} pcs)` },
              { value: 'each', label: 'Each piece' },
            ]}
          />
        </View>
      )}

      {preview && (
        <View style={styles.preview}>
          <View style={styles.pRow}>
            <Text style={styles.pLabel}>Before discount</Text>
            <Text style={styles.pValue}>{formatPrice(before)}</Text>
          </View>
          <View style={styles.pRow}>
            <Text style={styles.pLabel}>Discount</Text>
            <Text style={[styles.pValue, styles.pGreen]}>− {formatPrice(preview.lineSavings)}</Text>
          </View>
          <View style={styles.pDivider} />
          <View style={styles.pRow}>
            <Text style={styles.pTotalLabel}>New price</Text>
            <Text style={styles.pTotal}>{formatPrice(preview.lineTotal)}</Text>
          </View>
          {qty > 1 && <Text style={styles.pEach}>about {formatPrice(preview.unitPrice)} per piece</Text>}
        </View>
      )}

      <TouchableOpacity
        style={[styles.applyBtn, !draft && styles.applyBtnOff]}
        onPress={() => draft && onApply(draft)}
        disabled={!draft}
        activeOpacity={0.85}
      >
        <Text style={styles.applyText}>{value ? 'Update discount' : 'Apply discount'}</Text>
      </TouchableOpacity>

      {value ? (
        <TouchableOpacity
          onPress={() => {
            setText('');
            onReset();
          }}
          hitSlop={8}
        >
          <Text style={styles.reset}>Remove discount</Text>
        </TouchableOpacity>
      ) : null}
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
  seg: {
    flexDirection: 'row',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    padding: 3,
  },
  segItem: { flex: 1, height: 38, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  segItemActive: { backgroundColor: colors.primary },
  segText: { color: colors.primary, fontWeight: '600', fontSize: 13 },
  segTextActive: { color: '#fff' },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    gap: 6,
  },
  inputBoxError: { borderColor: colors.danger },
  input: { flex: 1, fontSize: 20, fontWeight: '700', color: colors.text },
  affix: { fontSize: 18, fontWeight: '700', color: colors.muted },
  error: { color: colors.danger, fontSize: 12, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  chipActive: { backgroundColor: colors.primary },
  chipText: { color: colors.primary, fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: '#fff' },
  scopeBox: { gap: 6 },
  scopeLabel: { fontSize: 12, color: colors.muted, fontWeight: '600' },
  preview: {
    backgroundColor: colors.saleSoft,
    borderRadius: radius.sm,
    padding: spacing.md,
    gap: 6,
  },
  pRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pLabel: { color: colors.saleText, fontSize: 13 },
  pValue: { color: colors.text, fontSize: 14, fontWeight: '600' },
  pGreen: { color: colors.saleText },
  pDivider: { height: 1, backgroundColor: '#BBF7D0' },
  pTotalLabel: { color: colors.saleText, fontSize: 15, fontWeight: '700' },
  pTotal: { color: colors.text, fontSize: 22, fontWeight: '800' },
  pEach: { color: colors.saleText, fontSize: 12, textAlign: 'right' },
  applyBtn: {
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnOff: { backgroundColor: colors.border },
  applyText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  reset: { color: colors.danger, fontWeight: '600', fontSize: 13, textAlign: 'center' },
});
