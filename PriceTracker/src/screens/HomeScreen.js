import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../components/SearchBar';
import ChipRow from '../components/ChipRow';
import ProductGrid from '../components/ProductGrid';
import OrderBar from '../components/OrderBar';
import useCategories from '../hooks/useCategories';
import useProducts from '../hooks/useProducts';
import useDebounce from '../hooks/useDebounce';
import { useOrder } from '../context/OrderContext';
import { colors, spacing } from '../theme';

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [subcategoryId, setSubcategoryId] = useState(null);

  const { totals } = useOrder();
  const { categories } = useCategories();
  const debouncedQuery = useDebounce(query);
  const { products, loading, error, retry } = useProducts({
    q: debouncedQuery.trim(),
    category: categoryId,
    subcategory: subcategoryId,
  });

  const subcategories = categories.find((c) => c.id === categoryId)?.subcategories ?? [];

  const selectCategory = (id) => {
    setCategoryId(id);
    setSubcategoryId(null); // reset subcategory when category changes
  };

  const hasOrder = totals.lines > 0;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Maa Handloom</Text>
        <SearchBar value={query} onChangeText={setQuery} />
      </View>
    <View style={styles.subRow}><ChipRow items={categories} selectedId={categoryId} onSelect={selectCategory} /></View>
      {subcategories.length > 0 && (
        <View style={styles.subRow}>
          <ChipRow
            items={subcategories}
            selectedId={subcategoryId}
            onSelect={setSubcategoryId}
            allLabel="All types"
          />
        </View>
      )}

      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onRetry={retry}
        onProductPress={(product) => navigation.navigate('Detail', { product })}
        bottomPadding={hasOrder ? 110 : spacing.lg}
      />

      {hasOrder && <OrderBar totals={totals} onPress={() => navigation.navigate('Order')} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { padding: spacing.md, gap: spacing.md },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subRow: { marginTop: spacing.sm },
});
