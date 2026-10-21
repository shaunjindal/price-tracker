import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet from './BottomSheet';
import QuantityStepper from './QuantityStepper';
import { formatPrice } from './PriceTag';
import { round2 } from '../utils/orderMath';
import { colors, radius, spacing } from '../theme';

const PRICE_OK = /^\d{1,7}(\.\d{1,2})?$/;

function ManualItemForm({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const [priceText, setPriceText] = useState('');
  const [qty, setQty] = useState(1);

  const price = PRICE_OK.test(priceText) ? Number(priceText) : 0;
  const valid = price > 0;

  const onPriceChange = (t) => {
    const v = t.replace(',', '.');
    if (/^\d{0,7}\.?\d{0,2}$/.test(v)) setPriceText(v);
  };

  const submit = () => {
    if (!valid) return;
    onAdd({ name: name.trim() || 'Custom item', price, qty });
    onClose();
  };

  return (
    <>
      <Text style={styles.label}>Item name (optional)</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Pillow cover"
        placeholderTextColor={colors.muted}
        maxLength={60}
      />

      <Text style={styles.label}>Price per piece</Text>
      <View style={styles.priceBox}>
        <Text style={styles.rupee}>₹</Text>
        <TextInput
          style={styles.priceInput}
          value={priceText}
          onChangeText={onPriceChange}
          placeholder="0"
          placeholderTextColor={colors.muted}
          keyboardType="decimal-pad"
        />
      </View>

      <Text style={styles.label}>Quantity</Text>
      <View style={styles.qtyRow}>
        <QuantityStepper value={qty} onChange={setQty} />
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.total}>{formatPrice(round2(price * qty))}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.addBtn, !valid && styles.addBtnOff]}
        onPress={submit}
        disabled={!valid}
        activeOpacity={0.85}
      >
        <Text style={styles.addText}>Add to order</Text>
      </TouchableOpacity>
    </>
  );
}

export default function ManualItemSheet({ visible, onClose, onAdd }) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Add custom item">
      <ManualItemForm onAdd={onAdd} onClose={onClose} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, color: colors.muted, fontWeight: '600', marginTop: 2 },
  input: {
    height: 46,
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    color: colors.text,
  },
  priceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  rupee: { fontSize: 16, color: colors.muted, marginRight: 6 },
  priceInput: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.text },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  totalBox: { alignItems: 'flex-end' },
  totalLabel: { fontSize: 11, color: colors.muted },
  total: { fontSize: 20, fontWeight: '800', color: colors.text },
  addBtn: {
    marginTop: spacing.sm,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnOff: { backgroundColor: colors.border },
  addText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
