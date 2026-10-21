import { useEffect } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, View, Text, StyleSheet } from 'react-native';
import CustomDiscountPanel from '../components/CustomDiscountPanel';
import { useOrder } from '../context/OrderContext';
import { colors, spacing } from '../theme';

// Full screen (not a popup) so typing can never dismiss it.
export default function EditPriceScreen({ route, navigation }) {
  const { productId } = route.params;
  const { items, setPricing } = useOrder();
  const item = items.find((i) => i.product.id === productId);

  useEffect(() => {
    if (!item) navigation.goBack(); // the item was removed
  }, [item, navigation]);
  if (!item) return null;

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.head}>
          <Text style={styles.name} numberOfLines={2}>{item.product.name}</Text>
        </View>
        <CustomDiscountPanel
          product={item.product}
          qty={item.qty}
          value={item.customPricing}
          onChange={(p) => setPricing(item.product.id, p)}
          onDone={() => navigation.goBack()}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, gap: spacing.md },
  head: { paddingHorizontal: 2 },
  name: { fontSize: 18, fontWeight: '700', color: colors.text },
});
