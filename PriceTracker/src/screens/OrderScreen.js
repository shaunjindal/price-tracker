import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OrderItemRow from '../components/OrderItemRow';
import OrderSummaryCard from '../components/OrderSummaryCard';
import CustomDiscountPanel from '../components/CustomDiscountPanel';
import BottomSheet from '../components/BottomSheet';
import ManualItemSheet from '../components/ManualItemSheet';
import WhatsAppSheet from '../components/WhatsAppSheet';
import StateView from '../components/StateView';
import { useOrder } from '../context/OrderContext';
import { colors, radius, spacing } from '../theme';

export default function OrderScreen({ navigation }) {
  const { items, totals, setQty, setDiscount, removeItem, addManualItem, clear } = useOrder();
  const insets = useSafeAreaInsets();
  const [editingId, setEditingId] = useState(null);
  const [showManual, setShowManual] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  const editing = items.find((i) => i.product.id === editingId);
  const closeEditor = () => setEditingId(null);

  const confirmClear = () =>
    Alert.alert('Clear order?', 'All items will be removed from this order.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clear },
    ]);

  return (
    <View style={styles.screen}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.product.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <OrderItemRow
            item={item}
            onQtyChange={(q) => setQty(item.product.id, q)}
            onEditDiscount={() => setEditingId(item.product.id)}
            onRemove={() => removeItem(item.product.id)}
          />
        )}
        ListEmptyComponent={
          <StateView
            type="empty"
            message="No items in the order yet. Add products from the catalogue or add a custom item."
            actionLabel="Browse products"
            onAction={() => navigation.goBack()}
          />
        }
        ListFooterComponent={
          <TouchableOpacity style={styles.addCustom} onPress={() => setShowManual(true)} activeOpacity={0.8}>
            <Text style={styles.addCustomText}>＋  Add custom item</Text>
          </TouchableOpacity>
        }
      />

      {items.length > 0 && (
        <View style={[styles.footer, { paddingBottom: spacing.md + insets.bottom }]}>
          <OrderSummaryCard totals={totals} />
          <TouchableOpacity style={styles.whatsapp} onPress={() => setShowWhatsApp(true)} activeOpacity={0.85}>
            <Text style={styles.whatsappText}>Send on WhatsApp</Text>
          </TouchableOpacity>
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => navigation.goBack()}>
              <Text style={styles.btnOutlineText}>Add more items</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={confirmClear}>
              <Text style={styles.btnDangerText}>Clear order</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <BottomSheet visible={!!editing} onClose={closeEditor} title={editing?.product.name}>
        {editing && (
          <CustomDiscountPanel
            key={editing.product.id}
            value={editing.customPercent}
            hint="Applied on this item's original price. Other items are not affected."
            onApply={(p) => {
              setDiscount(editing.product.id, p);
              closeEditor();
            }}
            onReset={() => {
              setDiscount(editing.product.id, null);
              closeEditor();
            }}
          />
        )}
      </BottomSheet>

      <ManualItemSheet visible={showManual} onClose={() => setShowManual(false)} onAdd={addManualItem} />

      <WhatsAppSheet
        visible={showWhatsApp}
        onClose={() => setShowWhatsApp(false)}
        items={items}
        totals={totals}
        onStartNew={clear}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.md, paddingBottom: spacing.sm },
  addCustom: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  addCustomText: { color: colors.primary, fontWeight: '700', fontSize: 15 },
  footer: {
    padding: spacing.md,
    gap: spacing.sm + 2,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  whatsapp: {
    height: 50,
    borderRadius: radius.pill,
    backgroundColor: colors.whatsapp,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsappText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  actions: { flexDirection: 'row', gap: spacing.sm + 2 },
  btn: { flex: 1, height: 44, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  btnOutline: { borderWidth: 1, borderColor: colors.primary },
  btnOutlineText: { color: colors.primary, fontWeight: '700' },
  btnDanger: { backgroundColor: '#FEE2E2' },
  btnDangerText: { color: colors.danger, fontWeight: '700' },
});
